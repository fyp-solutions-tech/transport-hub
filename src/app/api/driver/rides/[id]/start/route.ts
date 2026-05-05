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
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });

    // Notify passenger
    const io = getIO();
    if (io) {
      io.to(`passenger:${ride.passengerId}`).emit("ride:started", updatedRide);
      io.to(`ride:${id}`).emit("ride:status_update", { status: "IN_PROGRESS" });
    }

    return NextResponse.json(updatedRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
