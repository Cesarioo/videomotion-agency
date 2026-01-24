import { FastifyInstance } from 'fastify';
import type { Prisma } from '@prisma/client';
import { VideoStatus } from '@prisma/client';
import {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
  createEmployeeContact,
  getEmployeeContact,
  updateEmployeeContact,
  deleteEmployeeContact,
  createDemoVideo,
  getDemoVideo,
  updateDemoVideo,
  deleteDemoVideo,
  createFinalVideo,
  getFinalVideo,
  updateFinalVideo,
  deleteFinalVideo,
} from '@/core/services/companies.js';
import {
  createCompanySchema,
  getCompanySchema,
  updateCompanySchema,
  deleteCompanySchema,
  createEmployeeContactSchema,
  getEmployeeContactSchema,
  updateEmployeeContactSchema,
  deleteEmployeeContactSchema,
  createDemoVideoSchema,
  getDemoVideoSchema,
  updateDemoVideoSchema,
  deleteDemoVideoSchema,
  createFinalVideoSchema,
  getFinalVideoSchema,
  updateFinalVideoSchema,
  deleteFinalVideoSchema,
  type CreateCompanyBody,
  type UpdateCompanyBody,
  type CompanyParams,
  type CreateEmployeeContactBody,
  type UpdateEmployeeContactBody,
  type EmployeeContactParams,
  type CreateDemoVideoBody,
  type UpdateDemoVideoBody,
  type DemoVideoParams,
  type CreateFinalVideoBody,
  type UpdateFinalVideoBody,
  type FinalVideoParams,
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

  
  // Create Company
  fastify.post<{
    Body: CreateCompanyBody;
  }>(
    '/companies',
    {
      schema: createCompanySchema,
    },
    async (request, reply) => {
      try {
        const company = await createCompany({
          ...request.body,
          features: request.body.features as Prisma.InputJsonValue,
          videoStatus: request.body.videoStatus as VideoStatus | undefined,
        });
        return reply.code(201).send(company);
      } catch (error) {
        request.log.error(error, 'Failed to create company');
        return reply.code(500).send({ error: 'Failed to create company', details: String(error) });
      }
    }
  );

  // Get Company
  fastify.get<{ Params: CompanyParams }>(
    '/companies/:id',
    {
      schema: getCompanySchema,
    },
    async (request, reply) => {
      try {
        const company = await getCompany(request.params.id);
        if (!company) {
          return reply.code(404).send({ error: 'Company not found' });
        }
        return reply.send(company);
      } catch (error) {
        request.log.error(error, 'Failed to get company');
        return reply.code(500).send({ error: 'Failed to get company', details: String(error) });
      }
    }
  );

  // Update Company
  fastify.put<{
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

  // ============================================================================
  // EMPLOYEE CONTACT Routes
  // ============================================================================

  // Create Employee Contact
  fastify.post<{ Params : CreateEmployeeContactBody }>(
    '/companies/employees',
    {
      schema: createEmployeeContactSchema,
    },
    async (request, reply) => {
      try {
        const employee = await createEmployeeContact(request.params);
        return reply.code(201).send(employee);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to create employee contact' });
      }
    }
  );

  // Get Employee Contact
  fastify.get<{ Params: EmployeeContactParams }>(
    '/companies/employees/:id',
    {
      schema: getEmployeeContactSchema,
    },
    async (request, reply) => {
      try {
        const employee = await getEmployeeContact(request.params.id);
        if (!employee) {
          return reply.code(404).send({ error: 'Employee contact not found' });
        }
        return reply.send(employee);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to get employee contact' });
      }
    }
  );

  // Update Employee Contact
  fastify.put<{
    Params: EmployeeContactParams;
    Body: UpdateEmployeeContactBody;
  }>(
    '/companies/employees/:id',
    {
      schema: updateEmployeeContactSchema,
    },
    async (request, reply) => {
      try {
        const employee = await updateEmployeeContact(request.params.id, request.body);
        return reply.send(employee);
      } catch (error) {
        return reply.code(404).send({ error: 'Employee contact not found' });
      }
    }
  );

  // Delete Employee Contact
  fastify.delete<{ Params: EmployeeContactParams }>(
    '/companies/employees/:id',
    {
      schema: deleteEmployeeContactSchema,
    },
    async (request, reply) => {
      try {
        const employee = await deleteEmployeeContact(request.params.id);
        return reply.send(employee);
      } catch (error) {
        return reply.code(404).send({ error: 'Employee contact not found' });
      }
    }
  );

  // ============================================================================
  // DEMO VIDEO Routes
  // ============================================================================

  // Create Demo Video
  fastify.post<{
    Body: CreateDemoVideoBody;
  }>(
    '/companies/demo-videos',
    {
      schema: createDemoVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await createDemoVideo(request.body);
        return reply.code(201).send(video);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to create demo video' });
      }
    }
  );

  // Get Demo Video
  fastify.get<{ Params: DemoVideoParams }>(
    '/companies/demo-videos/:id',
    {
      schema: getDemoVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await getDemoVideo(request.params.id);
        if (!video) {
          return reply.code(404).send({ error: 'Demo video not found' });
        }
        return reply.send(video);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to get demo video' });
      }
    }
  );

  // Update Demo Video
  fastify.put<{
    Params: DemoVideoParams;
    Body: UpdateDemoVideoBody;
  }>(
    '/companies/demo-videos/:id',
    {
      schema: updateDemoVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await updateDemoVideo(request.params.id, request.body);
        return reply.send(video);
      } catch (error) {
        return reply.code(404).send({ error: 'Demo video not found' });
      }
    }
  );

  // Delete Demo Video
  fastify.delete<{ Params: DemoVideoParams }>(
    '/companies/demo-videos/:id',
    {
      schema: deleteDemoVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await deleteDemoVideo(request.params.id);
        return reply.send(video);
      } catch (error) {
        return reply.code(404).send({ error: 'Demo video not found' });
      }
    }
  );

  // ============================================================================
  // FINAL VIDEO Routes
  // ============================================================================

  // Create Final Video
  fastify.post<{
    Body: CreateFinalVideoBody;
  }>(
    '/companies/final-videos',
    {
      schema: createFinalVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await createFinalVideo(request.body);
        return reply.code(201).send(video);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to create final video' });
      }
    }
  );

  // Get Final Video
  fastify.get<{ Params: FinalVideoParams }>(
    '/companies/final-videos/:id',
    {
      schema: getFinalVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await getFinalVideo(request.params.id);
        if (!video) {
          return reply.code(404).send({ error: 'Final video not found' });
        }
        return reply.send(video);
      } catch (error) {
        return reply.code(500).send({ error: 'Failed to get final video' });
      }
    }
  );

  // Update Final Video
  fastify.put<{
    Params: FinalVideoParams;
    Body: UpdateFinalVideoBody;
  }>(
    '/companies/final-videos/:id',
    {
      schema: updateFinalVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await updateFinalVideo(request.params.id, request.body);
        return reply.send(video);
      } catch (error) {
        return reply.code(404).send({ error: 'Final video not found' });
      }
    }
  );

  // Delete Final Video
  fastify.delete<{ Params: FinalVideoParams }>(
    '/companies/final-videos/:id',
    {
      schema: deleteFinalVideoSchema,
    },
    async (request, reply) => {
      try {
        const video = await deleteFinalVideo(request.params.id);
        return reply.send(video);
      } catch (error) {
        return reply.code(404).send({ error: 'Final video not found' });
      }
    }
  );
}

