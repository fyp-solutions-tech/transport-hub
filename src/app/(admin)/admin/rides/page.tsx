import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MdRoute, MdMotionPhotosOn, MdCheckCircle, MdCancel, MdMap, MdAddTask, MdSearch, MdPerson, MdLocalTaxi, MdChevronRight } from "react-icons/md";

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
    fare: `PKR ${Math.round(r.fare || 0)}`,
    status: r.status
  }));

  const stats = [
    { label: "Total Rides", value: displayRides.length.toString(), icon: <MdRoute />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Ongoing", value: displayRides.filter(r => r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED').length.toString(), icon: <MdMotionPhotosOn />, color: "text-success", bg: "bg-success/10" },
    { label: "Completed", value: displayRides.filter(r => r.status === 'COMPLETED').length.toString(), icon: <MdCheckCircle />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Cancelled", value: displayRides.filter(r => r.status === 'CANCELLED').length.toString(), icon: <MdCancel />, color: "text-error", bg: "bg-error/10" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">Operations Hub</h2>
          <p className="text-secondary font-body-md mt-1">Live tracking and historical record of all trip activity on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdMap className="text-lg" />
            Live View
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdAddTask className="text-lg" />
            Manual Booking
          </button>
        </div>
      </div>

      {/* Ride Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                <span className="text-xl flex items-center justify-center">{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-on-surface leading-tight">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ride Log Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
              placeholder="Search by Ride ID, Passenger or Driver..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <input type="date" className="bg-surface-container-low border-none rounded-xl py-2 px-4 text-xs font-bold text-on-surface-variant outline-none" />
            <select className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs font-bold text-on-surface-variant outline-none">
              <option>Status: All Rides</option>
              <option>Completed</option>
              <option>Ongoing</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Ride Info</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Passenger/Driver</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Route</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Fare</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {displayRides.map((ride) => (
                <tr key={ride.id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface">#{ride.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] text-outline font-medium">{ride.date} • {ride.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-[14px] text-primary" />
                        <span className="text-xs font-bold text-on-surface-variant">{ride.passenger}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdLocalTaxi className="text-[14px] text-secondary" />
                        <span className="text-xs font-medium text-outline">{ride.driver}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <p className="text-[10px] font-bold text-on-surface-variant truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        {ride.from}
                      </p>
                      <p className="text-[10px] font-bold text-on-surface-variant truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                        {ride.to}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-on-surface">{ride.fare}</p>
                    <p className="text-[10px] text-outline font-bold">CASH</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ride.status === "COMPLETED" ? "bg-success/10 text-success" :
                      ride.status === "CANCELLED" ? "bg-error/10 text-error" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                      <MdChevronRight className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">Operations log contains <span className="font-bold text-on-surface">{displayRides.length}</span> historical entries</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-primary font-bold text-xs hover:bg-primary/5 rounded-lg transition-all">Download Audit Log</button>
          </div>
        </div>
      </div>
    </div>
  );
}

