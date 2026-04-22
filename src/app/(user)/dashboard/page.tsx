import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "./DashboardContent";

export default async function UserDashboardPage() {
  const { session } = await requireRole("USER");
  const firstName = session.user.name.split(" ")[0];

  // ── Fetch real stats from DB ─────────────────────────
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

  return (
    <DashboardContent 
      firstName={firstName} 
      initialRides={JSON.parse(JSON.stringify(rides))} 
    />
  );
}
