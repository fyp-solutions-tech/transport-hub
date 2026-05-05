import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RidePageContent } from "./RidePageContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RidePage({ params }: PageProps) {
  const { id } = await params;

  const ride = await prisma.ride.findUnique({
    where: { id },
    include: { driver: true },
  });

  if (!ride) {
    notFound();
  }

  // Map database ride to the format expected by the client component
  const rideData = {
    id: ride.id,
    pickupLat: ride.pickupLat,
    pickupLng: ride.pickupLng,
    pickupAddress: ride.pickupAddress,
    dropoffLat: ride.dropoffLat,
    dropoffLng: ride.dropoffLng,
    dropoffAddress: ride.dropoffAddress,
    fare: Number(ride.fare) || 0,
    distanceKm: ride.distanceKm || 0,
    durationMin: ride.durationMin || 0,
    vehicleType: ride.vehicleType || "economy",
    status: ride.status,
    driverId: ride.driverId,
    driver: ride.driver,
  };

  return <RidePageContent ride={rideData} />;
}
