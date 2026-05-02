import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  MdCalendarToday,
  MdExpandMore,
  MdSwapVert,
  MdDownload,
  MdArrowForwardIos,
  MdTrendingUp,
  MdRoute,
  MdStar,
  MdChevronLeft,
  MdChevronRight,
  MdErrorOutline,
} from "react-icons/md";

export default async function DriverTripsPage() {
  let allCompletedRides: any[] = [];
  let trips: any[] = [];
  let error: string | null = null;

  try {
    const { session } = await requireRole("DRIVER");
    const driverId = session.user.id;

    allCompletedRides = await prisma.ride.findMany({
      where: { driverId, status: "COMPLETED" },
      select: { fare: true, createdAt: true, distanceKm: true, rating: true },
    });

    trips = await prisma.ride.findMany({
      where: { driverId },
      include: { passenger: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Error loading driver trips:", err);
    error = "Failed to load ride history. Please try again later.";
  }

  const completedCount = allCompletedRides?.length || 0;
  const totalDistance = (allCompletedRides || []).reduce((sum, r) => sum + (r.distanceKm || 0), 0);
  const ratings = (allCompletedRides || []).filter((r) => r.rating != null).map((r) => r.rating!);
  const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : "4.92";
  const completionRate = completedCount > 0 ? "96.4" : "100";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <MdErrorOutline className="text-error text-4xl" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-base-content">Oops! Something went wrong</h2>
          <p className="text-base-content/60">{error}</p>
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

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">Ride History</h1>
        <p className="text-base-content/60">Review your completed and cancelled trips from the last 90 days.</p>
      </header>

      <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-6 mb-8 border border-base-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative min-w-[240px]">
              <label className="block text-xs text-base-content/60 mb-1 ml-1">Date Range</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-base-200/50 rounded-lg border border-base-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <MdCalendarToday className="text-base-content/60" />
                <input className="bg-transparent border-none p-0 text-sm font-semibold w-full focus:ring-0 text-base-content" readOnly type="text" value="Oct 01, 2023 - Oct 31, 2023" />
              </div>
            </div>

            <div className="relative min-w-[160px]">
              <label className="block text-xs text-base-content/60 mb-1 ml-1">Status</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-base-200/50 rounded-lg border border-base-300 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer">
                  <option>All Trips</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/60" />
              </div>
            </div>

            <div className="relative min-w-[180px]">
              <label className="block text-xs text-base-content/60 mb-1 ml-1">Sort By</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-base-200/50 rounded-lg border border-base-300 text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer">
                  <option>Newest First</option>
                  <option>Oldest First</option>
                  <option>Fare (High to Low)</option>
                  <option>Distance</option>
                </select>
                <MdSwapVert className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/60" />
              </div>
            </div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 mt-4 md:mt-0">
            <MdDownload />
            Export CSV
          </button>
        </div>
      </section>

      <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden border border-base-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-base-200/50 border-b border-base-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Route (Pickup → Drop-off)</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Distance</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Duration</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Fare</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-base-content/60"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200/50">
              {trips.length > 0 ? (
                trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-base-content">
                        {new Date(trip.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {new Date(trip.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 max-w-[240px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-sm font-semibold truncate">{trip.pickupAddress.split(",")[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-error"></div>
                          <span className="text-sm font-semibold truncate">{trip.dropoffAddress.split(",")[0]}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-base">{trip.distanceKm ? `${trip.distanceKm.toFixed(1)} km` : "--"}</td>
                    <td className="px-6 py-5 text-base">{trip.durationMin ? `${Math.round(trip.durationMin)} min` : "--"}</td>
                    <td className="px-6 py-5 font-bold text-primary">
                      {trip.status === "COMPLETED" ? `PKR ${Math.round(trip.fare || 0)}` : "PKR 0.00"}
                    </td>
                    <td className="px-6 py-5">
                      {trip.status === "COMPLETED" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold">
                          Completed
                        </span>
                      ) : trip.status === "CANCELLED" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-error/10 text-error text-xs font-bold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-base-200 text-base-content/70 text-xs font-bold">
                          {trip.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/driver/ride/${trip.id}`} className="p-2 text-base-content/60 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                        <MdArrowForwardIos />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-base-content/60">
                    No trips found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-base-200/50 flex items-center justify-between border-t border-base-200">
          <span className="text-xs text-base-content/60">Showing {trips.length > 0 ? `1-${trips.length}` : "0"} of {trips.length} trips</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-base-100 border border-base-300 text-base-content/60 hover:bg-base-200 disabled:opacity-50" disabled>
              <MdChevronLeft />
            </button>
            <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-semibold">1</button>
            <button className="px-3 py-1 rounded-lg bg-base-100 border border-base-300 text-base-content text-sm font-semibold hover:bg-base-200">2</button>
            <button className="px-3 py-1 rounded-lg bg-base-100 border border-base-300 text-base-content text-sm font-semibold hover:bg-base-200">3</button>
            <button className="p-2 rounded-lg bg-base-100 border border-base-300 text-base-content/60 hover:bg-base-200">
              <MdChevronRight />
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-[0_20px_40px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-base-content/60 font-bold uppercase tracking-wider">Completion Rate</span>
            <MdTrendingUp className="text-success" />
          </div>
          <div className="text-3xl font-bold text-base-content">{completionRate}%</div>
          <div className="mt-2 text-xs text-success font-bold">+1.2% from last month</div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-[0_20px_40px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-base-content/60 font-bold uppercase tracking-wider">Total Distance</span>
            <MdRoute className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-base-content">{totalDistance.toLocaleString()} km</div>
          <div className="mt-2 text-xs text-base-content/60">Current period</div>
        </div>

        <div className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-[0_20px_40px_rgba(37,99,235,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-base-content/60 font-bold uppercase tracking-wider">Avg. Rating</span>
            <MdStar className="text-warning" />
          </div>
          <div className="text-3xl font-bold text-base-content">{avgRating}</div>
          <div className="mt-2 text-xs text-base-content/60">Based on {ratings.length} reviews</div>
        </div>
      </div>
    </div>
  );
}
