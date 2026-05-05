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
    const body = await request.json();
    const { lat, lng } = body;

    // Update driver's last known location
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLat: lat,
        lastLng: lng,
      },
    });

    // Broadcast location update via socket
    const io = getIO();
    if (io) {
      io.to(`ride:${id}`).emit("location:updated", { rideId: id, lat, lng });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
