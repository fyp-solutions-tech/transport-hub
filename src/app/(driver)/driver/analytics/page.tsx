import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MdErrorOutline, MdCalendarToday, MdDownload, MdTrendingUp, MdTrendingDown, MdPayments, MdDirectionsCar, MdSearch, MdFilterList, MdArrowForward } from "react-icons/md";

export default async function DriverEarningsPage() {
  let stats: any = null;
  let transactions: any[] = [];
  let error: string | null = null;

  try {
    const { session } = await requireRole("DRIVER");
    const driverId = session.user.id;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayRides = await prisma.Ride.findMany({
      where: { driverId, status: "COMPLETED", createdAt: { gte: today } },
      select: { fare: true, rating: true }
    });

    const weekRides = await prisma.Ride.findMany({
      where: { driverId, status: "COMPLETED", createdAt: { gte: weekStart } },
      select: { fare: true, rating: true, createdAt: true }
    });

    const monthRides = await prisma.Ride.findMany({
      where: { driverId, status: "COMPLETED", createdAt: { gte: monthStart } },
      select: { fare: true, rating: true }
    });

    const allRides = await prisma.Ride.findMany({
      where: { driverId, status: "COMPLETED" },
      select: { fare: true, rating: true }
    });

    transactions = await prisma.Ride.findMany({
      where: { driverId, status: { in: ["COMPLETED", "CANCELLED"] } },
      include: { passenger: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const todayEarnings = todayRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const weekEarnings = weekRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const monthEarnings = monthRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const totalEarnings = allRides.reduce((sum, r) => sum + (r.fare || 0), 0);
    const avgPerTrip = allRides.length > 0 ? (totalEarnings / allRides.length).toFixed(2) : "0.00";

    stats = {
      today: { amount: todayEarnings, trend: 12 },
      weekly: { amount: weekEarnings, trend: 5 },
      monthly: { amount: monthEarnings, trend: -2 },
      total: totalEarnings,
      avgPerTrip,
      totalTrips: allRides.length,
      targetTrips: 150,
    };
  } catch (err) {
    console.error("Error loading driver earnings:", err);
    error = "Failed to load earnings. Please try again later.";
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <MdErrorOutline className="text-error text-4xl" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-base-content">Oops! Something went wrong</h2>
          <p className="text-base-content/60">{error || "Failed to load earnings"}</p>
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
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Earnings</h1>
          <p className="text-base-content/60">Track your daily income and financial growth</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-base-100 border border-base-200 rounded-xl text-sm font-semibold text-base-content/60 hover:bg-base-200 transition-all">
            <MdCalendarToday className="text-[20px]" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
            <MdDownload className="text-[20px]" />
            Export PDF
          </button>
        </div>
      </header>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-base-100 p-6 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-base-200 flex flex-col gap-2">
          <p className="text-sm text-base-content/60 uppercase tracking-wider font-semibold">Today</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-base-content">PKR {stats.today.amount.toLocaleString()}</p>
            <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-lg flex items-center gap-1">
              <MdTrendingUp className="text-[14px]" />
              +{stats.today.trend}%
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-2">vs. PKR {Math.round(stats.today.amount / 1.12).toLocaleString()} yesterday</p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-base-200 flex flex-col gap-2">
          <p className="text-sm text-base-content/60 uppercase tracking-wider font-semibold">Weekly</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-base-content">PKR {stats.weekly.amount.toLocaleString()}</p>
            <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-lg flex items-center gap-1">
              <MdTrendingUp className="text-[14px]" />
              +{stats.weekly.trend}%
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-2">Week 42 (Oct 16 - 22)</p>
        </div>

        <div className="bg-base-100 p-6 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-base-200 flex flex-col gap-2">
          <p className="text-sm text-base-content/60 uppercase tracking-wider font-semibold">Monthly</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold text-base-content">PKR {stats.monthly.amount.toLocaleString()}</p>
            <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-lg flex items-center gap-1">
              <MdTrendingDown className="text-[14px]" />
              {stats.monthly.trend}%
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-2">Month of October</p>
        </div>

        <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 flex flex-col gap-2 text-white">
          <p className="text-sm text-blue-100 uppercase tracking-wider font-semibold">Total Earnings</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold">PKR {stats.total.toLocaleString()}</p>
          </div>
          <p className="text-xs text-blue-100 mt-2">Since March 2023</p>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-base-100 border border-base-200 rounded-xl p-6 flex items-center gap-6 shadow-[0_20px_40px_rgba(37,99,235,0.02)]">
          <div className="p-4 bg-primary/10 rounded-full">
            <MdPayments className="text-primary text-[32px]" />
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-semibold">Avg. Earning Per Trip</p>
            <p className="text-2xl font-bold text-base-content">PKR {stats.avgPerTrip}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="h-2 w-32 bg-base-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[75%]"></div>
            </div>
            <p className="text-xs text-base-content/60 mt-1">Above average (Top 10%)</p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 rounded-xl p-6 flex items-center gap-6 shadow-[0_20px_40px_rgba(37,99,235,0.02)]">
          <div className="p-4 bg-success/10 rounded-full">
            <MdDirectionsCar className="text-success text-[32px]" />
          </div>
          <div>
            <p className="text-sm text-base-content/60 font-semibold">Total Trips</p>
            <p className="text-2xl font-bold text-base-content">{stats.totalTrips}</p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <p className="text-sm font-semibold text-base-content">Goal: {stats.targetTrips}</p>
            <p className="text-xs text-success font-bold mt-1">
              {Math.round((stats.totalTrips / stats.targetTrips) * 100)}% of Monthly Target
            </p>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-base-100 rounded-xl border border-base-200 p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold">Weekly Trend</h3>
            <p className="text-base-content/60">Daily performance over the last 7 days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-xs text-base-content/60">Current Week</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-base-200"></span>
              <span className="text-xs text-base-content/60">Previous Week</span>
            </div>
          </div>
        </div>

        <div className="relative h-64 w-full flex items-end justify-between gap-4 pt-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-2 w-full">
              <div className="relative w-full h-48 flex items-end justify-center">
                <div className="w-12 bg-primary/10 rounded-t-lg h-[60%] transition-all hover:bg-primary/20"></div>
                <div className="absolute bottom-0 w-8 bg-primary rounded-t-lg h-[80%] z-10"></div>
              </div>
              <span className="text-xs text-base-content/60">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Earnings Table */}
      <div className="bg-base-100 rounded-xl border border-base-200 shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden">
        <div className="p-6 border-b border-base-200 flex justify-between items-center">
          <h3 className="text-lg font-bold">Recent Transactions</h3>
          <div className="flex gap-2">
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 text-[20px]" />
              <input className="pl-10 pr-4 py-2 bg-base-200 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 w-64" placeholder="Search trips..." type="text"/>
            </div>
            <button className="p-2 text-base-content/40 hover:text-base-content">
              <MdFilterList className="text-xl" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-base-200/50">
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Date</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Trip ID</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Route</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Fare</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Tip</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Status</th>
                <th className="px-6 py-4 text-sm text-base-content/60 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200/50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-base-200/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-base-content">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-primary">#TRP-{tx.id.slice(-4).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-base-content">{tx.pickupAddress.split(",")[0]}</span>
                      <MdArrowForward className="text-[14px] text-base-content/40" />
                      <span className="text-sm font-semibold text-base-content">{tx.dropoffAddress.split(",")[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-base-content">PKR {Math.round(tx.fare || 0)}</td>
                  <td className="px-6 py-4 text-sm text-success font-bold">—</td>
                  <td className="px-6 py-4">
                    {tx.status === "COMPLETED" ? (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-lg">Completed</span>
                    ) : (
                      <span className="px-2 py-1 bg-error/10 text-error text-xs font-bold rounded-lg">{tx.status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:underline text-sm font-bold">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-base-200 flex items-center justify-between">
          <p className="text-xs text-base-content/60">Showing 1-{transactions.length} of {transactions.length} transactions</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-base-200 rounded-lg text-xs font-bold text-base-content/60 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
