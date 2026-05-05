import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  try {
    const rides = await prisma.ride.findMany({
      orderBy: { createdAt: "desc" },
      include: { passenger: true, driver: true },
    });
    return NextResponse.json(rides);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
