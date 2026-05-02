"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MdDirectionsCar,
  MdStar,
  MdHistory,
  MdAdd,
  MdTrendingUp,
  MdPayments,
} from "react-icons/md";

interface Ride {
  id: string;
  fare: number | null;
  rating: number | null;
  status: string;
  vehicleType: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  createdAt: string | Date;
}

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  SEARCHING: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  ARRIVING: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
};

export function RidesContent({ rides }: { rides: Ride[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredRides = useMemo(() => {
    if (filter === "ALL") return rides;
    if (filter === "COMPLETED") return rides.filter((r) => r.status === "COMPLETED");
    if (filter === "CANCELLED") return rides.filter((r) => r.status === "CANCELLED");
    return rides.filter((r) => !["COMPLETED", "CANCELLED"].includes(r.status));
  }, [rides, filter]);

  const totalSpent = rides.filter((r) => r.status === "COMPLETED").reduce((s, r) => s + (r.fare ?? 0), 0);
  const avgRating = (() => {
    const rated = rides.filter((r) => r.rating != null);
    return rated.length > 0
      ? (rated.reduce((s, r) => s + r.rating!, 0) / rated.length).toFixed(2)
      : "—";
  })();

  const filterButtons = ["ALL", "COMPLETED", "ONGOING", "CANCELLED"];

  return (
    <div className="space-y-8 pb-12">

      {/* ── Filter Bar ───────────────────────────── */}
      <section className="bg-white rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-6 border border-slate-50">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-[14px] font-semibold text-[#434655] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Status
            </label>
            <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1">
              {filterButtons.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    filter === f
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-[14px] font-semibold text-[#434655] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              Date Range
            </label>
            <select className="border-slate-100 rounded-lg bg-slate-50 text-[16px] py-2.5 px-4 focus:ring-2 focus:ring-blue-600 outline-none">
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="ml-auto flex items-end">
            <Link href="/book" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold text-[16px] hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20">
              <MdAdd className="text-xl" /> Book New Ride
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rides Table ──────────────────────────── */}
      <section className="bg-white rounded-xl shadow-[0_40px_60px_rgba(37,99,235,0.03)] overflow-hidden border border-slate-50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[14px] text-slate-500 font-bold uppercase tracking-wider">Ride Route</th>
              <th className="px-6 py-4 text-[14px] text-slate-500 font-bold uppercase tracking-wider">Date &amp; Time</th>
              <th className="px-6 py-4 text-[14px] text-slate-500 font-bold uppercase tracking-wider">Fare</th>
              <th className="px-6 py-4 text-[14px] text-slate-500 font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[14px] text-slate-500 font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRides.length > 0 ? filteredRides.map((ride) => (
              <tr key={ride.id} className="hover:bg-slate-50/50 transition-all group">
                {/* Route */}
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-[16px] font-bold text-[#111c2d]">{ride.pickupAddress.split(",")[0]}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 ml-1" />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#d0e1fb] border border-[#505f76]" />
                      <span className="text-[16px] font-medium text-[#434655]">{ride.dropoffAddress.split(",")[0]}</span>
                    </div>
                  </div>
                </td>
                {/* Date */}
                <td className="px-6 py-6">
                  <p className="text-[16px] font-semibold text-[#111c2d]">
                    {new Date(ride.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {new Date(ride.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </td>
                {/* Fare */}
                <td className="px-6 py-6">
                  <p className="text-[16px] font-bold text-[#111c2d]">PKR {Math.round(ride.fare ?? 0).toLocaleString()}</p>
                  <p className="text-[12px] text-slate-400">{ride.vehicleType}</p>
                </td>
                {/* Status */}
                <td className="px-6 py-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColors[ride.status] || "bg-slate-100 text-slate-600"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${ride.status === "COMPLETED" ? "bg-green-500" : ride.status === "CANCELLED" ? "bg-red-500" : "bg-blue-500 animate-pulse"}`} />
                    {ride.status.charAt(0) + ride.status.slice(1).toLowerCase().replace("_", " ")}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-6 py-6 text-right space-x-2">
                  <Link href={`/rides/${ride.id}`} className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    View Details
                  </Link>
                  <Link href="/book" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-95 transition-all">
                    Book Again
                  </Link>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <MdHistory className="text-5xl text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No rides found</p>
                  <button onClick={() => setFilter("ALL")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Clear Filters</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="bg-white px-6 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[12px] text-slate-500">Showing {filteredRides.length} of {rides.length} rides</p>
        </div>
      </section>

      {/* ── Stats Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h4 className="text-[14px] uppercase tracking-wider opacity-80 mb-2">Total Spent</h4>
            <p className="text-[32px] font-semibold">PKR {Math.round(totalSpent).toLocaleString()}</p>
            <p className="text-[12px] mt-4 flex items-center gap-1 opacity-80">
              <MdTrendingUp className="text-xs" />
              Across all completed rides
            </p>
          </div>
          <MdPayments className="absolute -right-4 -bottom-4 text-[150px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <MdStar className="text-xl" />
          </div>
          <div>
            <h4 className="text-[14px] text-slate-500">Average Rating</h4>
            <p className="text-[24px] font-semibold text-[#111c2d]">{avgRating}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <MdDirectionsCar className="text-xl" />
          </div>
          <div>
            <h4 className="text-[14px] text-slate-500">Total Rides</h4>
            <p className="text-[24px] font-semibold text-[#111c2d]">{rides.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
