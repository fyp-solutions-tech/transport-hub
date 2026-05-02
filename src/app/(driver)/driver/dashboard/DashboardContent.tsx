"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MdLocationOn,
  MdCheck,
  MdNavigation,
  MdCall,
  MdChat,
  MdShield,
  MdDirectionsCar,
} from "react-icons/md";
import { toast } from "sonner";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";
import { useDriverStore } from "@/store/useDriverStore";

interface DriverStats {
  todayEarnings: string;
  todayTrips: string;
  acceptanceRate: string;
  totalTrips: string;
  totalEarnings: string;
  avgRating: string;
  currentRide?: any;
}

export default function DashboardContent({ initialName }: { initialName: string }) {
  const [stats, setStats] = useState<DriverStats | null>(null);
  const { isOnline, setOnline, incomingRides, setIncomingRides } = useDriverStore();
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { setActiveRide } = useRideTrackingStore();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, incomingRes, profileRes] = await Promise.all([
        fetch("/api/driver/stats"),
        fetch("/api/driver/incoming"),
        fetch("/api/driver/profile"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (incomingRes.ok) {
        const data = await incomingRes.json();
        const rides = data.rides || [];
        setIncomingRides(rides);
      }
      if (profileRes.ok) {
        const data = await profileRes.json();
        setOnline(data.driver?.isOnline || false);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Connection lost. Retrying...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      if (isOnline) fetchDashboardData();
    }, 5000); // Polling every 5 seconds for responsive feel
    return () => clearInterval(interval);
  }, [fetchDashboardData, isOnline]);

  const toggleOnline = async () => {
    const newStatus = !isOnline;
    const promise = fetch("/api/driver/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOnline: newStatus }),
    });

    toast.promise(promise, {
      loading: newStatus ? "Going online..." : "Going offline...",
      success: (res) => {
        if (!res.ok) throw new Error();
        setOnline(newStatus);
        return newStatus ? "You are now ONLINE 🚗" : "You are now OFFLINE";
      },
      error: "Failed to update status",
    });

    try {
      const res = await promise;
      if (res.ok) fetchDashboardData();
    } catch {}
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
        toast.success("Ride accepted! Starting navigation...", {
          icon: "🚀",
          duration: 5000
        });
        setActiveRide(rideId);
      } else {
        toast.error(data.error || "Failed to accept ride");
        fetchDashboardData();
      }
    } catch {
      toast.error("An error occurred. Please check your connection.");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">

      {/* Online Toggle */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-base-content">Availability</p>
            <p className="text-xs text-base-content/50 mt-0.5">
              {isOnline ? "You are Online" : "Toggle to go online"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${
                isOnline
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-base-200 text-base-content/40 border-base-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-success animate-pulse" : "bg-base-content/20"
                }`}
              />
              {isOnline ? "Online" : "Offline"}
            </div>
            <input
              type="checkbox"
              checked={isOnline}
              onChange={toggleOnline}
              className="toggle toggle-success"
            />
          </div>
        </div>
      </div>

      {/* Current Ride / Waiting Card */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] p-5 grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-base-content">Current State</h4>
          <span className={`badge badge-sm border-0 font-bold ${stats?.currentRide ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
            {stats?.currentRide ? 'Active Ride' : 'Waiting for Trip'}
          </span>
        </div>

        {stats?.currentRide ? (
          <>
            {/* Passenger mini profile */}
            <div className="flex items-center gap-4 p-4 bg-base-200/60 rounded-xl border border-base-200 mb-5">
              <div className="avatar placeholder">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  <span>{stats.currentRide.passenger?.name?.charAt(0) || "P"}</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-base-content">{stats.currentRide.passenger?.name || "Passenger"}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-warning">★</span>
                  <span className="font-semibold text-base-content/60 text-xs">
                    {stats.currentRide.passenger?.rating ? stats.currentRide.passenger.rating.toFixed(1) : "5.0"} Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: <MdNavigation className="text-primary text-xl" />, label: "Navigate" },
                { icon: <MdCall className="text-primary text-xl" />, label: "Call" },
                { icon: <MdChat className="text-primary text-xl" />, label: "Chat" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-base-200 hover:bg-base-200 transition-colors"
                >
                  {icon}
                  <span className="text-[10px] font-bold uppercase text-base-content/50">
                    {label}
                  </span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary w-full font-bold shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-auto">
              {stats.currentRide.status === "ACCEPTED" ? "Arrive at Pickup" : 
               stats.currentRide.status === "ARRIVING" ? "Start Ride" : "Complete Ride"}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-base-200/40 rounded-xl border border-dashed border-base-300 grow min-h-[220px]">
             <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center mb-3 text-base-content/20 shadow-sm">
               <MdDirectionsCar className="text-2xl" />
             </div>
             <p className="text-sm font-bold text-base-content/40">No active ride</p>
             <p className="text-[10px] text-base-content/30 mt-1 max-w-[200px]">Select a request to get started</p>
          </div>
        )}
      </div>

      {/* Safety Center */}
      <div className="bg-base-200/60 rounded-2xl p-4 flex items-center gap-3 border border-base-200">
        <div className="w-9 h-9 bg-base-100 rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
          <MdShield className="text-lg" />
        </div>
        <div>
          <p className="text-sm font-bold text-base-content">Safety Center</p>
          <p className="text-xs text-base-content/50">Help and support is one tap away.</p>
        </div>
      </div>

      {/* Live Incoming Requests (shown when online) */}
      {isOnline && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base-content">Incoming Requests</h4>
            <span className="badge badge-primary badge-sm">{incomingRides.length}</span>
          </div>
          
          {incomingRides.length > 0 ? (
            incomingRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-base-100 border-2 border-primary/20 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        <span>{ride.passenger.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{ride.passenger.name}</p>
                      <p className="text-xs text-base-content/40">Requested now</p>
                    </div>
                  </div>
                  <p className="font-bold text-success text-lg">PKR {Math.round(ride.fare)}</p>
                </div>
                <div className="space-y-1 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <p className="text-base-content/70 truncate">{ride.pickupAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-error shrink-0" />
                    <p className="text-base-content/90 font-medium truncate">
                      {ride.dropoffAddress}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => acceptRide(ride.id)}
                  disabled={!!acceptingId}
                  className={`btn btn-primary btn-sm w-full gap-2 ${
                    acceptingId === ride.id ? "loading" : ""
                  }`}
                >
                  {acceptingId === ride.id ? (
                    "Accepting..."
                  ) : (
                    <>
                      <MdCheck className="text-lg" /> Accept Ride
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="bg-base-200/40 rounded-2xl p-8 text-center border border-dashed border-base-300">
              <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-3 text-base-content/20">
                <MdDirectionsCar className="text-2xl" />
              </div>
              <p className="text-sm font-bold text-base-content/40">Searching for rides...</p>
              <p className="text-[10px] text-base-content/30 mt-1">Stay active to receive new requests</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
