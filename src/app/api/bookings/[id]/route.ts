import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { z } from "zod";

const patchSchema = z.object({
  rating: z.coerce.number().min(1).max(5).optional(),
  status: z
    .enum([
      "PENDING",
      "SEARCHING",
      "ACCEPTED",
      "ARRIVING",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  paymentMethod: z.enum(["cash", "loan", "card"]).optional(),
  loanAmount: z.coerce.number().finite().nonnegative().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ride = await prisma.ride.findUnique({ where: { id } });
    if (!ride || ride.passengerId !== session.user.id) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(ride);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingRide = await prisma.ride.findUnique({ where: { id } });
    if (!existingRide) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    const isOwner =
      existingRide.passengerId === session.user.id ||
      existingRide.driverId === session.user.id ||
      session.user.role === "ADMIN";
    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedBody = patchSchema.safeParse(await request.json());
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid update payload", details: parsedBody.error.flatten() },
        { status: 400 }
      );
    }
    const { rating, status, paymentMethod, loanAmount } = parsedBody.data;

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (rating !== undefined) updateData.rating = rating;
    if (status !== undefined) updateData.status = status;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (loanAmount !== undefined) updateData.loanAmount = loanAmount;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const ride = await prisma.ride.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, ride });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
