export interface ParserBody {
  url: string;
}

export const parserSchema = {
  description: 'Parse a URL to extract text, CSS, and social links',
  tags: ['parser'],
  body: {
    type: 'object',
    required: ['url'],
    properties: {
      url: { type: 'string', format: 'uri' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        colors: {
          type: 'object',
          properties: {
            background: {
              type: 'object',
              additionalProperties: { type: 'number' },
            },
            typography: {
              type: 'object',
              additionalProperties: { type: 'number' },
            },
            screenshotPixels: {
              type: 'object',
              additionalProperties: { type: 'number' },
            },
          },
        },
        socialUrls: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  },
};

