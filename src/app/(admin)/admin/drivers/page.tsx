import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MdLocalTaxi, MdRadioButtonChecked, MdStar, MdFilePresent, MdSettingsApplications, MdPersonAdd, MdSearch, MdVerified, MdVisibility, MdBlock } from "react-icons/md";

export default async function AdminDriversPage() {
  const drivers = await prisma.user.findMany({
    where: { role: "DRIVER" },
    include: {
      _count: {
        select: { ridesAsDriver: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const displayDrivers = drivers.map((d: any) => ({
    id: d.id,
    name: d.name,
    email: d.email,
    vehicle: d.vehicleMake ? `${d.vehicleMake} ${d.vehicleModel || ""}` : "No Vehicle",
    plate: d.vehiclePlate || "N/A",
    trips: d._count.ridesAsDriver,
    rating: 4.8, // Mock
    isOnline: d.isOnline,
    docStatus: "Verified" // Mock
  }));

  const stats = [
    { label: "Total Fleet", value: displayDrivers.length.toString(), icon: <MdLocalTaxi />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Online Now", value: displayDrivers.filter((d: any) => d.isOnline).length.toString(), icon: <MdRadioButtonChecked />, color: "text-success", bg: "bg-success/10" },
    { label: "Avg Rating", value: "4.8", icon: <MdStar />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Pending Docs", value: "3", icon: <MdFilePresent />, color: "text-error", bg: "bg-error/10" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">Driver Fleet</h2>
          <p className="text-secondary font-body-md mt-1">Monitor driver status, verify documents, and manage fleet performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdSettingsApplications className="text-lg" />
            Fleet Settings
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdPersonAdd className="text-lg" />
            Register Driver
          </button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s: any, i) => (
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

      {/* Driver List Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
              placeholder="Search drivers by name, vehicle or license..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs font-bold text-on-surface-variant outline-none">
              <option>Status: All Drivers</option>
              <option>Online Only</option>
              <option>Offline Only</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Vehicle Details</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Rating/Trips</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {displayDrivers.map((driver: any) => (
                <tr key={driver.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary font-black text-sm uppercase">
                        {driver.name?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{driver.name}</p>
                        <p className="text-[10px] text-outline font-medium">{driver.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface-variant">{driver.vehicle}</p>
                    <p className="text-[10px] text-outline font-mono uppercase tracking-wider">{driver.plate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-warning">
                        <MdStar className="text-[14px]" />
                        <span className="text-sm font-bold">{driver.rating}</span>
                      </div>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span className="text-sm text-outline">{driver.trips} trips</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${driver.isOnline ? 'bg-success animate-pulse' : 'bg-outline-variant'}`}></span>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                        {driver.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <MdVerified className="text-[18px]" />
                      </button>
                      <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <MdVisibility className="text-[18px]" />
                      </button>
                      <button className="p-2 text-outline hover:text-error transition-colors rounded-lg hover:bg-error/5">
                        <MdBlock className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">Total <span className="font-bold text-on-surface">{displayDrivers.length}</span> active fleet members</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-primary font-bold text-xs hover:bg-primary/5 rounded-lg transition-all">View All Drivers</button>
          </div>
        </div>
      </div>
    </div>
  );
}

