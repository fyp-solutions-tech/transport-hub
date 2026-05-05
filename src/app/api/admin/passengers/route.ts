import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  try {
    const passengers = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(passengers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
