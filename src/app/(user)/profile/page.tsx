import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ProfileContent } from "./ProfileContent";
import { MdErrorOutline } from "react-icons/md";

export default async function UserProfilePage() {
  let profileData: any = null;
  let error: string | null = null;

  try {
    const { session } = await requireRole("USER");

    const rides = await prisma.ride.findMany({
      where: { passengerId: session.user.id },
      select: { rating: true, status: true },
    });

    const rideCount = rides.length;
    const ratings = rides.filter((r: { rating: number | null }) => r.rating != null).map((r: { rating: number | null }) => r.rating!);
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : "—";

    profileData = {
      name: session.user.name,
      email: session.user.email,
      rideCount,
      avgRating,
      createdAt: session.user.createdAt,
    };
  } catch (err) {
    console.error('Failed to load user profile:', err)
    error = "Failed to load profile. Please try again later.";
  }

  if (error || !profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <MdErrorOutline className="text-error text-4xl" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-base-content">Oops! Something went wrong</h2>
          <p className="text-base-content/60">{error || "Failed to load profile"}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary gap-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <ProfileContent profile={profileData} />;
}
