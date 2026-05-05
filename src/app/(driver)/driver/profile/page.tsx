import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import DriverProfileContent from "./DriverProfileContent";
import { MdErrorOutline } from "react-icons/md";

export default async function DriverProfilePage() {
  let user: any = null;
  let stats: any = null;
  let error: string | null = null;

  try {
    const { session } = await requireRole("DRIVER");
    const driverId = session.user.id;

    user = await prisma.user.findUnique({
      where: { id: driverId },
    });

    if (!user) {
      error = "User not found";
    } else {
      const rides = await prisma.ride.findMany({
        where: { driverId, status: "COMPLETED" },
        select: { fare: true, rating: true },
      });

      const totalEarnings = rides.reduce((sum, r) => sum + (r.fare || 0), 0);
      const ratings = rides.filter(r => r.rating != null).map(r => r.rating!);
      const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";

      stats = {
        totalTrips: rides.length.toString(),
        avgRating,
        totalEarnings: `PKR ${Math.round(totalEarnings)}`,
      };
    }
  } catch (err) {
    console.error("Error loading driver profile:", err);
    error = "Failed to load profile. Please try again later.";
  }

  if (error || !user || !stats) {
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

  return <DriverProfileContent initialUser={user} stats={stats} />;
}
