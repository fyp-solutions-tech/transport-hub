import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseFloat(searchParams.get("radius") || "5"); // default 5km

  try {
    // In a real app, use PostGIS for spatial queries. 
    // Here we'll do a simple box filter as an approximation.
    const degPerKm = 1 / 111; // roughly 1 degree per 111km
    const delta = radius * degPerKm;

    const drivers = await prisma.user.findMany({
      where: {
        role: "DRIVER",
        isOnline: true,
        lastLat: {
          gte: lat - delta,
          lte: lat + delta,
        },
        lastLng: {
          gte: lng - delta,
          lte: lng + delta,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        rating: true,
        vehicleType: true,
        lastLat: true,
        lastLng: true,
      },
    });

    return NextResponse.json(drivers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
