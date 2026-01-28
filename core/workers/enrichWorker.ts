import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../services/redis.js';
import { enrichCompany } from '../services/enrich.js';
import { addVideoJob } from '../queues/videoQueue.js';
import { getCompany, updateCompany } from '../services/companies.js';
import type { EnrichJobData } from '../queues/enrichQueue.js';

/**
 * Process an enrichment job
 */
async function processEnrichJob(job: Job<EnrichJobData>) {
  const { companyId, videoType } = job.data;
  
  console.log(`[EnrichWorker] Starting enrichment for company ${companyId}`);
  
  try {
    // Run the enrichment
    const enrichedData = await enrichCompany(companyId);
    console.log(`[EnrichWorker] Enrichment complete for company ${companyId}`);
    console.log(`[EnrichWorker] Enriched data:`, enrichedData);

    // If video type was provided, queue the video job with enriched data as variables
    if (videoType) {
      console.log(`[EnrichWorker] Queueing video job for company ${companyId}`);
      
      // Get the updated company data to build video variables
      const company = await getCompany(companyId);
      if (!company) {
        throw new Error(`Company not found after enrichment: ${companyId}`);
      }

      // Build variables from enriched company data
      const variables: Record<string, string> = {
        agency_name: company.name,
        industry: company.industry,
        primaryColor: company.primaryColor,
        secondaryColor: company.secondaryColor,
        logo: company.logoUrl,
        valueProp: company.valueProp,
        targetAudience: company.targetAudience,
        voiceTone: company.voiceTone,
      };

      // Add features as individual variables (feature1, feature2, etc.)
      const features = company.features as string[];
      if (Array.isArray(features)) {
        features.forEach((feature, index) => {
          variables[`feature${index + 1}`] = feature;
        });
      }

      console.log(`[EnrichWorker] Video variables:`, variables);

      const videoJob = await addVideoJob({
        companyId,
        type: videoType,
        variables,
      });
      
      console.log(`[EnrichWorker] Video job queued: ${videoJob.id}`);

      // Update company status to demo_scheduled now that video is queued
      await updateCompany(companyId, { videoStatus: 'demo_scheduled' });
      console.log(`[EnrichWorker] Company ${companyId} status updated to demo_scheduled`);
    }

    return {
      success: true,
      enrichedData,
      videoJobQueued: !!videoType,
    };
  } catch (error) {
    console.error(`[EnrichWorker] Error enriching company ${companyId}:`, error);
    throw error; // Re-throw to trigger retry
  }
}

/**
 * Create and start the enrich worker
 */
export function startEnrichWorker() {
  const worker = new Worker<EnrichJobData>('company-enrichment', processEnrichJob, {
    connection: createRedisConnection(),
    concurrency: 5, // Can process multiple enrichments in parallel
  });

  worker.on('completed', (job, result) => {
    console.log(`[EnrichWorker] Job ${job.id} completed:`, result);
  });

  worker.on('failed', (job, error) => {
    console.error(`[EnrichWorker] Job ${job?.id} failed:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('[EnrichWorker] Worker error:', error);
  });

  console.log('[EnrichWorker] Enrich worker started and listening for jobs');
  
  return worker;
}
