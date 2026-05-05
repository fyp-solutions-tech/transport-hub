import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { rideId, amount, method, status } = body;

    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        rideId,
        amount,
        method,
        status: status || "PENDING",
        type: "RIDE_FARE",
      },
    });

    return NextResponse.json(transaction);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
