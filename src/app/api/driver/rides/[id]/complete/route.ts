import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    const ride = await prisma.ride.findUnique({
      where: { id },
    });

    if (!ride || ride.driverId !== user.id) {
      return NextResponse.json({ error: "Ride not found or not assigned to you" }, { status: 404 });
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Update driver stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalEarnings: {
          increment: ride.fare || 0,
        },
        totalTrips: {
          increment: 1,
        },
      },
    });

    // Create payment transaction
    if (ride.fare) {
      await prisma.paymentTransaction.create({
        data: {
          userId: ride.passengerId,
          rideId: ride.id,
          amount: ride.fare,
          method: ride.paymentMethod,
          status: "PAID",
          type: "RIDE_FARE",
        },
      });
    }

    // Notify passenger
    const io = getIO();
    if (io) {
      io.to(`passenger:${ride.passengerId}`).emit("ride:completed", updatedRide);
      io.to(`ride:${id}`).emit("ride:status_update", { status: "COMPLETED" });
    }

    return NextResponse.json(updatedRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
