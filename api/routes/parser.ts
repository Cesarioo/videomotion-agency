import { FastifyInstance } from 'fastify';
import { parseUrl } from '@/core/services/parser.js';
import { parserSchema, type ParserBody } from '@/api/schemas/parser.js';

export default async function parserRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ParserBody }>(
    '/parser',
    {
      schema: parserSchema,
    },
    async (request, reply) => {
      const { url } = request.body;

      try {
        request.log.info(`Parsing URL: ${url}`);
        const result = await parseUrl(url);
        return reply.send(result);
      } catch (error) {
        request.log.error(error, `Failed to parse URL: ${url}`);
        return reply.code(500).send({ 
          error: 'Failed to parse URL', 
          details: String(error) 
        });
      }
    }
  );
}

