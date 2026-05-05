import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { rideId, amount } = body;

    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        rideId,
        amount,
        loanAmount: amount,
        method: "LOAN",
        status: "PAID",
        type: "LOAN",
      },
    });

    if (rideId) {
      await prisma.ride.update({
        where: { id: rideId },
        data: {
          loanAmount: amount,
          paymentMethod: "LOAN",
        },
      });
    }

    return NextResponse.json(transaction);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
