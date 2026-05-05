import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const places = await prisma.savedPlace.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(places);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { name, address, lat, lng, type, isDefault } = body;

    const place = await prisma.savedPlace.create({
      data: {
        userId: user.id,
        name,
        address,
        lat,
        lng,
        type: type || "OTHER",
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json(place);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
