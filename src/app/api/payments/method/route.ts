import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { method } = body;

    // This could update a user setting or a primary payment method record
    return NextResponse.json({ success: true, method });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
