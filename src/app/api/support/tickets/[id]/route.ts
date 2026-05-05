import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { message, isInternal } = body;

    const reply = await prisma.supportTicketMessage.create({
      data: {
        ticketId: id,
        senderId: user.id,
        message,
        isInternal: !!isInternal,
      },
    });

    return NextResponse.json(reply);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { status } = body;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(ticket);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
