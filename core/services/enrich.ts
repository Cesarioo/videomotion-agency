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

const SYSTEM_PROMPT = `You are a brand analyst. Analyze the provided website data and extract key brand information.

You MUST respond with ONLY a valid JSON object (no markdown, no explanation, no code blocks) with this exact structure:
{
  "primaryColor": "#hexcolor",
  "secondaryColor": "#hexcolor",
  "valueProp": "The main value proposition of the company in one sentence",
  "features": ["feature1", "feature2", "feature3"],
  "targetAudience": "Description of the target audience",
  "voiceTone": "Description of the brand voice tone (e.g., professional, friendly, innovative)"
}

Guidelines:
- For colors: Pick the most prominent brand colors from the provided color data (not white/black unless they're truly the brand colors)
- For valueProp: Identify what makes this company unique and valuable to customers
- For features: List 3-5 key services, products, or capabilities
- For targetAudience: Describe who the company is trying to reach
- For voiceTone: Analyze the text to determine the communication style`;

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

  console.log(`[Enrich] Sending data to OpenAI...`);

  // Step 4: Get AI analysis with enforced JSON schema
  const enrichedData = await askOpenAI<Omit<EnrichmentResult, 'logoUrl'>>(prompt, {
    systemPrompt: SYSTEM_PROMPT,
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
