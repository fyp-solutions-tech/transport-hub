import { MdDirectionsCar, MdAttachMoney, MdLocationOn, MdStar } from "react-icons/md";

const statusBadge: Record<string, string> = {
  completed: "badge-success",
  cancelled: "badge-error",
};

const mockTrips = [
  {
    id: "t1",
    date: "Apr 18, 2026",
    time: "10:30 AM",
    passenger: "Razia S.",
    from: "Mirpur 10",
    to: "Motijheel",
    fare: "৳95",
    earning: "৳80",
    status: "completed",
    rating: 5,
  },
  {
    id: "t2",
    date: "Apr 17, 2026",
    time: "3:15 PM",
    passenger: "Karim A.",
    from: "Dhanmondi",
    to: "Uttara",
    fare: "৳140",
    earning: "৳118",
    status: "completed",
    rating: 4,
  },
  {
    id: "t3",
    date: "Apr 16, 2026",
    time: "8:00 AM",
    passenger: "Nadia R.",
    from: "Banani",
    to: "Old Dhaka",
    fare: "৳60",
    earning: "—",
    status: "cancelled",
    rating: null,
  },
];

const summaryCards = [
  { label: "Total Earnings", value: "৳198", color: "text-success" },
  { label: "This Month", value: "৳198", color: "text-primary" },
  { label: "Completed Trips", value: "2", color: "text-info" },
];

export default function DriverTripsPage() {
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
        {["All", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            id={`trip-filter-${f.toLowerCase()}`}
            className={`btn btn-sm rounded-full ${f === "All" ? "btn-accent" : "btn-ghost border border-base-200"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trips list */}
      <div className="space-y-4">
        {mockTrips.map((trip) => (
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
                    <p className="font-semibold text-sm">{trip.passenger}</p>
                    <p className="text-xs text-base-content/50">
                      {trip.date} · {trip.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <MdAttachMoney className="text-success text-sm" />
                    <p className="font-bold text-success">{trip.earning}</p>
                  </div>
                  <span className={`badge badge-sm ${statusBadge[trip.status]}`}>
                    {trip.status}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="w-0.5 h-4 bg-base-300" />
                  <MdLocationOn className="text-error text-base -m-0.5" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <p className="text-base-content/80">{trip.from}</p>
                  <p className="text-base-content/80">{trip.to}</p>
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
        ))}
      </div>
    </div>
  );
}
