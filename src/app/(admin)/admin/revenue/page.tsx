import { prisma } from "@/lib/prisma";
import { MdAccountBalanceWallet, MdTrendingUp, MdPendingActions, MdConfirmationNumber, MdDownload, MdPayments, MdFilterAlt, MdCheckCircle, MdAccountBalance, MdVerified, MdWallet } from "react-icons/md";

export default async function AdminRevenuePage() {
  const completedRides = await prisma.ride.findMany({
    where: { status: "COMPLETED" },
    select: { fare: true, createdAt: true }
  });

  const totalRevenue = completedRides.reduce((acc: number, r: any) => acc + (Number(r.fare) || 0), 0);
  const platformFee = totalRevenue * 0.15; // Assume 15%

  const stats = [
    { label: "Gross Volume", value: `PKR ${totalRevenue.toLocaleString()}`, icon: <MdAccountBalanceWallet />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Platform Earnings", value: `PKR ${platformFee.toLocaleString()}`, icon: <MdTrendingUp />, color: "text-success", bg: "bg-success/10" },
    { label: "Payouts Pending", value: "PKR 12,450", icon: <MdPendingActions />, color: "text-warning", bg: "bg-warning/10" },
    { label: "Avg Ticket", value: `PKR ${Math.round(totalRevenue / (completedRides.length || 1))}`, icon: <MdConfirmationNumber />, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">Revenue Intelligence</h2>
          <p className="text-secondary font-body-md mt-1">Track platform earnings, driver payouts, and financial growth metrics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdDownload className="text-lg" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdPayments className="text-lg" />
            Process Payouts
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
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

      {/* Main Content: Financial Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
            <h3 className="font-label-sm text-lg text-on-surface">Recent Transactions</h3>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-surface rounded-lg transition-colors text-outline">
                 <MdFilterAlt className="text-lg" />
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Transaction</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {completedRides.slice(0, 10).map((ride: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">Ride Commission</p>
                      <p className="text-[10px] text-outline font-medium">{new Date(ride.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">Revenue</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-on-surface">PKR {Math.round((ride.fare || 0) * 0.15)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-success">
                        <MdCheckCircle className="text-sm" />
                        <span className="text-xs font-bold uppercase tracking-wide">Settled</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-secondary text-white rounded-3xl p-8 shadow-xl shadow-secondary/20">
            <h3 className="text-lg font-black tracking-tight">Earnings Goal</h3>
            <p className="text-white/60 text-caption mt-1">Weekly platform target</p>
            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-black">74%</span>
                <span className="text-xs font-bold text-white/60">PKR 100k Target</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>
            <p className="mt-6 text-xs text-white/80 font-medium">You are ahead of schedule this week! Keep it up.</p>
          </div>

          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
            <h3 className="font-label-sm text-lg text-on-surface mb-6">Payout Methods</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-outline-variant/20">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <MdAccountBalance className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">Bank Transfer</p>
                  <p className="text-[10px] text-outline font-bold">DEFAULT</p>
                </div>
                <MdVerified className="text-success" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-2xl border border-outline-variant/10 opacity-60">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-outline shadow-sm">
                  <MdWallet className="text-[20px]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">EasyPaisa</p>
                  <p className="text-[10px] text-outline font-bold">NOT CONNECTED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
