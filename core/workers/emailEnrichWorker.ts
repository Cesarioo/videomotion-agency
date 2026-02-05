import { Worker, Job } from 'bullmq';
import { Socket } from 'net';
import { SocksClient } from 'socks';
import { createRedisConnection } from '../services/redis.js';
import { findEmailForPerson, type SocketFactory, type SmtpVerifyOptions } from '../services/enrich.js';
import { updateEmployeeContact } from '../services/companies.js';
import prisma from '@/core/database/client.js';
import type { EmailEnrichJobData } from '../queues/emailEnrichQueue.js';

// SOCKS5 proxy configuration from environment variables
const SOCKS5_HOST = process.env.SOCKS5_HOST || '';
const SOCKS5_PORT = parseInt(process.env.SOCKS5_PORT || '1080', 10);
const SOCKS5_USER = process.env.SOCKS5_USER;
const SOCKS5_PASS = process.env.SOCKS5_PASS;

// SMTP verification configuration from environment variables
const SMTP_HELO_DOMAIN = process.env.SMTP_HELO_DOMAIN || 'mailer.ai-car-pricer.com';
const SMTP_MAIL_FROM = process.env.SMTP_MAIL_FROM || `verifier@${SMTP_HELO_DOMAIN}`;

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
 * Process an email enrichment job
 */
async function processEmailEnrichJob(job: Job<EmailEnrichJobData>) {
  const { employeeId, firstName, lastName, dnsZone, taskId } = job.data;
  
  console.log(`[EmailEnrichWorker] Starting email enrichment for employee ${employeeId}`);
  console.log(`[EmailEnrichWorker] Name: ${firstName} ${lastName}, DNS Zone: ${dnsZone}`);
  
  // SMTP options from environment variables
  const smtpOptions: SmtpVerifyOptions = {
    heloDomain: SMTP_HELO_DOMAIN,
    mailFromAddress: SMTP_MAIL_FROM,
  };
  
  try {
    // Update task status to processing
    await updateTaskStatus(taskId, 'processing');
    
    // Find email using DNS lookup and SMTP verification (with SOCKS5 proxy)
    const email = await findEmailForPerson(firstName, lastName, dnsZone, {
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
      
      // Update task status to completed (no email found, but task finished)
      await updateTaskStatus(taskId, 'completed', executedTime);
      
      return {
        success: true,
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

