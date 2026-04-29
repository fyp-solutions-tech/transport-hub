// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // ── DEVELOPER LOCK / UNLOCK SYSTEM ─────────────────────
  const isAuthMiddlewareEnabled = process.env.AUTH_PROXY_ENABLED !== "false";

  // If developer turned it OFF → completely bypass middleware (unlock)
  if (!isAuthMiddlewareEnabled) {
    return NextResponse.next();
  }

  // ── NORMAL PROTECTION LOGIC (only runs when enabled) ─────
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;
  const pathname = request.nextUrl.pathname;

  // 1. AUTH PAGES (login & signup) → block if already logged in
  const authRoutes = ["/auth/login", "/auth/signup"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. PROTECTED ROUTES → require login
  const protectedRoutes = ["/dashboard", "/driver", "/booking", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Apply only to relevant paths
export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/driver/:path*",
    "/booking/:path*",
    "/profile/:path*",
  ],
};