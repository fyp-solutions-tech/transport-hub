import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    const rides = await prisma.ride.findMany({
      where: {
        driverId: user.id,
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
