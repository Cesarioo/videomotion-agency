import { Worker, Job } from 'bullmq';
import { Socket } from 'net';
import { SocksClient } from 'socks';
import { createRedisConnection } from '../services/redis.js';
import { findEmailForPerson, type SocketFactory, type SmtpVerifyOptions } from '../services/enrich.js';
import { updateEmployeeContact } from '../services/companies.js';
import prisma from '@/core/database/client.js';
import { emailEnrichQueue, type EmailEnrichJobData } from '../queues/emailEnrichQueue.js';

// SOCKS5 proxy configuration from environment variables
const SOCKS5_HOST = process.env.SOCKS5_HOST || '';
const SOCKS5_PORT = parseInt(process.env.SOCKS5_PORT || '1080', 10);
const SOCKS5_USER = process.env.SOCKS5_USER;
const SOCKS5_PASS = process.env.SOCKS5_PASS;

// SMTP verification configuration from environment variables
const SMTP_HELO_DOMAIN = process.env.SMTP_HELO_DOMAIN || 'mailer.ai-car-pricer.com';
const SMTP_MAIL_FROM = process.env.SMTP_MAIL_FROM || `verifier@${SMTP_HELO_DOMAIN}`;

// Rate limiting configuration
const MAX_CONNECTIONS_PER_HOUR = 20;

/**
 * Create a socket connection through SOCKS5 proxy
 */
const createProxiedSocket: SocketFactory = async (targetHost: string, targetPort: number): Promise<Socket> => {
  if (!SOCKS5_HOST) {
    throw new Error('SOCKS5_HOST environment variable not configured');
  }
  
  console.log(`[EmailEnrichWorker] Connecting to ${targetHost}:${targetPort} via SOCKS5 proxy ${SOCKS5_HOST}:${SOCKS5_PORT}`);
  
  const socksOptions: any = {
    proxy: {
      host: SOCKS5_HOST,
      port: SOCKS5_PORT,
      type: 5,
    },
    command: 'connect',
    destination: {
      host: targetHost,
      port: targetPort,
    },
  };
  
  // Add authentication if provided
  if (SOCKS5_USER && SOCKS5_PASS) {
    socksOptions.proxy.userId = SOCKS5_USER;
    socksOptions.proxy.password = SOCKS5_PASS;
  }
  
  const { socket } = await SocksClient.createConnection(socksOptions);
  return socket;
};

/**
 * Update email enrich task status
 */
async function updateTaskStatus(
  taskId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  executedTime?: Date
) {
  return prisma.emailEnrichTask.update({
    where: { id: taskId },
    data: {
      status,
      ...(executedTime && { executedTime }),
    },
  });
}

/**
 * Check rate limit for a DNS zone (MX server)
 * Returns the count of tasks created in the last hour for this dnsZone
 */
async function getRecentTaskCountForDnsZone(dnsZone: string): Promise<number> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const count = await prisma.emailEnrichTask.count({
    where: {
      dnsZone,
      createdAt: {
        gte: oneHourAgo,
      },
    },
  });
  
  return count;
}

/**
 * Re-queue a job by pushing it back to the queue with a delay
 */
async function requeueJob(jobData: EmailEnrichJobData, delayMs: number = 60000): Promise<void> {
  console.log(`[EmailEnrichWorker] Re-queuing job for employee ${jobData.employeeId} with ${delayMs}ms delay`);
  
  await emailEnrichQueue.add('enrich-email', jobData, {
    jobId: `email-enrich-${jobData.employeeId}-${Date.now()}`,
    delay: delayMs,
  });
}

/**
 * Process an email enrichment job
 */
async function processEmailEnrichJob(job: Job<EmailEnrichJobData>) {
  const { employeeId, firstName, lastName, domain, dnsZone, taskId } = job.data;
  
  console.log(`[EmailEnrichWorker] Starting email enrichment for employee ${employeeId}`);
  console.log(`[EmailEnrichWorker] Name: ${firstName} ${lastName}, Domain: ${domain}, MX Server: ${dnsZone}`);
  
  // Check rate limit for this DNS zone (MX server)
  const recentCount = await getRecentTaskCountForDnsZone(dnsZone);
  console.log(`[EmailEnrichWorker] Recent tasks for ${dnsZone}: ${recentCount}/${MAX_CONNECTIONS_PER_HOUR}`);
  
  if (recentCount >= MAX_CONNECTIONS_PER_HOUR) {
    console.log(`[EmailEnrichWorker] Rate limit exceeded for ${dnsZone}, re-queuing job`);
    
    // Re-queue the job with a delay (wait 5 minutes before retrying)
    await requeueJob(job.data, 5 * 60 * 1000);
    
    return {
      success: false,
      rateLimited: true,
      dnsZone,
      employeeId,
    };
  }
  
  // SMTP options from environment variables
  const smtpOptions: SmtpVerifyOptions = {
    heloDomain: SMTP_HELO_DOMAIN,
    mailFromAddress: SMTP_MAIL_FROM,
  };
  
  try {
    // Update task status to processing
    await updateTaskStatus(taskId, 'processing');
    
    // Find email using single SMTP connection to verify all variants
    const email = await findEmailForPerson(firstName, lastName, domain, dnsZone, {
      socketFactory: createProxiedSocket,
      smtpOptions,
    });
    
    const executedTime = new Date();
    
    if (email) {
      console.log(`[EmailEnrichWorker] Found email for employee ${employeeId}: ${email}`);
      
      // Update employee with found email
      await updateEmployeeContact(employeeId, { email });
      
      // Update task status to completed
      await updateTaskStatus(taskId, 'completed', executedTime);
      
      return {
        success: true,
        email,
        employeeId,
      };
    } else {
      console.log(`[EmailEnrichWorker] No email found for employee ${employeeId}`);
      
      // ONE TASK = 1 connection - if not found, mark as FAILED
      await updateTaskStatus(taskId, 'failed', executedTime);
      
      return {
        success: false,
        email: null,
        employeeId,
      };
    }
  } catch (error) {
    console.error(`[EmailEnrichWorker] Error enriching email for employee ${employeeId}:`, error);
    
    // Update task status to failed
    await updateTaskStatus(taskId, 'failed', new Date());
    
    throw error; // Re-throw to trigger retry
  }
}

/**
 * Create and start the email enrich worker
 */
export function startEmailEnrichWorker() {
  const worker = new Worker<EmailEnrichJobData>('email-enrichment', processEmailEnrichJob, {
    connection: createRedisConnection(),
    concurrency: 3, // Limit concurrency to avoid overwhelming SMTP servers
  });

  worker.on('completed', (job, result) => {
    console.log(`[EmailEnrichWorker] Job ${job.id} completed:`, result);
  });

  worker.on('failed', (job, error) => {
    console.error(`[EmailEnrichWorker] Job ${job?.id} failed:`, error.message);
  });

  worker.on('error', (error) => {
    console.error('[EmailEnrichWorker] Worker error:', error);
  });

  console.log('[EmailEnrichWorker] Email enrich worker started and listening for jobs');
  
  return worker;
}

