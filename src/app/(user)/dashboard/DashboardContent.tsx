"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  MdAddLocationAlt,
  MdDirectionsCar,
  MdHistory,
  MdPayment,
  MdStar,
  MdLocationOn,
} from "react-icons/md";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";
import { useProfileStore } from "@/store/useProfileStore";

interface Ride {
  id: string;
  fare: number | null;
  rating: number | null;
  status: string;
  vehicleType: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  createdAt: Date | string;
}

interface DashboardContentProps {
  firstName: string;
  initialRides: Ride[];
}

export function DashboardContent({ firstName, initialRides }: DashboardContentProps) {
  const { activeRideId, status: activeStatus } = useRideTrackingStore();
  const { activeLoan } = usePaymentStore();
  const { savedPlaces } = useProfileStore();

  const totalRides = initialRides.length;
  
  const avgRating = useMemo(() => {
    const ratings = initialRides.filter((r) => r.rating != null).map((r) => r.rating!);
    return ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
      : "—";
  }, [initialRides]);

  const stats = [
    {
      label: "Total Rides",
      value: String(totalRides),
      icon: <MdHistory className="text-primary text-2xl" />,
      color: "bg-primary/10",
    },
    {
      label: "Pending Loan",
      value: `Rs ${activeLoan.toLocaleString()}`,
      icon: <MdPayment className="text-warning text-2xl" />,
      color: "bg-warning/10",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: <MdStar className="text-success text-2xl" />,
      color: "bg-success/10",
    },
    {
      label: "Saved Places",
      value: String(savedPlaces.length),
      icon: <MdLocationOn className="text-info text-2xl" />,
      color: "bg-info/10",
    },
  ];

  const statusBadge: Record<string, string> = {
    COMPLETED: "badge-success",
    CANCELLED: "badge-error",
    PENDING: "badge-warning",
    SEARCHING: "badge-info",
    ACCEPTED: "badge-info",
    ARRIVING: "badge-info",
    IN_PROGRESS: "badge-primary",
  };

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

      {/* Active Ride Banner */}
      {activeRideId && activeStatus !== 'IDLE' && activeStatus !== 'COMPLETED' && activeStatus !== 'CANCELLED' && (
        <div className="alert alert-primary shadow-lg flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              Active Ride in Progress
            </h3>
            <div className="text-xs opacity-70">Current status: {activeStatus.replace('_', ' ')}</div>
          </div>
          <Link href={`/rides/${activeRideId}`} className="btn btn-sm btn-ghost bg-white/10 hover:bg-white/20">
            Track Now
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="card-body p-5">
              <div
                className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-3`}
              >
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
              <p className="text-sm opacity-75">Select pickup &amp; drop</p>
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

      {/* Recent Rides */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Rides</h2>
          <Link href="/rides" className="btn btn-ghost btn-sm">
            View all
          </Link>
        </div>

        {initialRides.length > 0 ? (
          <div className="space-y-3">
            {initialRides.slice(0, 5).map((ride) => (
              <Link
                key={ride.id}
                href={`/rides/${ride.id}`}
                className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow block"
              >
                <div className="card-body p-4 flex-row items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MdDirectionsCar className="text-primary text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {ride.pickupAddress.split(",")[0]} →{" "}
                      {ride.dropoffAddress.split(",")[0]}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {new Date(ride.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {ride.vehicleType}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-primary">
                      Rs {ride.fare?.toLocaleString()}
                    </p>
                    <span
                      className={`badge badge-xs ${statusBadge[ride.status] || "badge-ghost"}`}
                    >
                      {ride.status.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
