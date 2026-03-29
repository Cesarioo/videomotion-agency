import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';

config();

// 1. Build the connection string dynamically
const host = process.env.DB_HOST;
const port = process.env.DB_PORT || '5432';
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

// Connection string (Prisma multiSchema handles schema qualification via @@schema directives)
const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

// 2. Create a standard Postgres connection pool
const pool = new Pool({ connectionString });

// 3. Create the Prisma Adapter using that pool
const adapter = new PrismaPg(pool);

// 4. Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;