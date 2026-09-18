import { db } from "@/db";
import { authRateLimits } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { createHmac } from "crypto";
import { env } from "@/config/env";

export const MAX_ATTEMPTS = 5;
export const BLOCK_DURATION_MINUTES = 15;

export function hashIdentifier(identifier: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(identifier).digest("hex");
}

export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const ipHash = hashIdentifier(ip);
  const normalizedEmail = email.toLowerCase().trim();
  const emailHash = hashIdentifier(normalizedEmail);

  const ipLimit = await db.query.authRateLimits.findFirst({
    where: eq(authRateLimits.keyHash, ipHash)
  });

  const emailLimit = await db.query.authRateLimits.findFirst({
    where: eq(authRateLimits.keyHash, emailHash)
  });

  const now = new Date();

  // If blocked Until is in the future, block them
  if (ipLimit?.blockedUntil && now < ipLimit.blockedUntil) {
    return false;
  }
  if (emailLimit?.blockedUntil && now < emailLimit.blockedUntil) {
    return false;
  }

  return true;
}

export async function recordFailedLogin(ip: string, email: string) {
  const ipHash = hashIdentifier(ip);
  const normalizedEmail = email.toLowerCase().trim();
  const emailHash = hashIdentifier(normalizedEmail);

  await incrementRateLimit("IP", ipHash);
  await incrementRateLimit("EMAIL", emailHash);
}

async function incrementRateLimit(scope: string, keyHash: string) {
  const blockMins = BLOCK_DURATION_MINUTES;
  const maxAttempts = MAX_ATTEMPTS;

  await db.insert(authRateLimits)
    .values({
      scope,
      keyHash,
      attempts: 1,
    })
    .onConflictDoUpdate({
      target: authRateLimits.keyHash,
      set: {
        attempts: sql`CASE WHEN ${authRateLimits.windowStartedAt} < (NOW() - CAST(${blockMins.toString()} || ' minutes' AS INTERVAL)) THEN 1 ELSE ${authRateLimits.attempts} + 1 END`,
        windowStartedAt: sql`CASE WHEN ${authRateLimits.windowStartedAt} < (NOW() - CAST(${blockMins.toString()} || ' minutes' AS INTERVAL)) THEN NOW() ELSE ${authRateLimits.windowStartedAt} END`,
        blockedUntil: sql`CASE WHEN (CASE WHEN ${authRateLimits.windowStartedAt} < (NOW() - CAST(${blockMins.toString()} || ' minutes' AS INTERVAL)) THEN 1 ELSE ${authRateLimits.attempts} + 1 END) >= ${maxAttempts} THEN (NOW() + CAST(${blockMins.toString()} || ' minutes' AS INTERVAL)) ELSE NULL END`,
        updatedAt: sql`NOW()`,
      }
    });
}

export async function resetRateLimit(ip: string, email: string) {
  const ipHash = hashIdentifier(ip);
  const normalizedEmail = email.toLowerCase().trim();
  const emailHash = hashIdentifier(normalizedEmail);

  await db.update(authRateLimits)
    .set({ attempts: 0, blockedUntil: null, windowStartedAt: sql`NOW()`, updatedAt: sql`NOW()` })
    .where(eq(authRateLimits.keyHash, ipHash));
    
  await db.update(authRateLimits)
    .set({ attempts: 0, blockedUntil: null, windowStartedAt: sql`NOW()`, updatedAt: sql`NOW()` })
    .where(eq(authRateLimits.keyHash, emailHash));
}

// Export pure logic for testability independent of DB
export function calculateRateLimitState(
  currentAttempts: number,
  windowStartedAt: Date,
  now: Date,
  maxAttempts = MAX_ATTEMPTS,
  blockDurationMins = BLOCK_DURATION_MINUTES
) {
  const windowStart = new Date(now.getTime() - blockDurationMins * 60 * 1000);
  let newAttempts = currentAttempts;
  let newWindowStartedAt = windowStartedAt;

  if (windowStartedAt < windowStart) {
    newAttempts = 1;
    newWindowStartedAt = now;
  } else {
    newAttempts += 1;
  }

  const blockedUntil = newAttempts >= maxAttempts ? new Date(now.getTime() + blockDurationMins * 60 * 1000) : null;

  return { attempts: newAttempts, windowStartedAt: newWindowStartedAt, blockedUntil };
}
