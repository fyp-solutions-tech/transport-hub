import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MdDirectionsCar, MdAttachMoney, MdLocationOn, MdStar } from "react-icons/md";

const statusBadge: Record<string, string> = {
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
  ACCEPTED: "badge-info",
  IN_PROGRESS: "badge-warning",
};

interface TripsPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function DriverTripsPage({ searchParams }: TripsPageProps) {
  const { session } = await requireRole("DRIVER");
  const driverId = session.user.id;
  
  const resolvedParams = await searchParams;
  const currentFilter = resolvedParams.status || "ALL";

  // Fetch summary stats
  const allCompletedRides = await prisma.ride.findMany({
    where: { driverId, status: "COMPLETED" },
    select: { fare: true, createdAt: true },
  });

  const totalEarnings = allCompletedRides.reduce((sum, r) => sum + (r.fare || 0), 0);
  const thisMonthEarnings = allCompletedRides
    .filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + (r.fare || 0), 0);
  const completedCount = allCompletedRides.length;

  const summaryCards = [
    { label: "Total Earnings", value: `৳${totalEarnings}`, color: "text-success" },
    { label: "This Month", value: `৳${thisMonthEarnings}`, color: "text-primary" },
    { label: "Completed Trips", value: completedCount.toString(), color: "text-info" },
  ];

  // Fetch actual filtered trips
  const where: any = { driverId };
  if (currentFilter !== "ALL") {
    where.status = currentFilter;
  }

  const trips = await prisma.ride.findMany({
    where,
    include: {
      passenger: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Trips</h1>
        <p className="text-base-content/60 mt-1">Trip history and earnings overview</p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((c) => (
          <div key={c.label} className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-4 text-center">
              <p className={`text-xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-base-content/60">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "COMPLETED", "CANCELLED", "ACCEPTED"].map((f) => (
          <Link
            key={f}
            href={`/driver/trips?status=${f}`}
            className={`btn btn-sm rounded-full ${currentFilter === f ? "btn-accent" : "btn-ghost border border-base-200"}`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      {/* Trips list */}
      <div className="space-y-4">
        {trips.length === 0 ? (
          <div className="card bg-base-100 border border-base-300 p-12 text-center text-base-content/50">
             No trips found for this filter.
          </div>
        ) : (
          trips.map((trip) => (
            <div
              key={trip.id}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="card-body p-5 gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <MdDirectionsCar className="text-accent text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{trip.passenger.name}</p>
                      <p className="text-xs text-base-content/50">
                        {new Date(trip.createdAt).toLocaleDateString()} · {new Date(trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <MdAttachMoney className="text-success text-sm" />
                      <p className="font-bold text-success">৳{trip.fare || 0}</p>
                    </div>
                    <span className={`badge badge-sm ${statusBadge[trip.status] || "badge-ghost"}`}>
                      {trip.status.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <div className="flex flex-col items-center gap-0.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div className="w-0.5 h-4 bg-base-300" />
                    <MdLocationOn className="text-error text-base -m-0.5" />
                  </div>
                  <div className="flex-1 space-y-1.5 pt-0.5">
                    <p className="text-base-content/80 truncate leading-tight" title={trip.pickupAddress}>{trip.pickupAddress}</p>
                    <p className="text-base-content/80 truncate leading-tight" title={trip.dropoffAddress}>{trip.dropoffAddress}</p>
                  </div>
                  {trip.rating && (
                    <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                      <MdStar className="text-warning" />
                      <span>{trip.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
