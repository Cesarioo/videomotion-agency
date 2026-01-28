import { FastifyInstance } from 'fastify';
import { textToSpeech, VoiceType, askOpenAI } from '@/core/services/llm.js';

interface TextToSpeechBody {
  text: string;
  voiceType: VoiceType;
}

interface AskOpenAIBody {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
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

  // OpenAI - Simple prompt/response
  fastify.post<{ Body: AskOpenAIBody }>('/llm/ask', {
    schema: {
      description: 'Send a prompt to OpenAI GPT-4o-mini and get a response',
      tags: ['LLM'],
      body: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string', description: 'The prompt to send to OpenAI' },
          systemPrompt: { type: 'string', description: 'Optional system prompt to set context' },
          temperature: { type: 'number', minimum: 0, maximum: 2, description: 'Sampling temperature (0-2)' },
          maxTokens: { type: 'number', minimum: 1, description: 'Maximum tokens in response' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            response: { type: 'string', description: 'The AI response' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { prompt, systemPrompt, temperature, maxTokens } = request.body;

      if (!prompt || prompt.trim().length === 0) {
        return reply.code(400).send({ error: 'Prompt is required and cannot be empty' });
      }

      request.log.info({ promptLength: prompt.length }, 'Sending prompt to OpenAI...');
      const response = await askOpenAI(prompt, { systemPrompt, temperature, maxTokens });

      return reply.code(200).send({ response });
    } catch (error) {
      request.log.error(error, 'Failed to get OpenAI response');
      return reply.code(500).send({ error: 'Failed to get OpenAI response', details: String(error) });
    }
  });
}
