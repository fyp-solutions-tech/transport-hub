import { requireRole } from "@/lib/session";
import Link from "next/link";
import {
  MdToggleOn,
  MdDirectionsCar,
  MdAttachMoney,
  MdStar,
  MdHistory,
  MdLocationOn,
  MdNotifications,
} from "react-icons/md";

const stats = [
  { label: "Today's Earnings", value: "৳0", icon: <MdAttachMoney className="text-success text-2xl" />, color: "bg-success/10" },
  { label: "Trips Today", value: "0", icon: <MdDirectionsCar className="text-primary text-2xl" />, color: "bg-primary/10" },
  { label: "Acceptance Rate", value: "—", icon: <MdStar className="text-warning text-2xl" />, color: "bg-warning/10" },
  { label: "Total Trips", value: "0", icon: <MdHistory className="text-info text-2xl" />, color: "bg-info/10" },
];

export default async function DriverDashboardPage() {
  const { session } = await requireRole("DRIVER");
  const firstName = session.user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {firstName} 🚗</h1>
          <p className="text-base-content/60 mt-1">Driver Dashboard</p>
        </div>
        {/* Availability Toggle */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body flex-row items-center gap-4 py-3 px-5">
            <div>
              <p className="font-semibold text-sm">Availability</p>
              <p className="text-xs text-base-content/50">Toggle to go online</p>
            </div>
            <input
              id="availability-toggle"
              type="checkbox"
              className="toggle toggle-success toggle-lg"
            />
          </div>
        </div>
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

      {/* Incoming requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Incoming Requests</h2>
          <span className="badge badge-ghost">0 pending</span>
        </div>

        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
              <MdNotifications className="text-3xl text-base-content/30" />
            </div>
            <p className="font-medium text-base-content/60">No ride requests yet</p>
            <p className="text-sm text-base-content/40 mt-1">
              Toggle availability to start receiving requests
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/driver/trips"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdHistory className="text-4xl text-primary mb-2" />
              <h3 className="card-title text-base">Trip History</h3>
              <p className="text-sm text-base-content/60">View past trips & earnings</p>
            </div>
          </Link>
          <Link
            href="/driver/vehicle"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdDirectionsCar className="text-4xl text-accent mb-2" />
              <h3 className="card-title text-base">My Vehicle</h3>
              <p className="text-sm text-base-content/60">Update vehicle info</p>
            </div>
          </Link>
          <Link
            href="/driver/profile"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdLocationOn className="text-4xl text-success mb-2" />
              <h3 className="card-title text-base">Profile</h3>
              <p className="text-sm text-base-content/60">Edit your driver profile</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
