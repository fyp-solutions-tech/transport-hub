import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";
import { getIO } from "@/lib/socket";

export async function POST(request: NextRequest) {
  const { user, error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    const body = await request.json();
    const { isOnline, lat, lng } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isOnline: !!isOnline,
        lastLat: lat,
        lastLng: lng,
      },
    });

    // Notify via socket
    const io = getIO();
    if (io) {
      const socketRoom = `driver:${user.id}`;
      
      if (isOnline) {
        // Driver already joined their personal room in socket.ts 'join' event
        // but we can ensure online status here
        io.to(socketRoom).emit("status:updated", { isOnline: true });
      } else {
        io.to(socketRoom).emit("status:updated", { isOnline: false });
      }
    }

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
