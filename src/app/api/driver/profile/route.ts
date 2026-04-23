import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const driver = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json({ driver });
  } catch (error: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, isOnline } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (isOnline !== undefined) data.isOnline = isOnline;

    // Restriction: Cannot update email or phone through this endpoint as requested
    // (email and phone are not included in the data update)

    const updatedDriver = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    return NextResponse.json({ success: true, driver: updatedDriver });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
