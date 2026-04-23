import { MdRoute, MdSearch, MdLocationOn } from "react-icons/md";
import { prisma } from "@/lib/prisma";

export default async function AdminRidesPage() {
  const rides = await prisma.ride.findMany({
    include: {
      passenger: true,
      driver: true
    },
    orderBy: { createdAt: "desc" }
  });

  const displayRides = rides.map(r => ({
    id: r.id,
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(r.createdAt)),
    time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    passenger: r.passenger?.name || "Unknown",
    driver: r.driver?.name || "Searching...",
    from: r.pickupAddress,
    to: r.dropoffAddress,
    fare: `৳${r.fare || 0}`,
    status: r.status.toLowerCase()
  }));

  const statusBadge: Record<string, string> = {
    completed: "badge-success",
    cancelled: "badge-error",
    in_progress: "badge-warning",
    arriving: "badge-warning",
    accepted: "badge-info",
    searching: "badge-info",
    pending: "badge-ghost",
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Rides</h1>
          <p className="text-base-content/60 mt-1">Complete ride log across the platform</p>
        </div>
        <div className="stat bg-base-100 border border-base-200 rounded-xl py-3 px-5 shadow-sm">
          <div className="stat-figure text-success">
            <MdRoute className="text-2xl" />
          </div>
          <div className="stat-value text-xl">{displayRides.length}</div>
          <div className="stat-desc">Rides (last 2 days)</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <label className="input input-bordered flex items-center gap-2 flex-1 max-w-sm">
          <MdSearch className="text-base-content/50 text-lg" />
          <input id="rides-search" type="text" placeholder="Search by ID, passenger or driver" className="grow text-sm" />
        </label>
        <select id="rides-status-filter" className="select select-bordered text-sm">
          <option>All statuses</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Ongoing</option>
          <option>Pending</option>
        </select>
        <input
          id="rides-date-filter"
          type="date"
          className="input input-bordered text-sm"
        />
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Ride ID</th>
                <th>Date & Time</th>
                <th>Passenger</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayRides.map((ride) => (
                <tr key={ride.id} className="hover cursor-pointer">
                  <td className="font-mono text-xs text-base-content/60">#{ride.id.slice(-6)}</td>
                  <td>
                    <p className="text-sm">{ride.date}</p>
                    <p className="text-xs text-base-content/50">{ride.time}</p>
                  </td>
                  <td className="text-sm">{ride.passenger}</td>
                  <td className="text-sm">{ride.driver}</td>
                  <td>
                    <div className="flex items-start gap-1.5 text-xs">
                      <div className="flex flex-col items-center gap-0.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div className="w-px h-3 bg-base-300" />
                        <MdLocationOn className="text-error text-xs -m-0.5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base-content/80 line-clamp-1">{ride.from}</p>
                        <p className="text-base-content/80 line-clamp-1">{ride.to}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-sm">{ride.fare}</td>
                  <td>
                    <span className={`badge badge-sm ${statusBadge[ride.status]}`}>
                      {ride.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
