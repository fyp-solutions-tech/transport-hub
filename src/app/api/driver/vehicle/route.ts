import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const driver = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
          vehicleMake: true,
          vehicleModel: true,
          vehicleYear: true,
          vehicleColor: true,
          vehiclePlate: true,
          vehicleType: true,
      }
    });

    return NextResponse.json(driver);
  } catch (error: unknown) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id || session.user.role !== "DRIVER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleMake, vehicleModel, vehicleYear, vehicleColor, vehiclePlate, vehicleType } = body;

    const updatedDriver = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehiclePlate,
        vehicleType,
      },
    });

    return NextResponse.json({ success: true, vehicle: updatedDriver });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
