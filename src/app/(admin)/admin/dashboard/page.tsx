import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  MdPeople,
  MdDirectionsCar,
  MdRoute,
  MdAttachMoney,
  MdTrendingUp,
  MdStar,
  MdWarning,
} from "react-icons/md";

export default async function AdminDashboardPage() {
  const { session } = await requireRole("ADMIN");
  const firstName = session.user.name.split(" ")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    userCount,
    activeDrivers,
    ridesToday,
    revenueData,
    recentRides,
    newUsers
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "DRIVER", isOnline: true } }),
    prisma.ride.count({ 
      where: { 
        status: "COMPLETED",
        createdAt: { gte: today }
      } 
    }),
    prisma.ride.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: today }
      },
      _sum: {
        fare: true
      }
    }),
    prisma.ride.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { passenger: true }
    }),
    prisma.user.findMany({
      take: 2,
      where: { role: "USER" },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const stats = [
    { 
      label: "Total Users", 
      value: userCount.toString(), 
      sub: "registered passengers", 
      icon: <MdPeople className="text-primary text-2xl" />, 
      color: "bg-primary/10" 
    },
    { 
      label: "Active Drivers", 
      value: activeDrivers.toString(), 
      sub: "online now", 
      icon: <MdDirectionsCar className="text-accent text-2xl" />, 
      color: "bg-accent/10" 
    },
    { 
      label: "Rides Today", 
      value: ridesToday.toString(), 
      sub: "completed", 
      icon: <MdRoute className="text-success text-2xl" />, 
      color: "bg-success/10" 
    },
    { 
      label: "Revenue Today", 
      value: `৳${(revenueData._sum.fare || 0).toLocaleString()}`, 
      sub: "platform earnings", 
      icon: <MdAttachMoney className="text-secondary text-2xl" />, 
      color: "bg-secondary/10" 
    },
  ];

  const recentActivity = [
    ...recentRides.map(r => ({
      text: `Ride #${r.id.slice(-4)} ${r.status.toLowerCase()} — ৳${r.fare || 0}`,
      time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dot: r.status === "COMPLETED" ? "bg-success" : r.status === "CANCELLED" ? "bg-error" : "bg-warning"
    })),
    ...newUsers.map(u => ({
      text: `New user signed up: ${u.name}`,
      time: "Joined today",
      dot: "bg-primary"
    }))
  ].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Control Panel</h1>
        <p className="text-base-content/60 mt-1">Welcome back, {firstName}. Here's today's overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="card-body p-5">
              <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-base-content/60">{s.label}</p>
              <p className="text-xs text-base-content/40">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart placeholder */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Revenue (Last 7 Days)</h2>
              <MdTrendingUp className="text-success text-xl" />
            </div>
            <div className="h-40 flex items-end gap-2">
              {[30, 55, 40, 70, 45, 80, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden"
                    style={{ height: `${h}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all"
                      style={{ height: "60%" }}
                    />
                  </div>
                  <span className="text-xs text-base-content/40">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent Activity</h2>
              <span className="badge badge-secondary badge-sm">Live</span>
            </div>
            <ul className="space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-base-content/80 truncate">{a.text}</p>
                    <p className="text-xs text-base-content/40">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card bg-warning/10 border border-warning/30">
        <div className="card-body flex-row items-center gap-4 py-4">
          <MdWarning className="text-warning text-2xl shrink-0" />
          <div>
            <p className="font-semibold text-sm">1 driver has pending document verification</p>
            <p className="text-xs text-base-content/60">
              Review in{" "}
              <a href="/admin/drivers" className="text-primary underline">
                Drivers
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Manage Platform</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: "/admin/users", label: "Users", icon: <MdPeople className="text-3xl text-primary" /> },
            { href: "/admin/drivers", label: "Drivers", icon: <MdDirectionsCar className="text-3xl text-accent" /> },
            { href: "/admin/rides", label: "All Rides", icon: <MdRoute className="text-3xl text-success" /> },
            { href: "/admin/settings", label: "Settings", icon: <MdStar className="text-3xl text-secondary" /> },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="card-body items-center text-center p-5">
                {l.icon}
                <p className="font-medium text-sm mt-2">{l.label}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
