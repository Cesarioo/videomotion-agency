import { config } from 'dotenv';

config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.warn('Missing ELEVENLABS_API_KEY environment variable. Text-to-speech will not work.');
}

if (!OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY environment variable. OpenAI queries will not work.');
}

// Voice IDs for ElevenLabs
const VOICE_IDS = {
  male: 'SsJLg1gKCvNqFh6NtSRp',
  female: 'hpp4J3VqNfWAUOO0d1Us',
} as const;

export type VoiceType = keyof typeof VOICE_IDS;

/**
 * Generates speech audio from text using ElevenLabs API
 * @param text The text to convert to speech
 * @param voiceType The voice type to use ('male' or 'female')
 * @returns Buffer containing the MP3 audio data
 */
export async function textToSpeech(text: string, voiceType: VoiceType): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const voiceId = VOICE_IDS[voiceType];

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.8,
        similarity_boost: 0.8,
        speed: 1,
        speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
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
      model: 'gpt-4o-mini',
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
