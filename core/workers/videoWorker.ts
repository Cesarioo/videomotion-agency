import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../services/redis.js';
import { createVideo } from '../services/video.js';
import { uploadBuffer } from '../services/s3.js';
import { createDemoVideo, updateCompany } from '../services/companies.js';
import type { VideoJobData } from '../queues/videoQueue.js';

/**
 * Process a video generation job
 */
async function processVideoJob(job: Job<VideoJobData>) {
  const { companyId, type, variables } = job.data;
  
  console.log(`[Worker] Starting video generation for company ${companyId}`);
  console.log(`[Worker] Type: ${type}, Variables:`, variables);
  
  try {
    // Update company status to demo_started
    await updateCompany(companyId, { videoStatus: 'demo_started' });
    console.log(`[Worker] Updated company ${companyId} status to demo_started`);
    
    // Generate the video
    console.log(`[Worker] Generating video...`);
    const videoResult = await createVideo({ type, variables });
    console.log(`[Worker] Video generated: ${videoResult.fileName}`);
    
    // Upload to R2
    console.log(`[Worker] Uploading video to R2...`);
    const uploadResult = await uploadBuffer(videoResult.buffer, videoResult.fileName, 'video/mp4');
    console.log(`[Worker] Video uploaded: ${uploadResult.url}`);
    
    // Create DemoVideo record
    const demoVideo = await createDemoVideo({
      companyId,
      videoLink: uploadResult.url || '',
    });
    console.log(`[Worker] DemoVideo record created: ${demoVideo.id}`);
    
    // Update company status to demo_finished
    await updateCompany(companyId, { videoStatus: 'demo_finished' });
    console.log(`[Worker] Updated company ${companyId} status to demo_finished`);
    
    return {
      success: true,
      demoVideoId: demoVideo.id,
      videoUrl: uploadResult.url,
    };
  } catch (error) {
    console.error(`[Worker] Error processing video job for company ${companyId}:`, error);
    
    // Update company status back to none on failure
    try {
      await updateCompany(companyId, { videoStatus: 'none' });
    } catch (updateError) {
      console.error(`[Worker] Failed to reset company status:`, updateError);
    }
    
    throw error; // Re-throw to trigger retry
  }
}

/**
 * Create and start the video worker
 */
export function startVideoWorker() {
  const worker = new Worker<VideoJobData>('video-generation', processVideoJob, {
    connection: createRedisConnection(),
    concurrency: 1, // Process one video at a time (video generation is resource-intensive)
  });

  worker.on('completed', (job, result) => {
    console.log(`[Worker] Job ${job.id} completed:`, result);
  });

  worker.on('failed', (job, error) => {
    console.error(`[Worker] Job ${job?.id} failed:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('[Worker] Worker error:', error);
  });

  console.log('[Worker] Video worker started and listening for jobs');
  
  return worker;
}
