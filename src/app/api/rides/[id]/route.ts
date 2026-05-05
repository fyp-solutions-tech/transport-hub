import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        passenger: true,
        driver: true,
        review: true,
      },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Security check: Only the passenger, driver, or an admin can see the ride
    if (ride.passengerId !== user.id && ride.driverId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(ride);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
