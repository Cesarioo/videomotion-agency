import { config } from 'dotenv';

config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.warn('Missing ELEVENLABS_API_KEY environment variable. Text-to-speech will not work.');
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
