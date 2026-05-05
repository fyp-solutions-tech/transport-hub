import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { rating, comment } = body;

    const ride = await prisma.ride.findUnique({
      where: { id },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.passengerId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!ride.driverId) {
      return NextResponse.json({ error: "Cannot review a ride without a driver" }, { status: 400 });
    }

    const review = await prisma.rideReview.create({
      data: {
        rideId: id,
        reviewerId: user.id,
        revieweeId: ride.driverId,
        rating,
        comment,
      },
    });

    // Update driver's average rating
    const driverReviews = await prisma.rideReview.findMany({
      where: { revieweeId: ride.driverId },
      select: { rating: true },
    });

    const averageRating = driverReviews.reduce((acc, curr) => acc + curr.rating, 0) / driverReviews.length;

    await prisma.user.update({
      where: { id: ride.driverId },
      data: { rating: averageRating },
    });

    return NextResponse.json(review);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
