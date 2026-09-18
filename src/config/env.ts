import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  APP_URL: z.string().url(),
  PUBLIC_SITE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(16),
  ENCRYPTION_KEY: z.string().min(16),
  UPLOAD_DIR: z.string().min(1),
  PUBLIC_DOMAIN: z.string().optional(),
  INTERNAL_DOMAIN: z.string().optional(),
});

const bootstrapSchema = z.object({
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_INITIAL_PASSWORD: z.string().min(8),
});

const clientSchema = z.object({
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(1).optional(),
});

const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
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
const skipValidation = process.env.SKIP_ENV_VALIDATION === "1" || process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build";

const parsedServer = isServer && !skipValidation ? serverSchema.safeParse(processEnv) : { success: true, data: processEnv as Record<string, string | undefined> };
const parsedClient = !skipValidation ? clientSchema.safeParse(processEnv) : { success: true, data: processEnv as Record<string, string | undefined> };

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

export function getBootstrapEnv() {
  const parsed = bootstrapSchema.safeParse(processEnv);
  if (!parsed.success) {
    console.error("❌ Invalid bootstrap environment variables:");
    console.error(parsed.error.format());
    throw new Error("Invalid bootstrap environment variables");
  }
  return parsed.data;
}
