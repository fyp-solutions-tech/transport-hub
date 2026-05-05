import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { subject, message, category, priority } = body;

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        message,
        category,
        priority: priority || "MEDIUM",
      },
    });

    return NextResponse.json(ticket);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const where = user.role === "ADMIN" ? {} : { userId: user.id };
    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json(tickets);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
