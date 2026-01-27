import { FastifyInstance } from 'fastify';
import { createVideo, getAvailableTemplates, getTemplateVariables } from '@/core/services/video.js';
import { uploadBuffer } from '@/core/services/s3.js';

interface CreateVideoBody {
  type: string;
  variables?: Record<string, string>;
}

export default async function videoRoutes(fastify: FastifyInstance) {
  // Get available templates
  fastify.get('/videos/templates', {
    schema: {
      description: 'Get available video template types',
      tags: ['Videos'],
      response: {
        200: {
          type: 'object',
          properties: {
            templates: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  requiredVariables: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const templates = getAvailableTemplates();
    const templatesWithVariables = templates.map(name => ({
      name,
      requiredVariables: getTemplateVariables(name),
    }));

    return reply.send({ templates: templatesWithVariables });
  });

  // Create video from template
  fastify.post<{ Body: CreateVideoBody }>('/videos', {
    schema: {
      description: 'Create a video from a template type with dynamic variables',
      tags: ['Videos'],
      body: {
        type: 'object',
        required: ['type'],
        properties: {
          type: { 
            type: 'string', 
            description: 'Template type (e.g., "seo-agency")' 
          },
          variables: { 
            type: 'object',
            additionalProperties: { type: 'string' },
            description: 'Variables to replace in scene texts (e.g., { "agency_name": "MyAgency" })',
          },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            fileName: { type: 'string' },
            url: { type: 'string' },
            key: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { type, variables = {} } = request.body;

      request.log.info({ type, variables }, 'Starting video creation...');
      
      const videoResult = await createVideo({ type, variables });
      
      request.log.info('Uploading video to R2...');
      const uploadResult = await uploadBuffer(videoResult.buffer, videoResult.fileName, 'video/mp4');
      
      return reply.code(201).send({
        fileName: videoResult.fileName,
        url: uploadResult.url,
        key: uploadResult.key,
      });
    } catch (error) {
      request.log.error(error, 'Failed to create video');
      return reply.code(500).send({ error: 'Failed to create video', details: String(error) });
    }
  });
}
