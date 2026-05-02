import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { z } from "zod";

const bookingSchema = z.object({
  pickupLat: z.coerce.number().finite(),
  pickupLng: z.coerce.number().finite(),
  pickupAddress: z.string().trim().min(1),
  dropoffLat: z.coerce.number().finite(),
  dropoffLng: z.coerce.number().finite(),
  dropoffAddress: z.string().trim().min(1),
  vehicleType: z.enum(["economy", "comfort", "moto"]),
  distanceKm: z.coerce.number().finite().nonnegative().optional(),
  durationMin: z.coerce.number().finite().nonnegative().optional(),
  fare: z.coerce.number().finite().nonnegative(),
  paymentMethod: z.enum(["cash", "loan", "card"]).optional(),
  loanAmount: z.coerce.number().finite().nonnegative().optional(),
});

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
    const parsedBody = bookingSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid booking payload.", details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }
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
      paymentMethod,
      loanAmount,
    } = parsedBody.data;

    // ── Create ride in database ───────────────────────
    const ride = await prisma.ride.create({
      data: {
        passengerId: session.user.id,
        pickupLat,
        pickupLng,
        pickupAddress,
        dropoffLat,
        dropoffLng,
        dropoffAddress,
        vehicleType,
        distanceKm: distanceKm ?? null,
        durationMin: durationMin ?? null,
        fare,
        status: "PENDING",
        paymentMethod: paymentMethod ?? "cash",
        loanAmount: loanAmount ?? 0,
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
