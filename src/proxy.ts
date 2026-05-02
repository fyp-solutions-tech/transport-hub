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
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Failed to get session:", error);
  }

  const isLoggedIn = !!session?.user;
  const isVerified = session?.user?.emailVerified;
  const pathname = request.nextUrl.pathname;

  const authRoutes = ["/auth/login", "/auth/signup", "/auth/driver"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  const protectedRoutes = ["/dashboard", "/driver", "/booking", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. If NOT logged in
  if (!isLoggedIn) {
    // Block protected routes AND waiting/onboarding pages
    if (isProtectedRoute || pathname === "/auth/waiting" || pathname === "/auth/onboarding") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  // ── USER IS LOGGED IN ────────────────────────────────────

  // Special case: Onboarding route needs to process role (Google login)
  if (pathname === "/auth/onboarding" && request.nextUrl.searchParams.has("intendedRole")) {
    return NextResponse.next();
  }

  // 2. If logged in but NOT verified
  if (!isVerified) {
    // Block access to protected routes and auth routes
    if (isProtectedRoute || isAuthRoute) {
      return NextResponse.redirect(new URL("/auth/waiting", request.url));
    }
    // Allow access to "/", "/auth/waiting"
    return NextResponse.next();
  } 
  
  // 3. If logged in AND verified
  if (isVerified) {
    // Block access to auth routes, home page, and waiting page
    if (isAuthRoute || pathname === "/" || pathname === "/auth/waiting") {
      if (session?.user?.role === "DRIVER") {
        return NextResponse.redirect(new URL("/driver/dashboard", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Apply only to relevant paths
export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/driver/:path*",
    "/booking/:path*",
    "/profile/:path*",
  ],
};