import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized or not a driver" }, { status: 401 });
    }

    const { rideId } = await request.json();
    if (!rideId) {
      return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });
    }

    const driverId = session.user.id;

    // Atomically claim the ride to prevent two drivers accepting at once.
    const claim = await prisma.ride.updateMany({
      where: { id: rideId, status: "PENDING", driverId: null },
      data: {
        driverId,
        status: "ACCEPTED",
      },
    });
    if (claim.count === 0) {
      return NextResponse.json({ error: "Ride is no longer available" }, { status: 409 });
    }

    const updatedRide = await prisma.ride.findUnique({ where: { id: rideId } });

    return NextResponse.json({ success: true, ride: updatedRide });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
