import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  APP_URL: z.string().url(),
  PUBLIC_SITE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16),
  ENCRYPTION_KEY: z.string().min(16),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_INITIAL_PASSWORD: z.string().min(8),
  UPLOAD_DIR: z.string().min(1),
  PUBLIC_DOMAIN: z.string().optional(),
  INTERNAL_DOMAIN: z.string().optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1).optional(),
});

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  APP_URL: process.env.APP_URL,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_INITIAL_PASSWORD: process.env.SUPER_ADMIN_INITIAL_PASSWORD,
  UPLOAD_DIR: process.env.UPLOAD_DIR,
  PUBLIC_DOMAIN: process.env.PUBLIC_DOMAIN,
  INTERNAL_DOMAIN: process.env.INTERNAL_DOMAIN,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
};

const isServer = typeof window === "undefined";

const parsedServer = isServer ? serverSchema.safeParse(processEnv) : { success: true, data: {} };
const parsedClient = clientSchema.safeParse(processEnv);

if (!parsedServer.success || !parsedClient.success) {
  console.error("❌ Invalid environment variables:");
  if (!parsedServer.success && 'error' in parsedServer) {
    console.error(parsedServer.error.format());
  }
  if (!parsedClient.success && 'error' in parsedClient) {
    console.error(parsedClient.error.format());
  }
  throw new Error("Invalid environment variables");
}

export const env = {
  ...parsedServer.data,
  ...parsedClient.data,
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
