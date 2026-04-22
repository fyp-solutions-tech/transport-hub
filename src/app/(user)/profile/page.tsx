import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "./ProfileContent";

export default async function UserProfilePage() {
  const { session } = await requireRole("USER");

  // Fetch real stats
  const rides = await prisma.ride.findMany({
    where: { passengerId: session.user.id },
    select: { rating: true, status: true },
  });

  const rideCount = rides.length;
  const ratings = rides.filter(r => r.rating != null).map(r => r.rating!);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "—";

  const profileData = {
    name: session.user.name,
    email: session.user.email,
    rideCount,
    avgRating,
    createdAt: session.user.createdAt,
  };

  return <ProfileContent profile={profileData} />;
}
