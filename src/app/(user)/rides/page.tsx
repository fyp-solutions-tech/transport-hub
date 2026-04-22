import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { RidesContent } from "./RidesContent";

export default async function RidesPage() {
  const { session } = await requireRole("USER");

  const rides = await prisma.ride.findMany({
    where: { passengerId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fare: true,
      rating: true,
      status: true,
      vehicleType: true,
      pickupAddress: true,
      dropoffAddress: true,
      createdAt: true,
    },
  });

  return <RidesContent rides={JSON.parse(JSON.stringify(rides))} />;
}
