import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // ── Authenticate user ─────────────────────────────
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // ── Parse & validate body ─────────────────────────
    const body = await request.json();
    const {
      pickupLat,
      pickupLng,
      pickupAddress,
      dropoffLat,
      dropoffLng,
      dropoffAddress,
      vehicleType,
      distanceKm,
      durationMin,
      fare,
    } = body;

    // Required field validation
    if (
      pickupLat == null ||
      pickupLng == null ||
      !pickupAddress ||
      dropoffLat == null ||
      dropoffLng == null ||
      !dropoffAddress ||
      !vehicleType ||
      fare == null
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    // Validate vehicle type
    const validVehicles = ["economy", "comfort", "moto"];
    if (!validVehicles.includes(vehicleType)) {
      return NextResponse.json(
        { error: "Invalid vehicle type." },
        { status: 400 }
      );
    }

    // ── Create ride in database ───────────────────────
    const ride = await prisma.ride.create({
      data: {
        passengerId: session.user.id,
        pickupLat: parseFloat(pickupLat),
        pickupLng: parseFloat(pickupLng),
        pickupAddress: String(pickupAddress),
        dropoffLat: parseFloat(dropoffLat),
        dropoffLng: parseFloat(dropoffLng),
        dropoffAddress: String(dropoffAddress),
        vehicleType: String(vehicleType),
        distanceKm: distanceKm ? parseFloat(distanceKm) : null,
        durationMin: durationMin ? parseFloat(durationMin) : null,
        fare: parseFloat(fare),
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        success: true,
        bookingId: ride.id,
        status: ride.status,
        message: "Ride booked successfully!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
