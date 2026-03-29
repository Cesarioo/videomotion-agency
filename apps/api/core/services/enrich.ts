import { Resolver } from 'dns/promises';
import { Socket } from 'net';
import { getCompany, updateCompany } from './companies.js';
import { parseUrl } from './parser.js';
import { askOpenAI, type JsonSchema } from './llm.js';

// JSON Schema for brand enrichment response
const ENRICHMENT_SCHEMA: JsonSchema = {
  name: 'brand_enrichment',
  schema: {
    type: 'object',
    properties: {
      primaryColor: { type: 'string' },
      secondaryColor: { type: 'string' },
      valueProp: { type: 'string' },
      features: { type: 'array', items: { type: 'string' } },
      targetAudience: { type: 'string' },
      voiceTone: { type: 'string' },
    },
    required: [
      'primaryColor',
      'secondaryColor',
      'valueProp',
      'features',
      'targetAudience',
      'voiceTone',
    ],
    additionalProperties: false,
  },
};

export interface EnrichmentResult {
  primaryColor: string;
  secondaryColor: string;
  valueProp: string;
  features: string[];
  targetAudience: string;
  voiceTone: string;
  logoUrl: string | null;
}

// Language names for prompts
const LANGUAGE_NAMES: Record<string, string> = {
  'a': 'American English',
  'b': 'British English',
  'e': 'Spanish',
  'f': 'French',
};

const getSystemPrompt = (languageCode: string) => {
  const languageName = LANGUAGE_NAMES[languageCode] || 'American English';
  
  return `You are a brand analyst. Analyze the provided website data and extract key brand information.

You MUST respond with ONLY a valid JSON object (no markdown, no explanation, no code blocks) with this exact structure:
{
  "primaryColor": "#hexcolor",
  "secondaryColor": "#hexcolor",
  "valueProp": "The main value proposition of the company in one sentence",
  "features": ["feature1", "feature2", "feature3"],
  "targetAudience": "Description of the target audience",
  "voiceTone": "Description of the brand voice tone (e.g., professional, friendly, innovative)"
}

IMPORTANT: The valueProp, features, targetAudience, and voiceTone fields MUST be written in ${languageName}.

Guidelines:
- For colors: Pick the most prominent brand colors from the provided color data (not white/black unless they're truly the brand colors)
- For valueProp: Identify what makes this company unique and valuable to customers (in ${languageName})
- For features: List 3-5 key services, products, or capabilities (in ${languageName})
- For targetAudience: Describe who the company is trying to reach (in ${languageName})
- For voiceTone: Analyze the text to determine the communication style (in ${languageName})`;
};

/**
 * Enrich a company's data by parsing their website and using AI to extract brand information
 * @param companyId The ID of the company to enrich
 * @returns The enriched data that was applied to the company
 */
export async function enrichCompany(companyId: string): Promise<EnrichmentResult> {
  console.log(`[Enrich] Starting enrichment for company ${companyId}`);

  // Step 1: Get company and website URL
  const company = await getCompany(companyId);
  if (!company) {
    throw new Error(`Company not found: ${companyId}`);
  }

  if (!company.websiteUrl) {
    throw new Error(`Company ${companyId} has no website URL`);
  }

  console.log(`[Enrich] Parsing website: ${company.websiteUrl}`);

  // Step 2: Parse the website
  const parsedData = await parseUrl(company.websiteUrl);

  // Step 3: Prepare prompt for ChatGPT
  const prompt = `Analyze this website data and extract brand information:

WEBSITE: ${company.websiteUrl}
COMPANY NAME: ${company.name}

TEXT CONTENT (first 3000 chars):
${parsedData.text.slice(0, 3000)}

TOP BACKGROUND COLORS (by area coverage):
${JSON.stringify(Object.entries(parsedData.colors.background).slice(0, 10), null, 2)}

TOP TEXT COLORS (by prominence):
${JSON.stringify(Object.entries(parsedData.colors.typography).slice(0, 10), null, 2)}

TOP SCREENSHOT COLORS (by pixel count):
${JSON.stringify(Object.entries(parsedData.colors.screenshotPixels).slice(0, 10), null, 2)}

Based on this data, provide the JSON response with primaryColor, secondaryColor, valueProp, features, targetAudience, and voiceTone.`;

  // Get the company's preferred language (default to 'a' for American English)
  const preferredLanguage = company.preferredLanguage || 'a';
  const languageName = LANGUAGE_NAMES[preferredLanguage] || 'American English';

  console.log(`[Enrich] Sending data to OpenAI (language: ${languageName})...`);

  // Step 4: Get AI analysis with enforced JSON schema
  const enrichedData = await askOpenAI<Omit<EnrichmentResult, 'logoUrl'>>(prompt, {
    systemPrompt: getSystemPrompt(preferredLanguage),
    temperature: 0.3, // Lower temperature for more consistent JSON output
    maxTokens: 1000,
    jsonSchema: ENRICHMENT_SCHEMA, // Enforce structured JSON output
  });

  console.log(`[Enrich] AI response received as JSON object`);

  // Validate required fields
  if (!enrichedData.primaryColor || !enrichedData.secondaryColor || !enrichedData.valueProp || 
      !enrichedData.features || !enrichedData.targetAudience || !enrichedData.voiceTone) {
    throw new Error('AI response missing required fields');
  }

  console.log(`[Enrich] Updating company with enriched data...`);

  // Step 6: Update the company (include logo if found)
  const updateData: Parameters<typeof updateCompany>[1] = {
    primaryColor: enrichedData.primaryColor,
    secondaryColor: enrichedData.secondaryColor,
    valueProp: enrichedData.valueProp,
    features: enrichedData.features,
    targetAudience: enrichedData.targetAudience,
    voiceTone: enrichedData.voiceTone,
  };

  // Only update logoUrl if we found one from parsing
  if (parsedData.logoUrl) {
    updateData.logoUrl = parsedData.logoUrl;
    console.log(`[Enrich] Logo URL found and will be updated: ${parsedData.logoUrl}`);
  }

  await updateCompany(companyId, updateData);

  console.log(`[Enrich] Company ${companyId} enriched successfully`);

  // Add logoUrl to the result
  return {
    ...enrichedData,
    logoUrl: parsedData.logoUrl,
  };
}

