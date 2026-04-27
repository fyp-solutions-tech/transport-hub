// src/lib/session.ts
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type UserRole = "USER" | "DRIVER" | "ADMIN";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/** Require a valid session. Redirects to /auth/login if not authenticated. */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session;
}

/** Require a specific role. Redirects to login or the correct dashboard. */
export async function requireRole(role: UserRole) {
  const session = await requireAuth();
  const userRole = (session.user.role as UserRole) ?? "USER";

  if (userRole !== role) {
    // Send them to their correct home
    if (userRole === "DRIVER") redirect("/driver/dashboard");
    else if (userRole === "ADMIN") redirect("/admin/dashboard");
    else redirect("/dashboard");
  }

  return { session, role: userRole };
}

/** Get the correct dashboard URL based on user role */
export function getDashboardUrl(role: UserRole): string {
  switch (role) {
    case "DRIVER":
      return "/driver/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    case "USER":
    default:
      return "/dashboard";
  }
}