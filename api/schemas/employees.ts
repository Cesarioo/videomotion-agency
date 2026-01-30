// ============================================================================
// EMPLOYEE Types & Schemas
// ============================================================================

export interface CreateEmployeeContactBody {
  companyId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  avatarUrl: string;
  linkedinUrl: string;
}

export interface UpdateEmployeeContactBody {
  companyId?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
}

export interface EmployeeContactParams {
  id: string;
}

export interface EmployeeSearchQuery {
  companyId?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  email?: string;
}

// Shared Employee Contact Properties
const employeeContactResponseProperties = {
  id: { type: 'string' },
  companyId: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  jobTitle: { type: 'string' },
  email: { type: 'string' },
  avatarUrl: { type: 'string' },
  linkedinUrl: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const employeeContactBodyProperties = {
  companyId: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  jobTitle: { type: 'string' },
  email: { type: 'string' },
  avatarUrl: { type: 'string' },
  linkedinUrl: { type: 'string' },
};

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    details: { type: 'string' },
  },
};

export const getEmployeesSchema = {
  description: 'Get all employees, optionally filtered (exact match)',
  tags: ['Employees'],
  querystring: {
    type: 'object',
    properties: {
      companyId: { type: 'string', description: 'Filter by company ID' },
      firstName: { type: 'string', description: 'Filter by first name' },
      lastName: { type: 'string', description: 'Filter by last name' },
      jobTitle: { type: 'string', description: 'Filter by job title' },
      email: { type: 'string', description: 'Filter by email' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: employeeContactResponseProperties,
      },
    },
    500: errorResponseSchema,
  },
};

export const createEmployeesSchema = {
  description: 'Create employee contacts',
  tags: ['Employees'],
  body: {
    type: 'array',
    items: {
      type: 'object',
      required: ['companyId', 'firstName', 'lastName', 'jobTitle', 'email', 'avatarUrl', 'linkedinUrl'],
      properties: employeeContactBodyProperties,
    },
  },
  response: {
    201: {
      type: 'array',
      items: {
        type: 'object',
        properties: employeeContactResponseProperties,
      },
    },
    500: errorResponseSchema,
  },
};

export const updateEmployeeContactSchema = {
  description: 'Partially update an employee contact',
  tags: ['Employees'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: employeeContactBodyProperties,
  },
  response: {
    200: {
      type: 'object',
      properties: employeeContactResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const deleteEmployeeContactSchema = {
  description: 'Delete an employee contact',
  tags: ['Employees'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: employeeContactResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

