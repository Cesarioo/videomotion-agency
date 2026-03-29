import { Queue } from 'bullmq';
import { createRedisConnection } from '../services/redis.js';

export interface EnrichJobData {
  companyId: string;
  // Video type to generate after enrichment completes (variables will be auto-populated from enriched data)
  videoType?: string;
}

export const enrichQueue = new Queue<EnrichJobData>('company-enrichment', {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100,
    },
    removeOnFail: {
      count: 50,
    },
  },
});

/**
 * Add an enrichment job to the queue
 */
export async function addEnrichJob(data: EnrichJobData) {
  const job = await enrichQueue.add('enrich-company', data, {
    jobId: `enrich-${data.companyId}-${Date.now()}`,
  });
  
  console.log(`Enrich job added to queue: ${job.id} for company ${data.companyId}`);
  return job;
}
