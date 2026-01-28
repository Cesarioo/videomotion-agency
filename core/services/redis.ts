import { config } from 'dotenv';
import IORedis from 'ioredis';

config();

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

/**
 * Create a new Redis connection
 * BullMQ requires separate connections for queue and worker
 */
export function createRedisConnection() {
  return new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null, // Required by BullMQ
  });
}

// Shared connection for general use
export const redis = createRedisConnection();

console.log(`Redis connecting to: ${REDIS_HOST}:${REDIS_PORT}`);
