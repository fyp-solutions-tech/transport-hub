import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
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

    // Fetch rides that are PENDING and match driver's vehicle type (case-insensitive)
    const rides = await prisma.ride.findMany({
      where: {
        status: "PENDING",
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

    // Filter rides by vehicle type
    const filteredRides = rides.filter((ride: any) => {
      if (!driver.vehicleType) return true;
      const rideVehicleType = (ride.vehicleType || "").toLowerCase();
      const driverVehicleType = driver.vehicleType.toLowerCase();
      return rideVehicleType === driverVehicleType;
    });

    return NextResponse.json({ rides: filteredRides });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
