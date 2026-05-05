import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { error } = await requireAuth(request);
  if (error) return error;

  try {
    const reviews = await prisma.rideReview.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: "desc" },
      include: { reviewer: true },
    });

    return NextResponse.json(reviews);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
