"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  MdToggleOn,
  MdDirectionsCar,
  MdAttachMoney,
  MdStar,
  MdHistory,
  MdLocationOn,
  MdNotifications,
  MdCheck,
} from "react-icons/md";
import { toast } from "sonner";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";

interface DriverStats {
  todayEarnings: string;
  todayTrips: string;
  acceptanceRate: string;
  totalTrips: string;
  totalEarnings: string;
  avgRating: string;
}

interface IncomingRide {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  fare: number;
  passenger: {
    name: string;
    image?: string;
  };
}

export default function DashboardContent({ initialName }: { initialName: string }) {
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [incomingRides, setIncomingRides] = useState<IncomingRide[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { setActiveRide } = useRideTrackingStore();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, incomingRes, profileRes] = await Promise.all([
        fetch("/api/driver/stats"),
        fetch("/api/driver/incoming"),
        fetch("/api/driver/profile")
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (incomingRes.ok) {
        const data = await incomingRes.json();
        setIncomingRides(data.rides || []);
      }
      if (profileRes.ok) {
        const data = await profileRes.json();
        setIsOnline(data.driver?.isOnline || false);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Poll for new rides every 10 seconds if online
    const interval = setInterval(() => {
      if (isOnline) fetchDashboardData();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, isOnline]);

  const toggleOnline = async () => {
    const newStatus = !isOnline;
    try {
      const res = await fetch("/api/driver/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline: newStatus }),
      });
      if (res.ok) {
        setIsOnline(newStatus);
        toast.success(newStatus ? "You are now ONLINE 🚗" : "You are now OFFLINE");
        fetchDashboardData();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const acceptRide = async (rideId: string) => {
    setAcceptingId(rideId);
    try {
      const res = await fetch("/api/driver/accept-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Ride accepted! Starting navigation...");
        setActiveRide(rideId); // Start the global tracking flow
        // The RideTrackerProvider in the background will now pick this up
      } else {
        toast.error(data.error || "Failed to accept ride");
        fetchDashboardData(); // Refresh to see if it's gone
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setAcceptingId(null);
    }
  };

  const displayStats = [
    { label: "Today's Earnings", value: stats?.todayEarnings || "৳0", icon: <MdAttachMoney className="text-success text-2xl" />, color: "bg-success/10" },
    { label: "Trips Today", value: stats?.todayTrips || "0", icon: <MdDirectionsCar className="text-primary text-2xl" />, color: "bg-primary/10" },
    { label: "Acceptance Rate", value: stats?.acceptanceRate || "—", icon: <MdStar className="text-warning text-2xl" />, color: "bg-warning/10" },
    { label: "Total Trips", value: stats?.totalTrips || "0", icon: <MdHistory className="text-info text-2xl" />, color: "bg-info/10" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {initialName} 🚗</h1>
          <p className="text-base-content/60 mt-1">Driver Dashboard</p>
        </div>
        {/* Availability Toggle */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body flex-row items-center gap-4 py-3 px-5">
            <div>
              <p className="font-semibold text-sm">Availability</p>
              <p className="text-xs text-base-content/50">
                {isOnline ? "You are Online" : "Toggle to go online"}
              </p>
            </div>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={toggleOnline}
              className="toggle toggle-success toggle-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {displayStats.map((s) => (
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
          <span className={`badge ${incomingRides.length > 0 ? 'badge-primary' : 'badge-ghost'}`}>
            {incomingRides.length} pending
          </span>
        </div>

        {!isOnline ? (
          <div className="card bg-base-200/50 border border-dashed border-base-300">
            <div className="card-body items-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-3 animate-pulse">
                <MdNotifications className="text-3xl text-base-content/20" />
              </div>
              <p className="font-medium text-base-content/40">You are currently offline</p>
              <p className="text-sm text-base-content/30 mt-1">
                Go online to start receiving ride requests
              </p>
            </div>
          </div>
        ) : incomingRides.length === 0 ? (
          <div className="card bg-base-100 border border-base-200">
            <div className="card-body items-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
                <MdNotifications className="text-3xl text-base-content/30 animate-bounce" />
              </div>
              <p className="font-medium text-base-content/60">Searching for rides...</p>
              <p className="text-sm text-base-content/40 mt-1">
                We'll notify you as soon as a request matches your vehicle
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRides.map((ride) => (
              <div key={ride.id} className="card bg-base-100 border-2 border-primary/20 shadow-lg animate-in fade-in slide-in-from-bottom-4">
                <div className="card-body p-5 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full bg-primary/10">
                           {ride.passenger.image ? (
                             <img src={ride.passenger.image} alt={ride.passenger.name} />
                           ) : (
                             <div className="flex items-center justify-center h-full text-lg font-bold text-primary">
                               {ride.passenger.name.charAt(0)}
                             </div>
                           )}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{ride.passenger.name}</p>
                        <p className="text-xs text-base-content/50">Requested now</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-bold text-success">৳{ride.fare}</p>
                       <p className="text-[10px] uppercase tracking-wider font-bold text-base-content/30">Estimated Fare</p>
                    </div>
                  </div>

                  <div className="space-y-2 py-2">
                    <div className="flex items-start gap-2 text-sm italic">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <p className="text-base-content/70 line-clamp-1">{ride.pickupAddress}</p>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MdLocationOn className="text-error shrink-0 mt-0.5" />
                      <p className="text-base-content/90 line-clamp-1 font-medium">{ride.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-2">
                    <button 
                      onClick={() => acceptRide(ride.id)}
                      disabled={!!acceptingId}
                      className={`btn btn-primary btn-sm flex-1 gap-2 ${acceptingId === ride.id ? 'loading' : ''}`}
                    >
                      {acceptingId === ride.id ? 'Accepting...' : <><MdCheck className="text-lg"/> Accept Ride</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
