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

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    if (ride.status !== "PENDING" && ride.status !== "SEARCHING") {
      return NextResponse.json({ error: "Ride is no longer available" }, { status: 400 });
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: {
        driverId: user.id,
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
      include: {
        passenger: true,
        driver: true,
      },
    });

    // Notify passenger and join ride room
    const io = getIO();
    if (io) {
      io.to(`passenger:${ride.passengerId}`).emit("ride:accepted", updatedRide);
      // We can also emit to a room specific to this ride
      io.to(`ride:${id}`).emit("ride:status_update", { status: "ACCEPTED", driver: updatedRide.driver });
    }

    return NextResponse.json(updatedRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
