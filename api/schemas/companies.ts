// ============================================================================
// COMPANY Types & Schemas
// ============================================================================

export interface CreateCompanyBody {
  // Required fields
  name: string;
  websiteUrl: string;
  campaignId: string;
  industry: string;
  // Optional fields (will be populated by enrichment)
  employees?: number;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  logoUrl?: string;
  valueProp?: string;
  features?: unknown;
  targetAudience?: string;
  voiceTone?: string;
  preferredLanguage?: string;
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
  preferredLanguage?: string;
  videoStatus?: string;
}

export interface CompanyParams {
  id: string;
}

export interface CompanySearchQuery {
  name?: string;
  websiteUrl?: string;
  industry?: string;
  campaignId?: string;
  videoStatus?: string;
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
  preferredLanguage: { type: 'string', enum: ['a', 'b', 'e', 'f'], description: 'Preferred language for TTS (a=American English, b=British English, e=Spanish, f=French)' },
  videoStatus: { type: 'string' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const companyBodyProperties = {
  // Required fields
  name: { type: 'string' },
  websiteUrl: { type: 'string' },
  campaignId: { type: 'string' },
  industry: { type: 'string' },
  // Optional fields (will be populated by enrichment)
  employees: { type: 'number' },
  primaryColor: { type: 'string' },
  secondaryColor: { type: 'string' },
  fontFamily: { type: 'string' },
  logoUrl: { type: 'string' },
  valueProp: { type: 'string' },
  features: {},
  targetAudience: { type: 'string' },
  voiceTone: { type: 'string' },
  preferredLanguage: { type: 'string', enum: ['a', 'b', 'e', 'f'], description: 'Preferred language for TTS (a=American English, b=British English, e=Spanish, f=French)' },
  videoStatus: { type: 'string', enum: ['none', 'demo_scheduled', 'demo_started', 'demo_finished', 'final_progress', 'final'] },
};

const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    details: { type: 'string' },
  },
};

export const getCompaniesSchema = {
  description: 'Get all companies, optionally filtered (exact match)',
  tags: ['Companies'],
  querystring: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Company name' },
      websiteUrl: { type: 'string', description: 'Website URL' },
      industry: { type: 'string', description: 'Industry' },
      campaignId: { type: 'string', description: 'Campaign ID' },
      videoStatus: { type: 'string', enum: ['none', 'demo_scheduled', 'demo_started', 'demo_finished', 'final_progress', 'final'], description: 'Video status' },
    },
  },
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: companyResponseProperties,
      },
    },
    500: errorResponseSchema,
  },
};

export const createCompaniesSchema = {
  description: 'Create companies and queue demo video generation for each',
  tags: ['Companies'],
  body: {
    type: 'array',
    items: {
      type: 'object',
      required: ['name', 'websiteUrl', 'campaignId', 'industry'],
      properties: companyBodyProperties,
    },
  },
  response: {
    201: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ...companyResponseProperties,
          jobId: { type: 'string', description: 'Enrichment job ID' },
        },
      },
    },
    500: errorResponseSchema,
  },
};

export const updateCompanySchema = {
  description: 'Partially update a company',
  tags: ['Companies'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: companyBodyProperties,
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
  tags: ['Companies'],
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
