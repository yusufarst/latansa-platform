import { randomBytes, createHmac } from "crypto";
import { env } from "@/config/env";
import { db } from "@/db";
import { sessions, users } from "./db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";
const SESSION_EXPIRY_HOURS = 12;

export function getCookieConfig(expiresAt?: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(expiresAt ? { expires: expiresAt } : { maxAge: 0 }),
  };
}

/**
 * Generate a cryptographically secure random session token.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hash the raw token for database storage using HMAC-SHA256.
 */
export function hashSessionToken(token: string): string {
  return createHmac("sha256", env.SESSION_SECRET).update(token).digest("hex");
}

/**
 * Create a new session in the database and set the cookie.
 */
export async function createSession(userId: string): Promise<void> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000);

  await db.insert(sessions).values({
    userId,
    tokenHash,
    expiresAt,
  });

  await setSessionCookie(token, expiresAt);
}

/**
 * Sets the session cookie using standard security configuration.
 */
async function setSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, getCookieConfig(expiresAt));
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", getCookieConfig());
}

/**
 * Validate a session token. Checks expiry and revocation.
 */
export async function validateSession(token: string) {
  const tokenHash = hashSessionToken(token);
  const result = await db
    .select({
      session: sessions,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.tokenHash, tokenHash))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  const { session, user } = result[0];

  if (session.revokedAt || new Date() > session.expiresAt || !user.isActive) {
    return null;
  }

  // Optionally update lastSeenAt
  await db.update(sessions).set({ lastSeenAt: new Date() }).where(eq(sessions.id, session.id));

  return { session, user };
}

/**
 * Revokes a session in the database.
 */
export async function revokeSession(token: string) {
  const tokenHash = hashSessionToken(token);
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.tokenHash, tokenHash));
}