// ============================================================================
// EMAIL ENRICHMENT - DNS & SMTP Functions
// ============================================================================

const UNBOUND_DNS_PORT = 5353;
const UNBOUND_DNS_HOST = '127.0.0.1';

// SMTP verification options
export interface SmtpVerifyOptions {
  heloDomain: string;
  mailFromAddress: string;
}

// Socket factory type - allows worker to inject SOCKS5-wrapped socket creation
export type SocketFactory = (targetHost: string, targetPort: number) => Promise<Socket>;

/**
 * Lookup MX records for a domain using unbound DNS resolver on port 5353
 * @param domain The domain to lookup MX records for
 * @returns Array of MX server hostnames sorted by priority
 */
export async function lookupMXRecords(domain: string): Promise<string[]> {
  console.log(`[EmailEnrich] Looking up MX records for domain: ${domain}`);
  
  const resolver = new Resolver();
  resolver.setServers([`${UNBOUND_DNS_HOST}:${UNBOUND_DNS_PORT}`]);
  
  try {
    const records = await resolver.resolveMx(domain);
    const sortedRecords = records
      .sort((a, b) => a.priority - b.priority)
      .map(r => r.exchange);
    
    console.log(`[EmailEnrich] Found ${sortedRecords.length} MX records for ${domain}:`, sortedRecords);
    return sortedRecords;
  } catch (error) {
    console.error(`[EmailEnrich] Failed to lookup MX records for ${domain}:`, error);
    throw new Error(`MX lookup failed for ${domain}: ${error}`);
  }
}

/**
 * Generate email variants based on first name and last name
 * @param firstName The first name
 * @param lastName The last name
 * @param domain The email domain
 * @returns Array of possible email addresses
 */
export function generateEmailVariants(firstName: string, lastName: string, domain: string): string[] {
  // Normalize names: lowercase and remove special characters
  const first = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
  const last = lastName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
  
  if (!first || !last) {
    console.warn(`[EmailEnrich] Invalid name for email generation: "${firstName}" "${lastName}"`);
    return [];
  }
  
  const variants = [
    `${first}.${last}@${domain}`,     // first.last@domain
    `${first}${last}@${domain}`,       // firstlast@domain
    `${first}@${domain}`,              // first@domain
    `${first[0]}.${last}@${domain}`,   // f.last@domain
    `${first[0]}${last}@${domain}`,    // flast@domain
  ];
  
  console.log(`[EmailEnrich] Generated ${variants.length} email variants for ${firstName} ${lastName}@${domain}`);
  return variants;
}

/**
 * Send an SMTP command and wait for response
 */
function sendSmtpCommand(socket: Socket, command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`SMTP command timeout: ${command}`));
    }, 10000);
    
    socket.once('data', (data) => {
      clearTimeout(timeout);
      resolve(data.toString());
    });
    
    socket.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    
    socket.write(command + '\r\n');
  });
}

/**
 * Wait for initial SMTP greeting
 */
function waitForGreeting(socket: Socket): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('SMTP greeting timeout'));
    }, 15000);
    
    socket.once('data', (data) => {
      clearTimeout(timeout);
      resolve(data.toString());
    });
    
    socket.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

/**
 * Verify multiple emails using a single SMTP connection
 * Keeps the connection open while trying all variants (RCPT TO for each)
 * @param emails Array of email addresses to verify
 * @param mxServer The MX server to connect to
 * @param socketFactory Function to create socket connection (allows SOCKS5 wrapping from worker)
 * @param smtpOptions SMTP configuration options (HELO domain, MAIL FROM address)
 * @param delayBetweenMs Delay between RCPT TO commands (random between min and max)
 * @returns The first valid email found, or null if none found
 */
