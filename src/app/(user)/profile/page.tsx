import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "./ProfileContent";

export default async function UserProfilePage() {
  const { session } = await requireRole("USER");

  // Fix 1: 'ride' → 'rides' (plural)
  const rides = await prisma.rides.findMany({
    where: { passengerId: session.user.id },
    select: { rating: true, status: true },
  });

  const rideCount = rides.length;
  
  // Fix 2: Add type annotations
  const ratings = rides.filter((r: { rating: number | null }) => r.rating != null).map((r: { rating: number | null }) => r.rating!);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
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