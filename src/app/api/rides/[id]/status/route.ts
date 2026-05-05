import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { status } = body;

    const ride = await prisma.ride.findUnique({
      where: { id },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    const updatedRide = await prisma.ride.update({
      where: { id },
      data: { status },
    });

    // Notify via socket
    const io = getIO();
    if (io) {
      io.to(`ride:${id}`).emit("ride:status_update", { status });
      io.to(`passenger:${ride.passengerId}`).emit("ride:status_update", { status });
    }

    return NextResponse.json(updatedRide);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
