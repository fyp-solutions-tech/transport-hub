import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const rides = await prisma.ride.findMany({
      where: {
        OR: [
          { passengerId: user.id },
          { driverId: user.id },
        ],
        status: {
          in: ["PENDING", "ACCEPTED", "ARRIVING", "IN_PROGRESS"],
        },
      },
      include: {
        passenger: true,
        driver: true,
      },
    });

    return NextResponse.json(rides);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
