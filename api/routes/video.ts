import { FastifyInstance } from 'fastify';
import { getAvailableTemplates, getTemplateVariables } from '@/core/services/video.js';
import {
  getDemoVideoByCompanyId,
  incrementDemoVideoViews,
} from '@/core/services/companies.js';
import {
  getTemplatesSchema,
  getDemoVideoByCompanyIdSchema,
  getQueueStatusSchema,
  retryJobSchema,
} from '@/api/schemas/video.js';
import { videoQueue } from '@/core/queues/videoQueue.js';
import { enrichQueue } from '@/core/queues/enrichQueue.js';

export default async function videoRoutes(fastify: FastifyInstance) {
  // This hook runs for every route defined in THIS plugin
  fastify.addHook('onRoute', (routeOptions) => {
    routeOptions.schema = {
      ...routeOptions.schema,
      tags: ['Videos']
    };
  });

  // Get available templates
  fastify.get('/videos/templates', {
    schema: getTemplatesSchema,
  }, async (request, reply) => {
    const templates = getAvailableTemplates();
    const templatesWithVariables = templates.map(name => ({
      name,
      requiredVariables: getTemplateVariables(name),
    }));

    return reply.send({ templates: templatesWithVariables });
  });

  // Get Demo Video by Company ID
  fastify.get<{ Params: { companyId: string } }>(
    '/videos/demo/:companyId',
    {
      schema: getDemoVideoByCompanyIdSchema,
    },
    async (request, reply) => {
      try {
        const video = await getDemoVideoByCompanyId(request.params.companyId);
        if (!video) {
          return reply.code(404).send({ error: 'Demo video not found for this company' });
        }

        // Increment views and update lastViewedAt
        await incrementDemoVideoViews(request.params.companyId);

        return reply.send(video);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to get demo video' });
      }
    }
  );

  // ============================================================================
  // QUEUE STATUS Routes
  // ============================================================================

  // Get queue status for both enrichment and video generation
  fastify.get('/videos/queues/status', {
    schema: getQueueStatusSchema,
  }, async (request, reply) => {
    try {
      const [enrichCounts, videoCounts] = await Promise.all([
        enrichQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
        videoQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
      ]);

      return reply.send({
        enrichment: enrichCounts,
        videoGeneration: videoCounts,
      });
    } catch (error) {
      request.log.error(error, 'Failed to get queue status');
      return reply.code(500).send({ error: 'Failed to get queue status', details: String(error) });
    }
  });

  // ============================================================================
  // QUEUE RETRY Routes
  // ============================================================================

  // Retry a failed enrichment job
  fastify.post<{ Params: { jobId: string } }>(
    '/videos/queues/enrichment/:jobId/retry',
    {
      schema: {
        ...retryJobSchema,
        description: 'Retry a failed enrichment (parser) job',
      },
    },
    async (request, reply) => {
      try {
        const job = await enrichQueue.getJob(request.params.jobId);
        if (!job) {
          return reply.code(404).send({ error: 'Job not found' });
        }

        await job.retry();
        return reply.send({ success: true, message: `Job ${request.params.jobId} has been retried` });
      } catch (error) {
        request.log.error(error, 'Failed to retry enrichment job');
        return reply.code(500).send({ error: 'Failed to retry job', details: String(error) });
      }
    }
  );

  // Retry a failed video generation job
  fastify.post<{ Params: { jobId: string } }>(
    '/videos/queues/video/:jobId/retry',
    {
      schema: {
        ...retryJobSchema,
        description: 'Retry a failed video generation job',
      },
    },
    async (request, reply) => {
      try {
        const job = await videoQueue.getJob(request.params.jobId);
        if (!job) {
          return reply.code(404).send({ error: 'Job not found' });
        }

        await job.retry();
        return reply.send({ success: true, message: `Job ${request.params.jobId} has been retried` });
      } catch (error) {
        request.log.error(error, 'Failed to retry video job');
        return reply.code(500).send({ error: 'Failed to retry job', details: String(error) });
      }
    }
  );
}
