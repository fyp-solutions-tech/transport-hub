import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  try {
    const drivers = await prisma.user.findMany({
      where: { role: "DRIVER" },
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    });

    return NextResponse.json(drivers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
