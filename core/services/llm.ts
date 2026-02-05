import { config } from 'dotenv';

config();

const KOKORO_API_URL = process.env.KOKORO_API_URL || 'http://localhost:8880';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY environment variable. OpenAI queries will not work.');
}

// Voice IDs for Kokoro TTS
const VOICE_IDS = {
  male: 'am_adam',
  female: 'af_heart',
} as const;

export type VoiceType = keyof typeof VOICE_IDS;

// Supported language codes for Kokoro TTS
export type LanguageCode = 'a' | 'b' | 'e' | 'f';

/**
 * Generates speech audio from text using Kokoro TTS API
 * @param text The text to convert to speech
 * @param voiceType The voice type to use ('male' or 'female')
 * @param langCode The language code to use ('a'=American English, 'b'=British English, 'e'=Spanish, 'f'=French)
 * @returns Buffer containing the MP3 audio data
 */
export async function textToSpeech(text: string, voiceType: VoiceType, langCode: LanguageCode = 'a'): Promise<Buffer> {
  const voice = VOICE_IDS[voiceType];

  const response = await fetch(`${KOKORO_API_URL}/v1/audio/speech`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'kokoro',
      input: text,
      voice: voice,
      response_format: 'mp3',
      speed: 1.0,
      stream: false,
      lang_code: langCode,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kokoro TTS API error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ============================================================================
// OpenAI
// ============================================================================

export interface JsonSchema { 
  name: string;
  schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
    additionalProperties?: boolean;
  };
}

export interface OpenAIOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: JsonSchema;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Send a query to OpenAI GPT-4o-mini
 * @param prompt The user prompt to send
 * @param options Optional configuration (systemPrompt, temperature, maxTokens, jsonSchema)
 * @returns The assistant's response text, or parsed JSON if jsonSchema is provided
 */
export async function askOpenAI<T = string>(
  prompt: string, 
  options?: OpenAIOptions
): Promise<T> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const messages: ChatMessage[] = [];

  if (options?.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  messages.push({ role: 'user', content: prompt });

  // Build request body
  const requestBody: Record<string, unknown> = {
    model: 'gpt-4o-mini',
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1000,
  };

  // Add JSON schema response format if provided
  if (options?.jsonSchema) {
    requestBody.response_format = {
      type: 'json_schema',
      json_schema: {
        name: options.jsonSchema.name,
        schema: options.jsonSchema.schema,
      },
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';

  // Parse and return JSON if jsonSchema is provided
  if (options?.jsonSchema) {
    try {
      return JSON.parse(content) as T;
    } catch (parseError) {
      throw new Error(`Failed to parse OpenAI JSON response: ${parseError}`);
    }
  }

  return content as T;
}
