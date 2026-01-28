// ============================================================================
// COMPANY Types & Schemas
// ============================================================================

export interface CreateCompanyBody {
  name: string;
  websiteUrl: string;
  employees: number;
  industry: string;
  campaignId: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string;
  valueProp: string;
  features: unknown;
  targetAudience: string;
  voiceTone: string;
  videoStatus?: string;
}

export interface UpdateCompanyBody {
  name?: string;
  websiteUrl?: string;
  employees?: number;
  industry?: string;
  campaignId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  valueProp?: string;
  features?: unknown;
  targetAudience?: string;
  voiceTone?: string;
  videoStatus?: string;
}

export interface CompanyParams {
  id: string;
}

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

export interface CreateDemoVideoBody {
  companyId: string;
  videoLink: string;
}

export interface UpdateDemoVideoBody {
  companyId?: string;
  videoLink?: string;
}

export interface DemoVideoParams {
  id: string;
}

export interface CreateFinalVideoBody {
  companyId: string;
  videoLink: string;
}

export interface UpdateFinalVideoBody {
  companyId?: string;
  videoLink?: string;
}

export interface FinalVideoParams {
  id: string;
}

// Shared Schemas
const companyResponseProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  websiteUrl: { type: 'string' },
  employees: { type: 'number' },
  industry: { type: 'string' },
  campaignId: { type: 'string' },
  primaryColor: { type: 'string' },
  secondaryColor: { type: 'string' },
  fontFamily: { type: 'string' },
  logoUrl: { type: 'string' },
  valueProp: { type: 'string' },
  features: {},
  targetAudience: { type: 'string' },
  voiceTone: { type: 'string' },
  videoStatus: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export const createCompanySchema = {
  description: 'Create a new company and optionally queue a demo video generation',
  tags: ['companies'],
  body: {
    type: 'object',
    required: [
      'name',
      'websiteUrl',
      'employees',
      'industry',
      'campaignId',
      'primaryColor',
      'secondaryColor',
      'fontFamily',
      'logoUrl',
      'valueProp',
      'features',
      'targetAudience',
      'voiceTone',
    ],
    properties: {
      name: { type: 'string' },
      websiteUrl: { type: 'string' },
      employees: { type: 'number' },
      industry: { type: 'string' },
      campaignId: { type: 'string' },
      primaryColor: { type: 'string' },
      secondaryColor: { type: 'string' },
      fontFamily: { type: 'string' },
      logoUrl: { type: 'string' },
      valueProp: { type: 'string' },
      features: {},
      targetAudience: { type: 'string' },
      voiceTone: { type: 'string' },
      videoStatus: { type: 'string', enum: ['none', 'demo_scheduled', 'demo_started', 'demo_finished', 'final_progress', 'final'] },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        ...companyResponseProperties,
        jobId: { type: 'string', description: 'Enrichment job ID (video will be auto-generated after enrichment)' },
      },
    },
  },
};

export const getCompanySchema = {
  description: 'Get a company by ID',
  tags: ['companies'],
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
      properties: companyResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const updateCompanySchema = {
  description: 'Update a company',
  tags: ['companies'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      websiteUrl: { type: 'string' },
      employees: { type: 'number' },
      industry: { type: 'string' },
      campaignId: { type: 'string' },
      primaryColor: { type: 'string' },
      secondaryColor: { type: 'string' },
      fontFamily: { type: 'string' },
      logoUrl: { type: 'string' },
      valueProp: { type: 'string' },
      features: {},
      targetAudience: { type: 'string' },
      voiceTone: { type: 'string' },
      videoStatus: { type: 'string', enum: ['none', 'demo_scheduled', 'demo_started', 'demo_finished', 'final_progress', 'final'] },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: companyResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const deleteCompanySchema = {
  description: 'Delete a company',
  tags: ['companies'],
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
      properties: companyResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

// ============================================================================
// EMPLOYEE CONTACT Schemas
// ============================================================================

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

export const createEmployeeContactSchema = {
  description: 'Create a new employee contact',
  tags: ['employees'],
  body: {
    type: 'object',
    required: ['companyId', 'firstName', 'lastName', 'jobTitle', 'email', 'avatarUrl', 'linkedinUrl'],
    properties: {
      companyId: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      jobTitle: { type: 'string' },
      email: { type: 'string' },
      avatarUrl: { type: 'string' },
      linkedinUrl: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: employeeContactResponseProperties,
    },
  },
};

export const getEmployeeContactSchema = {
  description: 'Get an employee contact by ID',
  tags: ['employees'],
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

export const updateEmployeeContactSchema = {
  description: 'Update an employee contact',
  tags: ['employees'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      companyId: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      jobTitle: { type: 'string' },
      email: { type: 'string' },
      avatarUrl: { type: 'string' },
      linkedinUrl: { type: 'string' },
    },
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
  tags: ['employees'],
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

// ============================================================================
// DEMO VIDEO Schemas
// ============================================================================

// Shared Demo Video Properties
const demoVideoResponseProperties = {
  id: { type: 'string' },
  companyId: { type: 'string' },
  videoLink: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export const createDemoVideoSchema = {
  description: 'Create a new demo video',
  tags: ['demo-videos'],
  body: {
    type: 'object',
    required: ['companyId', 'videoLink'],
    properties: {
      companyId: { type: 'string' },
      videoLink: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: demoVideoResponseProperties,
    },
  },
};

export const getDemoVideoSchema = {
  description: 'Get a demo video by ID',
  tags: ['demo-videos'],
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
      properties: demoVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const updateDemoVideoSchema = {
  description: 'Update a demo video',
  tags: ['demo-videos'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      companyId: { type: 'string' },
      videoLink: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: demoVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const deleteDemoVideoSchema = {
  description: 'Delete a demo video',
  tags: ['demo-videos'],
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
      properties: demoVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

// ============================================================================
// FINAL VIDEO Schemas
// ============================================================================

// Shared Final Video Properties
const finalVideoResponseProperties = {
  id: { type: 'string' },
  companyId: { type: 'string' },
  videoLink: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

export const createFinalVideoSchema = {
  description: 'Create a new final video',
  tags: ['final-videos'],
  body: {
    type: 'object',
    required: ['companyId', 'videoLink'],
    properties: {
      companyId: { type: 'string' },
      videoLink: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: finalVideoResponseProperties,
    },
  },
};

export const getFinalVideoSchema = {
  description: 'Get a final video by ID',
  tags: ['final-videos'],
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
      properties: finalVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const updateFinalVideoSchema = {
  description: 'Update a final video',
  tags: ['final-videos'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      companyId: { type: 'string' },
      videoLink: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: finalVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

export const deleteFinalVideoSchema = {
  description: 'Delete a final video',
  tags: ['final-videos'],
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
      properties: finalVideoResponseProperties,
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

