import { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import { VideoStatus } from '@prisma/client';
import {
  createCompany,
  searchCompanies,
  updateCompany,
  deleteCompany,
} from '@/core/services/companies.js';
import { addEnrichJob } from '@/core/queues/enrichQueue.js';
import {
  createCompaniesSchema,
  getCompaniesSchema,
  updateCompanySchema,
  deleteCompanySchema,
  type CreateCompanyBody,
  type UpdateCompanyBody,
  type CompanyParams,
  type CompanySearchQuery,
} from '@/api/schemas/companies.js';

export default async function companiesRoutes(fastify: FastifyInstance) {
  // ============================================================================
  // COMPANY Routes
  // ============================================================================

  // This hook runs for every route defined in THIS plugin
  fastify.addHook('onRoute', (routeOptions) => {
    routeOptions.schema = {
      ...routeOptions.schema,
      tags: ['Companies']
    };
  });

  // Get Companies (optionally filter by any column)
  fastify.get<{ Querystring: CompanySearchQuery }>(
    '/companies',
    {
      schema: getCompaniesSchema,
    },
    async (request, reply) => {
      try {
        const filters = {
          ...request.query,
          videoStatus: request.query.videoStatus as VideoStatus | undefined,
        };
        const companies = await searchCompanies(filters);
        return reply.send(companies);
      } catch (error) {
        request.log.error(error, 'Failed to get companies');
        return reply.code(500).send({ error: 'Failed to get companies', details: String(error) });
      }
    }
  );

  // Create Companies (always batch - accepts array)
  fastify.post<{
    Body: CreateCompanyBody[];
  }>(
    '/companies',
    {
      schema: createCompaniesSchema,
    },
    async (request, reply) => {
      try {
        const results: Array<{ company: Awaited<ReturnType<typeof createCompany>>; jobId: string | undefined }> = [];

        for (const companyData of request.body) {
          const company = await createCompany({
            ...companyData,
            features: companyData.features as Prisma.InputJsonValue | undefined,
            videoStatus: companyData.videoStatus as VideoStatus | undefined,
          });

          // Queue enrichment job for each company
          request.log.info({ companyId: company.id, industry: company.industry }, 'Queueing enrichment and video generation');
          
          const job = await addEnrichJob({
            companyId: company.id,
            videoType: company.industry,
          });

          results.push({
            company,
            jobId: job.id,
          });
        }

        return reply.code(201).send(results.map(r => ({ ...r.company, jobId: r.jobId })));
      } catch (error) {
        request.log.error(error, 'Failed to create companies');
        return reply.code(500).send({ error: 'Failed to create companies', details: String(error) });
      }
    }
  );

  // Update Company
  fastify.patch<{
    Params: CompanyParams;
    Body: UpdateCompanyBody;
  }>(
    '/companies/:id',
    {
      schema: updateCompanySchema,
    },
    async (request, reply) => {
      try {
        const company = await updateCompany(request.params.id, {
          ...request.body,
          features: request.body.features as Prisma.InputJsonValue | undefined,
          videoStatus: request.body.videoStatus as VideoStatus | undefined,
        });
        return reply.send(company);
      } catch (error) {
        return reply.code(404).send({ error: 'Company not found' });
      }
    }
  );

  // Delete Company
  fastify.delete<{ Params: CompanyParams }>(
    '/companies/:id',
    {
      schema: deleteCompanySchema,
    },
    async (request, reply) => {
      try {
        const company = await deleteCompany(request.params.id);
        return reply.send(company);
      } catch (error) {
        return reply.code(404).send({ error: 'Company not found' });
      }
    }
  );
}
