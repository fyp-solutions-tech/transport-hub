import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/middleware/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  const { error } = await requireRole(request, ["DRIVER", "ADMIN"]);
  if (error) return error;

  try {
    // In a sophisticated system, rejection would mark the ride as "rejected by this driver"
    // and keep it pending for others. For now, we'll just return success.
    return NextResponse.json({ success: true, message: "Ride rejected" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
