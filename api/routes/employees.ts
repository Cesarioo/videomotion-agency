import { FastifyInstance } from 'fastify';
import {
  createManyEmployeeContacts,
  searchEmployeeContacts,
  updateEmployeeContact,
  deleteEmployeeContact,
} from '@/core/services/companies.js';
import {
  createEmployeesSchema,
  getEmployeesSchema,
  updateEmployeeContactSchema,
  deleteEmployeeContactSchema,
  type CreateEmployeeContactBody,
  type UpdateEmployeeContactBody,
  type EmployeeContactParams,
  type EmployeeSearchQuery,
} from '@/api/schemas/employees.js';

export default async function employeesRoutes(fastify: FastifyInstance) {
  // This hook runs for every route defined in THIS plugin
  fastify.addHook('onRoute', (routeOptions) => {
    routeOptions.schema = {
      ...routeOptions.schema,
      tags: ['Employees']
    };
  });

  // Get Employees (optionally filter by any field)
  fastify.get<{ Querystring: EmployeeSearchQuery }>(
    '/employees',
    {
      schema: getEmployeesSchema,
    },
    async (request, reply) => {
      try {
        const employees = await searchEmployeeContacts(request.query);
        return reply.send(employees);
      } catch (error) {
        request.log.error(error, 'Failed to get employees');
        return reply.code(500).send({ error: 'Failed to get employees', details: String(error) });
      }
    }
  );

  // Create Employee Contacts (always batch - accepts array)
  fastify.post<{ Body: CreateEmployeeContactBody[] }>(
    '/employees',
    {
      schema: createEmployeesSchema,
    },
    async (request, reply) => {
      try {
        const employees = await createManyEmployeeContacts(request.body);
        return reply.code(201).send(employees);
      } catch (error) {
        request.log.error(error, 'Failed to create employees');
        return reply.code(500).send({ error: 'Failed to create employees', details: String(error) });
      }
    }
  );

  // Update Employee Contact
  fastify.patch<{
    Params: EmployeeContactParams;
    Body: UpdateEmployeeContactBody;
  }>(
    '/employees/:id',
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
    '/employees/:id',
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
}
