"use server";

import { loginSchema, LoginInput } from "./validation";
import { checkRateLimit, recordFailedLogin, resetRateLimit } from "./rate-limit";
import { verifyPassword } from "./password";
import { createSession, clearSessionCookie } from "./session";
import { getCurrentSession } from "./authorization";
import { appendAuditLog } from "./audit";
import { db } from "@/db";
import { users, sessions } from "./db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp.trim();
  }
  
  return "127.0.0.1";
}

export async function loginAction(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);
  
  if (!parsed.success) {
    return { error: "Invalid input provided" };
  }
  
  const { email, password } = parsed.data;
  const ip = await getIp();
  
  const isAllowed = await checkRateLimit(ip, email);
  if (!isAllowed) {
    return { error: "Too many login attempts. Please try again later." };
  }
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  
  if (!user || !user.isActive) {
    await recordFailedLogin(ip, email);
    await appendAuditLog("AUTH_LOGIN_FAILURE", { metadata: { email, reason: "invalid_credentials" } });
    return { error: "Invalid email or password" };
  }
  
  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    await recordFailedLogin(ip, email);
    await appendAuditLog("AUTH_LOGIN_FAILURE", { metadata: { email, reason: "invalid_credentials" } });
    return { error: "Invalid email or password" };
  }
  
  await resetRateLimit(ip, email);
  
  const token = await createSession(user.id);
  
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  
  await appendAuditLog("AUTH_LOGIN_SUCCESS", { actorUserId: user.id });
  
  redirect("/internal");
}

export async function logoutAction() {
  const sessionResult = await getCurrentSession();
  
  if (sessionResult) {
    const { session, user } = sessionResult;
    
    // Revoke the session in the DB using the raw token if we had it,
    // but we only have the tokenHash in the DB session record.
    // We can just update by ID.
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, session.id));
    
    await appendAuditLog("AUTH_LOGOUT", { actorUserId: user.id, entityType: "SESSION", entityId: session.id });
  }
  
  await clearSessionCookie();
  redirect("/login");
}
