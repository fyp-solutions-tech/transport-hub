import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const notification = await prisma.notification.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json(notification);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
