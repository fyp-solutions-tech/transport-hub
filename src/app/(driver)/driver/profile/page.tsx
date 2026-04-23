import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import DriverProfileContent from "./DriverProfileContent";

export default async function DriverProfilePage() {
  const { session } = await requireRole("DRIVER");
  const driverId = session.user.id;

  // Fetch full driver info from DB
  const user = await prisma.user.findUnique({
    where: { id: driverId },
  });

  if (!user) return <div>User not found</div>;

  // Fetch real stats
  const rides = await prisma.ride.findMany({
    where: { driverId, status: "COMPLETED" },
    select: { fare: true, rating: true },
  });

  const totalEarnings = rides.reduce((sum, r) => sum + (r.fare || 0), 0);
  const ratings = rides.filter(r => r.rating != null).map(r => r.rating!);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";

  const stats = {
    totalTrips: rides.length.toString(),
    avgRating,
    totalEarnings: `৳${totalEarnings}`,
  };

  return <DriverProfileContent initialUser={user} stats={stats} />;
}
