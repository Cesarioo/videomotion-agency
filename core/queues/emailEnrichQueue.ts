import { Queue } from 'bullmq';
import { createRedisConnection } from '../services/redis.js';

export interface EmailEnrichJobData {
  employeeId: string;
  firstName: string;
  lastName: string;
  domain: string;
  dnsZone: string;
  taskId: string;
}

export const emailEnrichQueue = new Queue<EmailEnrichJobData>('email-enrichment', {
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
 * Add an email enrichment job to the queue
 */
export async function addEmailEnrichJob(data: EmailEnrichJobData) {
  const job = await emailEnrichQueue.add('enrich-email', data, {
    jobId: `email-enrich-${data.employeeId}-${Date.now()}`,
  });
  
  console.log(`[EmailEnrichQueue] Job added: ${job.id} for employee ${data.employeeId}`);
  return job;
}

