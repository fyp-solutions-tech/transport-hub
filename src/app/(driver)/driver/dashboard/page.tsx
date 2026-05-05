// src/app/(driver)/driver/dashboard/page.tsx
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardContent from "./DashboardContent";
import DriverMapPanel from "@/components/ui/driver/DriverMapPanel";
import {
  MdAttachMoney,
  MdCalendarMonth,
  MdRoute,
  MdStar,
  MdArrowForward,
  MdTrendingUp,
} from "react-icons/md";

export default async function DriverDashboardPage() {
  const { session } = await requireRole("DRIVER");
  const user = session.user;
  const firstName = user.name?.split(" ")[0] || "Driver";

  // ── Live stats (server-side) ──────────────────────────────
  let todayEarnings = 0;
  let weeklyEarnings = 0;
  let totalTrips = 0;
  let avgRating = 0;
  let recentHistory: any[] = [];

  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const all = await prisma.ride.findMany({
      where: { driverId: user.id },
      include: {
        passenger: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const completed = all.filter(r => r.status === "COMPLETED");
    totalTrips = completed.length;
    todayEarnings = completed
      .filter((r) => new Date(r.createdAt) >= todayStart)
      .reduce((s: number, r) => s + Number(r.fare ?? 0), 0);
    weeklyEarnings = completed
      .filter((r) => new Date(r.createdAt) >= weekStart)
      .reduce((s: number, r) => s + Number(r.fare ?? 0), 0);

    const rated = completed.filter((r) => r.rating != null);
    if (rated.length > 0) {
      avgRating = rated.reduce((s: number, r) => s + (r.rating ?? 0), 0) / rated.length;
    }

    // Recent 5 rides
    recentHistory = all.slice(0, 5).map(r => ({
      id: r.id,
      passenger: { 
        name: r.passenger?.name || "Passenger", 
        initials: (r.passenger?.name || "P").split(" ").map(n => n[0]).join("") 
      },
      time: r.createdAt.toISOString(),
      date: r.createdAt.toISOString(),
      destination: r.dropoffAddress,
      amount: `PKR ${Math.round(Number(r.fare) || 0).toLocaleString()}`,
      status: r.status
    }));

  } catch (err) {
    console.error("Failed to fetch driver stats:", err);
  }

  const fmt = (n: number) =>
    `PKR ${Math.round(n).toLocaleString("en-US")}`;

  const statCards = [
    {
      label: "Today's Earnings",
      value: fmt(todayEarnings),
      trend: "Today",
      trendColor: "text-primary",
      iconBg: "bg-primary/10",
      icon: <MdAttachMoney className="text-primary text-xl" />,
    },
    {
      label: "Weekly Earnings",
      value: fmt(weeklyEarnings),
      trend: "This week",
      trendColor: "text-accent",
      iconBg: "bg-accent/10",
      icon: <MdCalendarMonth className="text-accent text-xl" />,
    },
    {
      label: "Total Trips",
      value: totalTrips.toString(),
      trend: "Completed",
      trendColor: "text-success",
      iconBg: "bg-warning/10",
      icon: <MdRoute className="text-warning text-xl" />,
    },
    {
      label: "Driver Rating",
      value: avgRating > 0 ? avgRating.toFixed(2) : "—",
      trend: avgRating >= 4.8 ? "Top Driver ✦" : avgRating > 0 ? "Good Standing" : "No ratings yet",
      trendColor: avgRating >= 4.8 ? "text-success font-bold" : "text-base-content/40",
      iconBg: "bg-success/10",
      icon: <MdStar className="text-success text-xl" />,
      badge: avgRating >= 4.8 ? "Top Driver" : null,
    },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-base-content/50 mt-1 text-sm">
            Here's your live driver overview for today.
          </p>
        </div>
      </div>

      {/* ── Live Bento Row: Map + DashboardContent ─────────── */}
      <div className="grid grid-cols-12 gap-6">

        {/* Left: Map Panel */}
        <div className="col-span-12 xl:col-span-8 rounded-2xl overflow-hidden bg-base-100 border border-base-200 shadow-[0_8px_30px_rgba(37,99,235,0.06)]" style={{ height: 500 }}>
          <DriverMapPanel />
        </div>

        {/* Right: Live Controls (DashboardContent stripped down) */}
        <div className="col-span-12 xl:col-span-4">
          <DashboardContent initialName={firstName} />
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, trend, trendColor, iconBg, icon, badge }) => (
          <div
            key={label}
            className="bg-base-100 rounded-2xl border border-base-200 shadow-[0_8px_30px_rgba(37,99,235,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                {icon}
              </div>
              {badge && (
                <span className="badge badge-primary badge-sm font-bold">{badge}</span>
              )}
            </div>
            <p className="text-base-content/50 text-sm font-medium mb-1">{label}</p>
            <p className="text-2xl font-black text-base-content">{value}</p>
            <p className={`text-xs mt-2 flex items-center gap-1 ${trendColor}`}>
              <MdTrendingUp className="text-sm" />
              {trend}
            </p>
          </div>
        ))}
      </div>

      {/* ── Recent Ride History (placeholder) ───────────────── */}
      <div className="bg-base-100 rounded-2xl border border-base-200 shadow-[0_8px_30px_rgba(37,99,235,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-base-200 flex justify-between items-center">
          <h3 className="font-bold text-base-content">Recent Ride History</h3>
          <Link
            href="/driver/trips"
            className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
          >
            View All <MdArrowForward />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-base-200/60">
                {["Passenger", "Time", "Destination", "Amount", "Status"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-xs font-black text-base-content/40 uppercase tracking-widest ${i === 3 ? "text-right" : i === 4 ? "text-center" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {recentHistory.length > 0 ? (
                recentHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-base-200/40 transition-colors">
                    {/* Passenger */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">{row.passenger.initials}</span>
                        </div>
                        <span className="font-bold text-sm text-base-content">{row.passenger.name}</span>
                      </div>
                    </td>
                    {/* Time */}
                    <td className="px-6 py-4 text-sm text-base-content/50">
                      <div>{row.time}</div>
                      <div className="text-[10px]">{row.date}</div>
                    </td>
                    {/* Destination */}
                    <td className="px-6 py-4 text-sm font-medium text-base-content/70 max-w-[180px] truncate">
                      {row.destination}
                    </td>
                    {/* Amount */}
                    <td className="px-6 py-4 text-sm font-black text-base-content text-right">
                      {row.amount}
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          row.status === "COMPLETED"
                            ? "bg-success/10 text-success"
                            : row.status === "CANCELLED"
                            ? "bg-error/10 text-error"
                            : "bg-base-300 text-base-content/50"
                        }`}
                      >
                        {row.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-base-content/30 italic">
                    No ride history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-base-200/40 border-t border-base-200 text-center">
          <Link
            href="/driver/trips"
            className="text-sm font-bold text-base-content/40 hover:text-primary transition-colors"
          >
            {recentHistory.length > 0 ? "Load more history →" : "View Trip History"}
          </Link>
        </div>
      </div>

    </div>
  );
}