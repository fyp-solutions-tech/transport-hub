import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { error } = await requireAuth(request);
  if (error) return error;

  try {
    const ride = await prisma.ride.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            lastLat: true,
            lastLng: true,
            image: true,
          }
        }
      },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json({
      rideId: ride.id,
      status: ride.status,
      driverLocation: ride.driver ? {
        lat: ride.driver.lastLat,
        lng: ride.driver.lastLng,
      } : null,
      pickup: { lat: ride.pickupLat, lng: ride.pickupLng },
      dropoff: { lat: ride.dropoffLat, lng: ride.dropoffLng },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
