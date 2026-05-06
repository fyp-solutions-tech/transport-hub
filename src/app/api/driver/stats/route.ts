import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized or not a driver" }, { status: 401 });
    }

    const driverId = session.user.id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Aggregate stats
    const rides = await prisma.ride.findMany({
      where: { driverId },
      select: { fare: true, rating: true, status: true, createdAt: true },
    });

    const totalTrips = rides.length;
    const completedRides = rides.filter((r: any) => r.status === "COMPLETED");
    const totalEarnings = completedRides.reduce((sum: any, r: any) => sum + (r.fare || 0), 0);  
    
    const todayRides = completedRides.filter((r: any) => new Date(r.createdAt) >= startOfToday);
    const todayEarnings = todayRides.reduce((sum: any, r: any) => sum + (r.fare || 0), 0);
    const todayCount = todayRides.length;

    const ratings = completedRides.filter((r: any) => r.rating != null).map((r: any) => r.rating!);
    const avgRating = ratings.length > 0 ? ratings.reduce((a: any, b: any) => a + b, 0) / ratings.length : 0;

    // Acceptance rate: Number of ACCEPTED/COMPLETED rides vs Total assigned rides
    const assignedRides = rides.length;
    const acceptedRides = rides.filter((r: any) => r.status !== "CANCELLED").length;
    const acceptanceRate = assignedRides > 0 ? `${Math.round((acceptedRides / assignedRides) * 100)}%` : "100%";

    // Get current active ride
    const currentRide = await prisma.ride.findFirst({
      where: {
        driverId,
        status: { in: ["ACCEPTED", "ARRIVING", "IN_PROGRESS"] },
      },
      include: {
        passenger: {
          select: { name: true, image: true, rating: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      todayEarnings: `PKR ${Math.round(todayEarnings)}`,
      todayTrips: todayCount.toString(),
      acceptanceRate,
      totalTrips: totalTrips.toString(),
      totalEarnings: `PKR ${Math.round(totalEarnings)}`,
      avgRating: avgRating > 0 ? avgRating.toFixed(1) : "—",
      currentRide,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
