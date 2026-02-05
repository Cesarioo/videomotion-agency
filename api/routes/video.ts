import { FastifyInstance } from 'fastify';
import { getAvailableTemplates, getTemplateVariables } from '@/core/services/video.js';
import {
  getDemoVideoByCompanyId,
  incrementDemoVideoViews,
  getCompany,
} from '@/core/services/companies.js';
import {
  getTemplatesSchema,
  getDemoVideoByCompanyIdSchema,
  getQueueStatusSchema,
  retryJobSchema,
  retryByCompanySchema,
} from '@/api/schemas/video.js';
import { videoQueue, addVideoJob } from '@/core/queues/videoQueue.js';
import { enrichQueue, addEnrichJob } from '@/core/queues/enrichQueue.js';

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

  // Retry enrichment job by company ID (submits a new enrichment job)
  fastify.post<{ Params: { companyId: string } }>(
    '/videos/queues/enrichment/company/:companyId/retry',
    {
      schema: {
        ...retryByCompanySchema,
        description: 'Submit a new enrichment job for a company (will also trigger video generation after enrichment)',
      },
    },
    async (request, reply) => {
      try {
        const company = await getCompany(request.params.companyId);
        if (!company) {
          return reply.code(404).send({ error: 'Company not found' });
        }

        // Submit a new enrichment job (which will trigger video generation after enrichment)
        const job = await addEnrichJob({
          companyId: company.id,
          videoType: company.industry,
        });

        request.log.info({ companyId: company.id, jobId: job.id }, 'Enrichment retry job submitted for company');

        return reply.send({
          success: true,
          message: `New enrichment job submitted for company ${company.name}`,
          jobId: job.id,
        });
      } catch (error) {
        request.log.error(error, 'Failed to submit enrichment retry job for company');
        return reply.code(500).send({ error: 'Failed to submit retry job', details: String(error) });
      }
    }
  );

  // Retry video generation job by company ID (submits a new video job using existing company data)
  fastify.post<{ Params: { companyId: string } }>(
    '/videos/queues/video/company/:companyId/retry',
    {
      schema: {
        ...retryByCompanySchema,
        description: 'Submit a new video generation job for a company (uses existing enriched data)',
      },
    },
    async (request, reply) => {
      try {
        const company = await getCompany(request.params.companyId);
        if (!company) {
          return reply.code(404).send({ error: 'Company not found' });
        }

        // Build variables from existing company data
        const variables: Record<string, string> = {
          agency_name: company.name,
          industry: company.industry,
          primaryColor: company.primaryColor,
          secondaryColor: company.secondaryColor,
          logo: company.logoUrl,
          valueProp: company.valueProp,
          targetAudience: company.targetAudience,
          voiceTone: company.voiceTone,
        };

        // Add features as individual variables (feature1, feature2, etc.)
        const features = company.features as string[];
        if (Array.isArray(features)) {
          features.forEach((feature, index) => {
            variables[`feature${index + 1}`] = feature;
          });
        }

        // Submit a new video job
        const job = await addVideoJob({
          companyId: company.id,
          type: company.industry,
          variables,
          language: company.preferredLanguage,
        });

        request.log.info({ companyId: company.id, jobId: job.id }, 'Video retry job submitted for company');

        return reply.send({
          success: true,
          message: `New video generation job submitted for company ${company.name}`,
          jobId: job.id,
        });
      } catch (error) {
        request.log.error(error, 'Failed to submit video retry job for company');
        return reply.code(500).send({ error: 'Failed to submit retry job', details: String(error) });
      }
    }
  );
}
