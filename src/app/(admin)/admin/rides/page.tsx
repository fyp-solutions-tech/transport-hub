import { MdRoute, MdSearch, MdLocationOn } from "react-icons/md";

const statusBadge: Record<string, string> = {
  completed: "badge-success",
  cancelled: "badge-error",
  ongoing: "badge-warning",
  pending: "badge-info",
};

const mockRides = [
  { id: "r88", date: "Apr 18, 2026", time: "11:30 AM", passenger: "Razia S.", driver: "Ahmed H.", from: "Mirpur 10", to: "Motijheel", fare: "৳95", status: "completed" },
  { id: "r87", date: "Apr 18, 2026", time: "10:15 AM", passenger: "Nadia R.", driver: "Rahim U.", from: "Banani", to: "Dhanmondi", fare: "৳60", status: "cancelled" },
  { id: "r86", date: "Apr 17, 2026", time: "7:45 PM", passenger: "Karim A.", driver: "Ahmed H.", from: "Uttara", to: "Gulshan 2", fare: "৳130", status: "completed" },
  { id: "r85", date: "Apr 17, 2026", time: "3:00 PM", passenger: "Habib U.", driver: "—", from: "Dhanmondi", to: "Airport", fare: "৳200", status: "pending" },
];

export default function AdminRidesPage() {
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
          <div className="stat-value text-xl">{mockRides.length}</div>
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
              {mockRides.map((ride) => (
                <tr key={ride.id} className="hover cursor-pointer">
                  <td className="font-mono text-xs text-base-content/60">#{ride.id}</td>
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
                        <p className="text-base-content/80">{ride.from}</p>
                        <p className="text-base-content/80">{ride.to}</p>
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
