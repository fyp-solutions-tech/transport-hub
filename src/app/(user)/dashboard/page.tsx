import { requireRole } from "@/lib/session";
import Link from "next/link";
import {
  MdAddLocationAlt,
  MdDirectionsCar,
  MdHistory,
  MdPayment,
  MdStar,
  MdLocationOn,
} from "react-icons/md";

const stats = [
  { label: "Total Rides", value: "0", icon: <MdHistory className="text-primary text-2xl" />, color: "bg-primary/10" },
  { label: "Pending Payment", value: "৳0", icon: <MdPayment className="text-warning text-2xl" />, color: "bg-warning/10" },
  { label: "Avg Rating", value: "—", icon: <MdStar className="text-success text-2xl" />, color: "bg-success/10" },
  { label: "Saved Places", value: "0", icon: <MdLocationOn className="text-info text-2xl" />, color: "bg-info/10" },
];

export default async function UserDashboardPage() {
  const { session } = await requireRole("USER");
  const firstName = session.user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-base-content/60 mt-1">
            Ready for your next ride?
          </p>
        </div>
        <Link href="/book" className="btn btn-primary gap-2 shadow-md">
          <MdAddLocationAlt className="text-xl" />
          Book a Ride
        </Link>
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
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/book"
            className="card bg-primary text-primary-content shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdAddLocationAlt className="text-4xl mb-2" />
              <h3 className="card-title text-base">Book a Ride</h3>
              <p className="text-sm opacity-75">Select pickup & drop</p>
            </div>
          </Link>
          <Link
            href="/rides"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdHistory className="text-4xl text-secondary mb-2" />
              <h3 className="card-title text-base">Ride History</h3>
              <p className="text-sm text-base-content/60">View past rides</p>
            </div>
          </Link>
          <Link
            href="/payment"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdPayment className="text-4xl text-accent mb-2" />
              <h3 className="card-title text-base">Payments</h3>
              <p className="text-sm text-base-content/60">Manage methods</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent rides placeholder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Rides</h2>
          <Link href="/rides" className="btn btn-ghost btn-sm">
            View all
          </Link>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body items-center py-16 text-center">
            <MdDirectionsCar className="text-5xl text-base-content/20 mb-3" />
            <p className="font-medium text-base-content/60">No rides yet</p>
            <p className="text-sm text-base-content/40">
              Your ride history will appear here
            </p>
            <Link href="/book" className="btn btn-primary btn-sm mt-4">
              Book your first ride
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
