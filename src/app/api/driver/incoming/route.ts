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
    
    // Fetch driver's vehicle type
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      select: { vehicleType: true, isOnline: true }
    });

    if (!driver?.isOnline) {
      return NextResponse.json({ rides: [], message: "You are offline. Go online to see requests." });
    }

    // Fetch rides that are PENDING and match driver's vehicle type
    const rides = await prisma.Ride.findMany({
      where: {
        status: "PENDING",
        vehicleType: driver.vehicleType || undefined,
        driverId: null, // ensure it's not already picked up
      },
      include: {
        passenger: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Formatting for "real-looking" mock if no rides found (optional, but requested "mock users that look real")
    // If the user wants mock users in dashboard even if DB is empty, we can provide them.
    // But since we integrated DB, let's stick to real DB entries.
    // If the DB is empty, the driver won't see anything. I'll create a seeder later.

    return NextResponse.json({ rides });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
