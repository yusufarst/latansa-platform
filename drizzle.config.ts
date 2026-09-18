import { defineConfig } from 'drizzle-kit';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

const envConfig = dotenv.parse(fs.readFileSync('.env'));

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: envConfig.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
