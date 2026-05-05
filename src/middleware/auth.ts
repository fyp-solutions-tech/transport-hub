import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function requireAuth(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  
  return { session, user: session.user };
}

export async function requireRole(request: NextRequest, roles: string[]) {
  const { session, user, error } = await requireAuth(request);
  
  if (error) return { error };
  
  if (!user || !user.role || !roles.includes(user.role)) {
    return { error: NextResponse.json({ error: "Forbidden: Insufficient privileges" }, { status: 403 }) };
  }
  
  return { session, user };
}