export async function verifyEmailsViaSMTP(
  emails: string[],
  mxServer: string,
  socketFactory: SocketFactory,
  smtpOptions: SmtpVerifyOptions,
  delayBetweenMs: { min: number; max: number } = { min: 500, max: 2000 }
): Promise<string | null> {
  let socket: Socket | null = null;
  
  try {
    console.log(`[EmailEnrich] Connecting to SMTP server ${mxServer} to verify ${emails.length} emails`);
    
    // Connect using the provided socket factory (may be wrapped in SOCKS5)
    socket = await socketFactory(mxServer, 25);
    
    // Wait for greeting
    const greeting = await waitForGreeting(socket);
    console.log(`[EmailEnrich] SMTP Greeting: ${greeting.trim()}`);
    
    if (!greeting.startsWith('220')) {
      console.log(`[EmailEnrich] Invalid SMTP greeting for ${mxServer}`);
      return null;
    }
    
    // Send EHLO first (preferred), fall back to HELO
    let heloResponse = await sendSmtpCommand(socket, `EHLO ${smtpOptions.heloDomain}`);
    console.log(`[EmailEnrich] EHLO response: ${heloResponse.trim()}`);
    
    if (!heloResponse.startsWith('250')) {
      // Try HELO as fallback
      heloResponse = await sendSmtpCommand(socket, `HELO ${smtpOptions.heloDomain}`);
      console.log(`[EmailEnrich] HELO response: ${heloResponse.trim()}`);
      
      if (!heloResponse.startsWith('250')) {
        console.log(`[EmailEnrich] EHLO/HELO rejected by ${mxServer}`);
        return null;
      }
    }
    
    // Send MAIL FROM with configurable address
    const mailFromResponse = await sendSmtpCommand(socket, `MAIL FROM:<${smtpOptions.mailFromAddress}>`);
    console.log(`[EmailEnrich] MAIL FROM response: ${mailFromResponse.trim()}`);
    
    if (!mailFromResponse.startsWith('250')) {
      console.log(`[EmailEnrich] MAIL FROM rejected by ${mxServer}`);
      return null;
    }
    
    // Try each email variant with RCPT TO (keeping connection open)
    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      
      // Random delay between attempts (except for first one)
      if (i > 0) {
        const delay = Math.floor(Math.random() * (delayBetweenMs.max - delayBetweenMs.min + 1)) + delayBetweenMs.min;
        console.log(`[EmailEnrich] Sleeping for ${delay}ms before next RCPT TO`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Send RCPT TO - this is the key verification step
      const rcptToResponse = await sendSmtpCommand(socket, `RCPT TO:<${email}>`);
      console.log(`[EmailEnrich] RCPT TO response for ${email}: ${rcptToResponse.trim()}`);
      
      // 250 = accepted, 251 = forwarded (both mean email exists)
      if (rcptToResponse.startsWith('250') || rcptToResponse.startsWith('251')) {
        console.log(`[EmailEnrich] Found valid email: ${email}`);
        
        // Send QUIT before returning
        try {
          await sendSmtpCommand(socket, 'QUIT');
        } catch {
          // Ignore quit errors
        }
        
        return email;
      }
    }
    
    // No valid email found, send QUIT
    console.log(`[EmailEnrich] No valid email found after trying ${emails.length} variants`);
    try {
      await sendSmtpCommand(socket, 'QUIT');
    } catch {
      // Ignore quit errors
    }
    
    return null;
  } catch (error) {
    console.error(`[EmailEnrich] SMTP verification error:`, error);
    return null;
  } finally {
    if (socket) {
      socket.destroy();
    }
  }
}

// Options for findEmailForPerson
export interface FindEmailOptions {
  socketFactory: SocketFactory;
  smtpOptions: SmtpVerifyOptions;
  minDelayMs?: number;
  maxDelayMs?: number;
}

/**
 * Find a valid email for a person by trying different email variants via SMTP verification
 * Uses a single SMTP connection to try all variants (keeps connection open)
 * @param firstName First name of the person
 * @param lastName Last name of the person
 * @param domain Email domain to check
 * @param mxServer The MX server to connect to (pre-resolved)
 * @param options Configuration options including socket factory and SMTP settings
 * @returns The first valid email found, or null if none found
 */
export async function findEmailForPerson(
  firstName: string,
  lastName: string,
  domain: string,
  mxServer: string,
  options: FindEmailOptions
): Promise<string | null> {
  const { socketFactory, smtpOptions, minDelayMs = 500, maxDelayMs = 2000 } = options;
  
  console.log(`[EmailEnrich] Starting email search for ${firstName} ${lastName}@${domain} via MX ${mxServer}`);
  
  // Generate email variants
  const emailVariants = generateEmailVariants(firstName, lastName, domain);
  
  if (emailVariants.length === 0) {
    console.log(`[EmailEnrich] Could not generate email variants for ${firstName} ${lastName}`);
    return null;
  }
  
  // Try all email variants using a single SMTP connection
  const validEmail = await verifyEmailsViaSMTP(
    emailVariants,
    mxServer,
    socketFactory,
    smtpOptions,
    { min: minDelayMs, max: maxDelayMs }
  );
  
  return validEmail;
}

/**
 * Extract domain from a URL
 * @param url The URL to extract domain from
 * @returns The domain without protocol or path
 */
export function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    // Fallback: try to extract domain from string
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}
