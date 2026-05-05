import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // Build where clause
    const where: Record<string, unknown> = { passengerId: session.user.id };

    if (statusFilter && statusFilter !== "all") {
      const statusMap: Record<string, string[]> = {
        completed: ["COMPLETED"],
        cancelled: ["CANCELLED"],
        ongoing: ["SEARCHING", "ACCEPTED", "ARRIVING", "IN_PROGRESS"],
        pending: ["PENDING"],
      };
      const statuses = statusMap[statusFilter.toLowerCase()];
      if (statuses) {
        where.status = { in: statuses };
      }
    }

    const rides = await prisma.ride.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rides);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
