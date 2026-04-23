import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized or not a driver" }, { status: 401 });
    }

    const { rideId } = await request.json();
    if (!rideId) {
      return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });
    }

    const driverId = session.user.id;

    // First check if ride is still pending
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.status !== "PENDING") {
      return NextResponse.json({ error: "Ride is no longer available" }, { status: 400 });
    }

    // Update ride status and assign driver
    const updatedRide = await prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        status: "ACCEPTED",
        isDriverAccepted: true,
      },
    });

    return NextResponse.json({ success: true, ride: updatedRide });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
