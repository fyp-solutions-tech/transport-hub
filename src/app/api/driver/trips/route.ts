import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized or not a driver" }, { status: 401 });
    }

    const driverId = session.user.id;
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("status") || "ALL";

    const where: any = { driverId };
    if (filter !== "ALL") {
      where.status = filter;
    }

    const trips = await prisma.Ride.findMany({
      where,
      include: {
        passenger: {
          select: {
            name: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trips });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
