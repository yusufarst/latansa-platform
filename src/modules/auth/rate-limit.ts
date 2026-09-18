import { db } from "@/db";
import { authRateLimits } from "./db/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { env } from "@/config/env";

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 15;

function hashIp(ip: string) {
  return createHash("sha256").update(`${ip}:${env.SESSION_SECRET}`).digest("hex");
}

export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const ipHash = hashIp(ip);
  const normalizedEmail = email.toLowerCase().trim();

  // Check IP rate limit first
  let limitRecord = await db.query.authRateLimits.findFirst({
    where: eq(authRateLimits.ipHash, ipHash)
  });

  if (!limitRecord) {
    // Check Email rate limit fallback if IP wasn't found (for specific cases)
    limitRecord = await db.query.authRateLimits.findFirst({
      where: eq(authRateLimits.email, normalizedEmail)
    });
  }

  if (limitRecord) {
    if (limitRecord.blockedUntil && new Date() < limitRecord.blockedUntil) {
      return false; // Blocked
    }
  }

  return true; // Allowed
}

export async function recordFailedLogin(ip: string, email: string) {
  const ipHash = hashIp(ip);
  const normalizedEmail = email.toLowerCase().trim();

  const limitRecord = await db.query.authRateLimits.findFirst({
    where: eq(authRateLimits.ipHash, ipHash)
  });

  if (limitRecord) {
    const attempts = limitRecord.attempts + 1;
    const blockedUntil = attempts >= MAX_ATTEMPTS ? new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000) : null;
    
    await db.update(authRateLimits)
      .set({ attempts, blockedUntil, email: normalizedEmail, updatedAt: new Date() })
      .where(eq(authRateLimits.id, limitRecord.id));
  } else {
    await db.insert(authRateLimits).values({
      ipHash,
      email: normalizedEmail,
      attempts: 1,
    });
  }
}

export async function resetRateLimit(ip: string, email: string) {
  const ipHash = hashIp(ip);
  const normalizedEmail = email.toLowerCase().trim();

  await db.update(authRateLimits)
    .set({ attempts: 0, blockedUntil: null, updatedAt: new Date() })
    .where(eq(authRateLimits.ipHash, ipHash));
    
  await db.update(authRateLimits)
    .set({ attempts: 0, blockedUntil: null, updatedAt: new Date() })
    .where(eq(authRateLimits.email, normalizedEmail));
}
