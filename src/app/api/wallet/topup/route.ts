import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { amount } = body;

    const wallet = await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {
        balance: { increment: amount },
      },
      create: {
        userId: user.id,
        balance: amount,
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        amount,
        method: "WALLET",
        status: "PAID",
        type: "TOP_UP",
      },
    });

    return NextResponse.json(wallet);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
