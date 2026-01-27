import { FastifyInstance } from 'fastify';
import { textToSpeech, VoiceType } from '@/core/services/llm.js';

interface TextToSpeechBody {
  text: string;
  voiceType: VoiceType;
}

export default async function llmRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: TextToSpeechBody }>('/llm/text-to-speech', {
    schema: {
      description: 'Generate speech audio from text using ElevenLabs',
      tags: ['LLM'],
      body: {
        type: 'object',
        required: ['text', 'voiceType'],
        properties: {
          text: { type: 'string', description: 'The text to convert to speech' },
          voiceType: { type: 'string', enum: ['male', 'female'], description: 'Voice type to use' },
        },
      },
      response: {
        200: {
          description: 'MP3 audio file',
          type: 'string',
          format: 'binary',
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { text, voiceType } = request.body;

      if (!text || text.trim().length === 0) {
        return reply.code(400).send({ error: 'Text is required and cannot be empty' });
      }

      request.log.info({ voiceType, textLength: text.length }, 'Starting text-to-speech...');
      const audioBuffer = await textToSpeech(text, voiceType);

      return reply
        .code(200)
        .header('Content-Type', 'audio/mpeg')
        .header('Content-Disposition', `attachment; filename="speech-${Date.now()}.mp3"`)
        .send(audioBuffer);
    } catch (error) {
      request.log.error(error, 'Failed to generate speech');
      return reply.code(500).send({ error: 'Failed to generate speech', details: String(error) });
    }
  });
}
