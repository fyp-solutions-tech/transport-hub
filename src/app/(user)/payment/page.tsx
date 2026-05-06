import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  MdAccountBalanceWallet,
  MdShoppingCart,
  MdHistory,
  MdTrendingUp,
  MdAdd,
  MdPayments,
  MdCalendarMonth,
  MdCreditCard,
  MdWallet,
  MdFlight,
  MdDirectionsCar,
  MdTrain,
  MdClose,
  MdAddCard,
} from "react-icons/md";

export const metadata = { title: "Payments & Wallet | Skyline Hub" };

export default async function PaymentPage() {
  const { session } = await requireRole("USER");

  let rides: any[] = [];
  let totalSpent = 0;
  let balance = 0;
  let recentActivity = { amount: 0, label: "No recent activity" };

  try {
    const [ridesData, wallet] = await Promise.all([
      prisma.ride.findMany({
        where: { passengerId: session.user.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fare: true,
          paymentMethod: true,
          status: true,
          createdAt: true,
          pickupAddress: true,
          dropoffAddress: true,
        },
      }),
      prisma.wallet.findUnique({
        where: { userId: session.user.id }
      })
    ]);

    rides = ridesData;
    balance = Number(wallet?.balance || 0);
    totalSpent = rides.reduce((s: number, r: any) => s + Number(r.fare ?? 0), 0);

    if (rides.length > 0) {
      const latest = rides[0];
      recentActivity = {
        amount: Math.round(Number(latest.fare ?? 0)),
        label: `${latest.pickupAddress.split(",")[0]} → ${latest.dropoffAddress.split(",")[0]} • Recent`,
      };
    }
  } catch (err: any) {
    console.error("Payment page error:", err);
  }

  const fmt = (n: number) => `PKR ${Math.round(n).toLocaleString()}`;

  const paymentMethods = [
    { id: "cash", label: "Cash on Delivery", sub: "Pay after arrival", icon: MdPayments, featured: false },
    { id: "loan", label: "Skyline Flex Loan", sub: "Buy Now, Pay Later", icon: MdCalendarMonth, featured: true },
    { id: "card", label: "Debit/Credit Card", sub: "Visa •••• 4242", icon: MdCreditCard, featured: false },
    { id: "wallet", label: "Skyline Wallet", sub: "Balance Auto-deduct", icon: MdWallet, featured: false },
  ];

  const txIcons: Record<string, any> = { flight: MdFlight, car: MdDirectionsCar, train: MdTrain, cancelled: MdClose };

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PENDING: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Wallet Overview Cards ─────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="rounded-xl p-6 border border-slate-50 bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-[0_20px_40px_rgba(37,99,235,0.15)] hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-blue-100 font-medium text-sm">Current balance</span>
            <MdAccountBalanceWallet className="text-blue-200 text-2xl" />
          </div>
          <div className="text-4xl font-bold mb-2">{fmt(balance)}</div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <MdTrendingUp className="text-sm" />
            <span>Secured by SkylinePay</span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-xl p-6 border border-slate-50 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-medium text-sm">Total spent</span>
            <MdShoppingCart className="text-slate-400 text-2xl" />
          </div>
          <div className="text-4xl font-bold text-[#111c2d] mb-2">{fmt(totalSpent)}</div>
          <p className="text-sm text-slate-500">Across {rides.length} completed rides</p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-slate-50 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-medium text-sm">Recent Activity</span>
            <MdHistory className="text-slate-400 text-2xl" />
          </div>
          <div className="text-[24px] font-bold text-[#111c2d] mb-2">
            {recentActivity.amount > 0 ? `-${fmt(recentActivity.amount)}` : "—"}
          </div>
          <p className="text-sm text-slate-500 truncate">{recentActivity.label}</p>
        </div>
      </section>

      {/* ── Payment Methods ───────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[32px] font-semibold leading-[1.3] text-[#111c2d]">Payment Methods</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            <MdAdd className="text-lg" />
            Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {paymentMethods.map(({ id, label, sub, icon: Icon, featured }) => (
            <div
              key={id}
              className={`relative rounded-xl p-5 border flex flex-col gap-4 cursor-pointer overflow-hidden transition-all hover:-translate-y-0.5 ${
                featured
                  ? "border-2 border-blue-600 bg-blue-50 shadow-[0_20px_40px_rgba(37,99,235,0.08)]"
                  : "border-slate-100 bg-white shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:border-blue-200"
              }`}
            >
              {featured && (
                <div className="absolute -right-6 -top-2 bg-blue-600 text-white text-[10px] font-bold py-1 px-8 rotate-45">
                  RECOMMENDED
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${featured ? "bg-blue-600" : "bg-slate-50"}`}>
                <Icon className={`text-xl ${featured ? "text-white" : "text-slate-400"}`} />
              </div>
              <div>
                <p className={`font-bold ${featured ? "text-blue-700" : "text-[#111c2d]"}`}>{label}</p>
                <p className={`text-sm ${featured ? "text-blue-600/70" : "text-slate-500"}`}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Transaction History ───────────────────── */}
      <section className="space-y-6">
        <h2 className="text-[32px] font-semibold leading-[1.3] text-[#111c2d]">Transaction History</h2>
        <div className="bg-white rounded-xl border border-slate-100 shadow-[0_20px_40px_rgba(37,99,235,0.05)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {["Date", "Ride Details", "Method", "Amount", "Status"].map((h: any) => (
                  <th key={h} className="px-6 py-4 text-[14px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">    
              {rides.length > 0 ? rides.slice(0, 10).map((ride: any) => (
                <tr key={ride.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-[#111c2d]">
                    {new Date(ride.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <MdDirectionsCar className="text-blue-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium">
                        {ride.pickupAddress.split(",")[0]} → {ride.dropoffAddress.split(",")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                    {ride.paymentMethod || "cash"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{fmt(ride.fare ?? 0)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusColors[ride.status] || "bg-slate-100 text-slate-600"}`}>
                      {ride.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="p-4 bg-white border-t border-slate-100 flex justify-center">
            <Link href="/rides" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
              View All Rides →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banners ─────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-48 rounded-2xl overflow-hidden group bg-linear-to-r from-blue-900 to-blue-700">
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h3 className="text-white text-xl font-bold mb-2">Safe &amp; Encrypted</h3>
            <p className="text-blue-100 text-sm max-w-xs">Your financial data is protected by bank-grade 256-bit SSL encryption at all times.</p>
          </div>
        </div>
        <div className="relative h-48 rounded-2xl overflow-hidden group bg-linear-to-r from-slate-800 to-slate-700">
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <h3 className="text-white text-xl font-bold mb-2">Travel Rewards</h3>
            <p className="text-slate-100 text-sm max-w-xs">Earn 5% back in Skyline credits for every ride paid with your linked card.</p>
          </div>
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all">
          <MdAddCard className="text-2xl" />
        </button>
      </div>
    </div>
  );
}
