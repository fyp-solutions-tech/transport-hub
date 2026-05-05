import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    let reason: string | undefined;
    try {
      const body = await request.json();
      reason = body.reason;
    } catch (e) {
      reason = undefined;
    }

    const ride = await prisma.ride.findUnique({
      where: { id },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.passengerId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
    });

    // Notify relevant parties via socket
    const io = getIO();
    if (io) {
      io.to(`ride:${id}`).emit("ride:cancelled", { rideId: id, reason });
      if (ride.driverId) {
        io.to(`driver:${ride.driverId}`).emit("ride:cancelled", { rideId: id });
      }
    }

    return NextResponse.json(updatedRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
