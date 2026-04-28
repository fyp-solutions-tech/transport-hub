"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MdDirectionsCar,
  MdFilterList,
  MdStar,
  MdCalendarToday,
  MdHistory,
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

export function RidesContent({ rides }: { rides: Ride[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredRides = useMemo(() => {
    if (filter === "ALL") return rides;
    if (filter === "COMPLETED") return rides.filter(r => r.status === "COMPLETED");
    if (filter === "CANCELLED") return rides.filter(r => r.status === "CANCELLED");
    return rides.filter(r => !["COMPLETED", "CANCELLED"].includes(r.status));
  }, [rides, filter]);

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
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your Rides</h1>
          <p className="text-sm text-base-content/60">
            View and manage your ride history
          </p>
        </div>

        <div className="join bg-base-100 shadow-sm border border-base-200">
          {["ALL", "COMPLETED", "ONGOING", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`join-item btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Rides List */}
      {filteredRides.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredRides.map((ride) => (
            <Link
              key={ride.id}
              href={`/rides/${ride.id}`}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="card-body p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    <MdDirectionsCar className="text-2xl" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-sm font-bold ${statusBadge[ride.status] || "badge-ghost"}`}>
                          {ride.status.replace("_", " ")}
                        </span>
                        <span className="text-xs text-base-content/40 flex items-center gap-1">
                          <MdCalendarToday />
                          {new Date(ride.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">Rs {ride.fare?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold truncate flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success"></span>
                        {ride.pickupAddress}
                      </p>
                      <p className="text-sm font-semibold truncate flex items-center gap-2 text-base-content/60">
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                        {ride.dropoffAddress}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-base-200 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-base-content/50">
                        <span>{ride.vehicleType}</span>
                        {ride.rating && (
                          <div className="flex items-center gap-1 text-warning font-bold">
                            <MdStar /> {ride.rating}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card bg-base-100 border border-base-200 py-20 text-center">
          <div className="card-body items-center">
            <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
              <MdHistory className="text-4xl opacity-20" />
            </div>
            <h3 className="text-xl font-bold">No rides found</h3>
            <p className="text-base-content/60 max-w-xs mx-auto">
              We couldn't find any rides matching your current filter.
            </p>
            <button 
              onClick={() => setFilter("ALL")}
              className="btn btn-primary btn-sm mt-6"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
