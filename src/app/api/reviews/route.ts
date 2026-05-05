import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { rideId, revieweeId, rating, comment } = body;

    const review = await prisma.rideReview.create({
      data: {
        rideId,
        reviewerId: user.id,
        revieweeId,
        rating,
        comment,
      },
    });

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
