import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();

    const place = await prisma.savedPlace.findUnique({
      where: { id },
    });

    if (!place || place.userId !== user.id) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    const updatedPlace = await prisma.savedPlace.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedPlace);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const place = await prisma.savedPlace.findUnique({
      where: { id },
    });

    if (!place || place.userId !== user.id) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    await prisma.savedPlace.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
