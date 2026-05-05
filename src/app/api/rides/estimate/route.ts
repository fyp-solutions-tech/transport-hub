import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAuth(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const distanceKm = parseFloat(searchParams.get("distanceKm") || "0");
  const vehicleType = searchParams.get("vehicleType") || "standard";

  // Basic fare calculation logic
  const baseFare: Record<string, number> = {
    standard: 50,
    premium: 100,
    bike: 30,
  };

  const perKmRate: Record<string, number> = {
    standard: 15,
    premium: 25,
    bike: 10,
  };

  const selectedBaseFare = baseFare[vehicleType] || baseFare.standard;
  const selectedPerKmRate = perKmRate[vehicleType] || perKmRate.standard;

  const estimatedFare = selectedBaseFare + (distanceKm * selectedPerKmRate);

  return NextResponse.json({
    distanceKm,
    vehicleType,
    estimatedFare: Math.round(estimatedFare),
    currency: "PKR",
  });
}
