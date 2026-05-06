import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MdCalendarToday, MdDownload, MdPayments, MdRoute, MdLocalTaxi, MdGroup, MdArrowForward, MdVerifiedUser, MdMoreVert } from "react-icons/md";

export default async function AdminDashboardPage() {
  const { session } = await requireRole("ADMIN");
  const firstName = session.user.name.split(" ")[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    userCount,
    activeDrivers,
    ridesToday,
    revenueToday,
    recentRides,
    newUsers,
    pendingVerifications
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
      _sum: { fare: true }
    }),
    prisma.ride.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { passenger: true, driver: true }
    }),
    prisma.user.findMany({
      take: 4,
      where: { role: "USER" },
      orderBy: { createdAt: "desc" }
    }),
    prisma.user.count({ 
      where: { 
        role: "DRIVER", 
        emailVerified: false // Unverified drivers
      } 
    })
  ]);

  const stats = [
    { 
      label: "Today's Revenue", 
      value: `PKR ${Math.round(revenueToday._sum.fare || 0).toLocaleString()}`, 
      trend: "+12.5%", 
      icon: <MdPayments />, 
      color: "text-primary",
      bg: "bg-primary/10"
    },
    { 
      label: "Active Rides", 
      value: ridesToday.toString(), 
      trend: "+4.2%", 
      icon: <MdRoute />, 
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    { 
      label: "Online Drivers", 
      value: activeDrivers.toString(), 
      trend: "-2.1%", 
      icon: <MdLocalTaxi />, 
      color: "text-primary",
      bg: "bg-primary/5"
    },
    { 
      label: "Total Passengers", 
      value: userCount.toLocaleString(), 
      trend: "+18%", 
      icon: <MdGroup />, 
      color: "text-secondary",
      bg: "bg-secondary/5"
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">System Overview</h2>
          <p className="text-secondary font-body-md mt-1">Hello {firstName}, here's what's happening with TransportHub today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdCalendarToday className="text-[18px]" />
            Last 24 Hours
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdDownload className="text-[18px]" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <span className="text-[24px] flex items-center justify-center">{s.icon}</span>
              </div>
              <span className={`text-caption font-bold px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                {s.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-on-surface tracking-tight">{s.value}</h3>
            <p className="text-caption text-secondary font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Activity Log */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
            <h3 className="font-h3 text-lg text-on-surface">Recent Rides</h3>
            <Link href="/admin/rides" className="text-primary font-label-sm flex items-center gap-1 hover:underline">
              View All <MdArrowForward className="text-[14px]" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Passenger</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Route</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentRides.map((ride: any) => ( ride.passenger && (
                  <tr key={ride.id} className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {ride.passenger.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{ride.passenger.name}</p>
                          <p className="text-[10px] text-outline">#{ride.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-on-surface-variant truncate max-w-[200px]">
                        {ride.pickupAddress} → {ride.dropoffAddress}
                      </p>
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
                    <td className="px-6 py-4 font-bold text-on-surface">PKR {Math.round(ride.fare || 0)}</td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Notifications & New Users */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Alerts Card */}
          {pendingVerifications > 0 && (
            <div className="bg-error/5 border border-error/20 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-error/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-error text-white rounded-xl flex items-center justify-center shadow-lg shadow-error/20">
                  <MdVerifiedUser className="text-[24px]" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">Pending Approvals</h4>
                  <p className="text-xs text-secondary">{pendingVerifications} drivers waiting for verification</p>
                </div>
              </div>
              <Link href="/admin/drivers" className="w-full py-2 bg-error text-white text-xs font-bold rounded-lg hover:bg-error/90 transition-all text-center block">
                Review Now
              </Link>
            </div>
          )}

          {/* New Passengers */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm p-6">
            <h3 className="font-bold text-on-surface mb-6 flex items-center justify-between">
              New Passengers
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full">TODAY</span>
            </h3>
            <div className="space-y-4">
              {newUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary font-black">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.name}</p>
                      <p className="text-[10px] text-outline font-medium">{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <button className="p-2 text-outline hover:text-primary transition-colors">
                    <MdMoreVert className="text-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <Link href="/admin/users" className="w-full mt-6 py-3 border border-outline-variant text-secondary text-xs font-bold rounded-xl hover:bg-surface-container-low transition-all text-center block">
              Manage All Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

