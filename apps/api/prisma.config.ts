import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// Load .env file
config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT || '5432';
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const url = `postgresql://${user}:${password}@${host}:${port}/${database}?schema=clients`;

export default defineConfig({
  schema: './core/database/schema.prisma',
  datasource: {
    url,
  },
});

