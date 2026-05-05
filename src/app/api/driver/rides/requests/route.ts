import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    // Find rides that are pending and match the driver's vehicle type
    const rides = await prisma.ride.findMany({
      where: {
        status: "PENDING",
        vehicleType: user.vehicleType || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        passenger: true,
      },
    });

    return NextResponse.json(rides);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
