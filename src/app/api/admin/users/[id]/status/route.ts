import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { status } = body; // e.g., could add an 'isBlocked' field or similar logic

    const user = await prisma.user.update({
      where: { id },
      data: {
        // Assume logic for status update here
      },
    });

    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
