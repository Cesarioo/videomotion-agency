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

/**
 * Generates speech audio from text using Kokoro TTS API
 * @param text The text to convert to speech
 * @param voiceType The voice type to use ('male' or 'female')
 * @returns Buffer containing the MP3 audio data
 */
export async function textToSpeech(text: string, voiceType: VoiceType): Promise<Buffer> {
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
      lang_code: 'a',
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

export interface OpenAIOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Send a query to OpenAI GPT-4o-mini
 * @param prompt The user prompt to send
 * @param options Optional configuration (systemPrompt, temperature, maxTokens)
 * @returns The assistant's response text
 */
export async function askOpenAI(prompt: string, options?: OpenAIOptions): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const messages: ChatMessage[] = [];

  if (options?.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }

  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-nano',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}
