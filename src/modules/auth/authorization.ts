import { cookies } from "next/headers";
import { validateSession } from "./session";
import { cache } from "react";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "session";

/**
 * Retrieves the current session and user based on the session cookie.
 * Cached per request in Next.js.
 */
export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return validateSession(token);
});

/**
 * Ensures the user is authenticated. Redirects to login if not.
 */
export async function requireUser() {
  const result = await getCurrentSession();
  
  if (!result) {
    redirect("/login");
  }
  
  return result;
}

/**
 * Ensures the user is authenticated and has a specific role.
 * Throws access denied (or redirects) if unauthorized.
 */
export async function requireRole(allowedRoleCodes: string[]) {
  const { session, user } = await requireUser();
  
  // Note: For a real production app, role resolution should include the role code.
  // Since we have roleId on the user, let's fetch the role code if needed or ensure it's part of the session validation join.
  // We need to slightly adjust our session.ts to include the role code if we use this extensively, 
  // or just fetch it here.
  const { db } = await import("@/db");
  const { roles } = await import("./db/schema");
  const { eq } = await import("drizzle-orm");
  
  const roleRecord = await db.query.roles.findFirst({
    where: eq(roles.id, user.roleId),
  });
  
  if (!roleRecord || !allowedRoleCodes.includes(roleRecord.code)) {
    // Instead of throwing an error, we might want to render an unauthorized page or redirect to a standard denied page.
    // Throwing a generic Next error for now or redirecting to an unauthorized route.
    redirect("/internal?error=access_denied");
  }
  
  return { session, user, role: roleRecord };
}
