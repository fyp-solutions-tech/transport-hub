import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, ["ADMIN"]);
  if (error) return error;

  const { pathname } = new URL(request.url);

  try {
    if (pathname.includes("/passengers")) {
      const passengers = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(passengers);
    } else if (pathname.includes("/rides")) {
      const rides = await prisma.ride.findMany({
        orderBy: { createdAt: "desc" },
        include: { passenger: true, driver: true },
      });
      return NextResponse.json(rides);
    }
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
