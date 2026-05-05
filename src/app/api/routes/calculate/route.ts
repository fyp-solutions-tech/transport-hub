import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const distanceKm = parseFloat(searchParams.get("distanceKm") || "0");

  // Basic calculation: 30km/h average speed
  const averageSpeedKmH = 30;
  const durationMin = Math.round((distanceKm / averageSpeedKmH) * 60);

  return NextResponse.json({
    distanceKm,
    durationMin,
    etaMin: durationMin + 2, // 2 mins buffer
  });
}
