import { Queue } from 'bullmq';
import { createRedisConnection } from '../services/redis.js';

export interface VideoJobData {
  companyId: string;
  type: string;
  variables: Record<string, string>;
}

export const videoQueue = new Queue<VideoJobData>('video-generation', {
  connection: createRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000, // 5 seconds initial delay
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 50, // Keep last 50 failed jobs
    },
  },
});

/**
 * Add a video generation job to the queue
 */
export async function addVideoJob(data: VideoJobData) {
  const job = await videoQueue.add('generate-demo-video', data, {
    jobId: `video-${data.companyId}-${Date.now()}`,
  });
  
  console.log(`Video job added to queue: ${job.id} for company ${data.companyId}`);
  return job;
}
