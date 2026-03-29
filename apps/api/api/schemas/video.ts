// ============================================================================
// VIDEO Types & Schemas
// ============================================================================

// Shared error response
const errorResponseSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    details: { type: 'string' },
  },
};

// Demo Video Properties
const demoVideoResponseProperties = {
  id: { type: 'string' },
  companyId: { type: 'string' },
  videoLink: { type: 'string' },
  views: { type: 'number' },
  lastViewedAt: { type: 'string', format: 'date-time', nullable: true },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' },
};

const queueCountsProperties = {
  waiting: { type: 'number' },
  active: { type: 'number' },
  completed: { type: 'number' },
  failed: { type: 'number' },
  delayed: { type: 'number' },
};

// ============================================================================
// VIDEO TEMPLATE Schemas
// ============================================================================

export const getTemplatesSchema = {
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
};

// ============================================================================
// DEMO VIDEO Schemas
// ============================================================================

export const getDemoVideoByCompanyIdSchema = {
  description: 'Get the most recent demo video for a company',
  tags: ['Videos'],
  params: {
    type: 'object',
    properties: {
      companyId: { type: 'string' },
    },
    required: ['companyId'],
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
    500: errorResponseSchema,
  },
};

// ============================================================================
// QUEUE STATUS Schemas
// ============================================================================

export const getQueueStatusSchema = {
  description: 'Get status of enrichment (parser) and video generation queues',
  tags: ['Videos'],
  response: {
    200: {
      type: 'object',
      properties: {
        enrichment: {
          type: 'object',
          properties: queueCountsProperties,
        },
        videoGeneration: {
          type: 'object',
          properties: queueCountsProperties,
        },
      },
    },
    500: errorResponseSchema,
  },
};

// ============================================================================
// QUEUE RETRY Schemas
// ============================================================================

export const retryJobSchema = {
  description: 'Retry a failed job',
  tags: ['Videos'],
  params: {
    type: 'object',
    properties: {
      jobId: { type: 'string', description: 'Job ID to retry' },
    },
    required: ['jobId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: errorResponseSchema,
  },
};

export const retryByCompanySchema = {
  description: 'Submit a new enrichment and video generation job for a company',
  tags: ['Videos'],
  params: {
    type: 'object',
    properties: {
      companyId: { type: 'string', description: 'Company ID to retry job for' },
    },
    required: ['companyId'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        jobId: { type: 'string', description: 'New job ID' },
      },
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
    500: errorResponseSchema,
  },
};


