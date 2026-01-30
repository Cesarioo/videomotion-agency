import { FastifyRequest, FastifyReply } from 'fastify';

const API_KEY = process.env.API_KEY;

export async function verifyApiKey(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Skip auth for Swagger docs only
  if (request.url.startsWith('/docs')) {
    return;
  }

  const apiKey = request.headers['x-api-key'];

  if (!API_KEY) {
    request.log.error('API_KEY environment variable is not set');
    return reply.code(500).send({ error: 'Server configuration error' });
  }

  if (!apiKey) {
    return reply.code(401).send({ error: 'Missing API key. Provide x-api-key header.' });
  }

  if (apiKey !== API_KEY) {
    return reply.code(403).send({ error: 'Invalid API key' });
  }
}

