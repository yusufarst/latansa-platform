import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This proxy provides UX-level redirects.
// The actual security boundary is the backend RBAC checks inside pages/actions.

export function proxy(request: NextRequest) {
  const isInternalRoute = request.nextUrl.pathname.startsWith("/internal");
  const hasSessionCookie = request.cookies.has("session");

  if (isInternalRoute && !hasSessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/internal/:path*",
  ],
};
