import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  try {
    const totalUsers = await prisma.user.count({ where: { role: "USER" } });
    const totalDrivers = await prisma.user.count({ where: { role: "DRIVER" } });
    const totalRides = await prisma.ride.count();
    const completedRides = await prisma.ride.count({ where: { status: "COMPLETED" } });
    
    const totalEarnings = await prisma.ride.aggregate({
      where: { status: "COMPLETED" },
      _sum: { fare: true },
    });

    const recentRides = await prisma.ride.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { passenger: true, driver: true },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDrivers,
        totalRides,
        completedRides,
        totalRevenue: totalEarnings._sum.fare || 0,
      },
      recentRides,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
