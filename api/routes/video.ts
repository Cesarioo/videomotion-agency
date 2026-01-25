import { FastifyInstance } from 'fastify';
import { createVideo } from '@/core/services/video.js';
import { uploadBuffer } from '@/core/services/s3.js';

export default async function videoRoutes(fastify: FastifyInstance) {
  fastify.post('/videos', async (request, reply) => {
    try {
      request.log.info('Starting video creation...');
      const videoResult = await createVideo();
      
      request.log.info('Uploading video to R2...');
      const uploadResult = await uploadBuffer(videoResult.buffer, videoResult.fileName, 'video/mp4');
      
      return reply.code(201).send({
        fileName: videoResult.fileName,
        url: uploadResult.url,
        key: uploadResult.key
      });
    } catch (error) {
      request.log.error(error, 'Failed to create video');
      return reply.code(500).send({ error: 'Failed to create video', details: String(error) });
    }
  });
}

