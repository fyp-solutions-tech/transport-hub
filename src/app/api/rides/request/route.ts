import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(request: NextRequest) {
  const { user, error } = await requireRole(request, ["USER", "ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      pickupLat,
      pickupLng,
      pickupAddress,
      dropoffLat,
      dropoffLng,
      dropoffAddress,
      vehicleType,
      paymentMethod,
      distanceKm,
      durationMin,
      fare,
    } = body;

    const ride = await prisma.ride.create({
      data: {
        passengerId: user.id,
        pickupLat,
        pickupLng,
        pickupAddress,
        dropoffLat,
        dropoffLng,
        dropoffAddress,
        vehicleType,
        paymentMethod: paymentMethod || "CASH",
        distanceKm,
        durationMin,
        fare,
        status: "PENDING",
      },
      include: {
        passenger: true,
      },
    });

    // Emit socket event to online drivers
    const io = getIO();
    if (io) {
      io.to("drivers:online").emit("ride:incoming", ride);
    }

    return NextResponse.json(ride);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
