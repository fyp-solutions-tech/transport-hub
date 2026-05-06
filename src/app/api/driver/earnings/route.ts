import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    const driverStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        totalEarnings: true,
        totalTrips: true,
        rating: true,
      },
    });

    // Get today's earnings
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayRides = await prisma.ride.findMany({
      where: {
        driverId: user.id,
        status: "COMPLETED",
        completedAt: {
          gte: startOfToday,
        },
      },
      select: {
        fare: true,
      },
    });

    const todayEarnings = todayRides.reduce((acc: any, curr: any) => acc + Number(curr.fare || 0), 0);

    return NextResponse.json({
      ...driverStats,
      todayEarnings,
      currency: "PKR",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
