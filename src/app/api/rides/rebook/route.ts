import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { pastRideId } = body;

    const pastRide = await prisma.ride.findUnique({
      where: { id: pastRideId },
    });

    if (!pastRide) {
      return NextResponse.json({ error: "Past ride not found" }, { status: 404 });
    }

    const newRide = await prisma.ride.create({
      data: {
        passengerId: user.id,
        pickupLat: pastRide.pickupLat,
        pickupLng: pastRide.pickupLng,
        pickupAddress: pastRide.pickupAddress,
        dropoffLat: pastRide.dropoffLat,
        dropoffLng: pastRide.dropoffLng,
        dropoffAddress: pastRide.dropoffAddress,
        vehicleType: pastRide.vehicleType,
        paymentMethod: pastRide.paymentMethod,
        distanceKm: pastRide.distanceKm,
        durationMin: pastRide.durationMin,
        fare: pastRide.fare,
        status: "PENDING",
      },
      include: {
        passenger: true,
      },
    });

    // Notify drivers
    const io = getIO();
    if (io) {
      io.to("drivers:online").emit("ride:incoming", newRide);
    }

    return NextResponse.json(newRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
