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
import { useRideStore, type RideStatus } from "@/store/useRideStore";
import { useDriverStore } from "@/store/useDriverStore";
import { api } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";

export default function DashboardContent({ initialName }: { initialName: string }) {
  const [stats, setStats] = useState<any>(null);
  const { isOnline, setOnline, incomingRides, setIncomingRides } = useDriverStore();
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { status, currentRide, setRide, setStatus } = useRideStore();
  const { socket } = useSocket();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [earningsRes, activeRes] = await Promise.all([
        api.get("/driver/earnings"),
        api.get<Array<{ id: string; status: string }>>("/rides/active"),
      ]);

      setStats(earningsRes);
      if (activeRes?.length) {
        setRide(activeRes[0]);
        setStatus(activeRes[0].status as RideStatus);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [setRide, setStatus]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const toggleOnline = async () => {
    const newStatus = !isOnline;
    try {
      await api.post("/driver/status", { isOnline: newStatus });
      setOnline(newStatus);
      toast.success(newStatus ? "You are now ONLINE 🚗" : "You are now OFFLINE");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const acceptRide = async (rideId: string) => {
    setAcceptingId(rideId);
    try {
      const response = await api.post(`/driver/rides/${rideId}/accept`);
      toast.success("Ride accepted! Starting navigation...");
      setRide(response);
      setStatus("ACCEPTED");
      setIncomingRides(incomingRides.filter((r: any) => r.id !== rideId));
    } catch (err: any) {
      toast.error(err.message || "Failed to accept ride");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleAction = async () => {
    if (!currentRide) return;
    const nextStatusMap: any = {
      "ACCEPTED": "ARRIVING",
      "ARRIVING": "IN_PROGRESS",
      "IN_PROGRESS": "COMPLETED",
    };
    const nextStatus = nextStatusMap[status];
    if (!nextStatus) return;

    try {
      const endpoint = nextStatus === "ARRIVING" ? `/rides/${currentRide.id}/status` : 
                       nextStatus === "IN_PROGRESS" ? `/driver/rides/${currentRide.id}/start` : 
                       `/driver/rides/${currentRide.id}/complete`;
      
      const res = await api.post(endpoint, { status: nextStatus });
      setStatus(nextStatus);
      
      if (nextStatus === "COMPLETED") {
        toast.success("Ride completed! Well done.");
        setRide(null);
        fetchDashboardData();
      } else {
        toast.success(`Status updated to ${nextStatus.replace('_', ' ')}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const currentIncoming = incomingRides[0];

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
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${isOnline ? "bg-success/10 text-success border-success/20" : "bg-base-200 text-base-content/40 border-base-300"}`}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-base-content/20"}`} />
              {isOnline ? "Online" : "Offline"}
            </div>
            <input type="checkbox" checked={isOnline} onChange={toggleOnline} className="toggle toggle-success" />
          </div>
        </div>
      </div>

      {/* Current Ride / Waiting Card */}
      <div className="bg-base-100 border border-base-200 rounded-2xl shadow-[0_8px_30px_rgba(37,99,235,0.06)] p-5 grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-base-content">Current State</h4>
          <span className={`badge badge-sm border-0 font-bold ${currentRide ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
            {currentRide ? status.replace('_', ' ') : 'Waiting for Trip'}
          </span>
        </div>

        {currentRide ? (
          <>
            <div className="flex items-center gap-4 p-4 bg-base-200/60 rounded-xl border border-base-200 mb-5">
              <div className="avatar placeholder">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  <span>{currentRide.passenger?.name?.charAt(0) || "P"}</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-base-content">{currentRide.passenger?.name || "Passenger"}</p>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-warning">★</span>
                  <span className="font-semibold text-base-content/60 text-xs">
                    {currentRide.passenger?.rating || "5.0"} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { icon: <MdNavigation className="text-primary text-xl" />, label: "Navigate" },
                { icon: <MdCall className="text-primary text-xl" />, label: "Call" },
                { icon: <MdChat className="text-primary text-xl" />, label: "Chat" },
              ].map(({ icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-base-200 hover:bg-base-200 transition-colors">
                  {icon}
                  <span className="text-[10px] font-bold uppercase text-base-content/50">{label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-6">
               <div className="flex items-start gap-2 text-xs">
                  <MdLocationOn className="text-primary mt-0.5" />
                  <div>
                    <p className="font-bold text-base-content/40 uppercase text-[10px]">Destination</p>
                    <p className="font-medium text-base-content">{currentRide.dropoffAddress}</p>
                  </div>
               </div>
            </div>

            <button onClick={handleAction} className="btn btn-primary w-full font-bold shadow-sm shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-auto capitalize">
              {status === "ACCEPTED" ? "Arrived at Pickup" : 
               status === "ARRIVING" ? "Start Ride" : 
               status === "IN_PROGRESS" ? "Complete Ride" : "Done"}
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-base-200/40 rounded-xl border border-dashed border-base-300 grow min-h-[220px]">
             <div className="w-12 h-12 bg-base-100 rounded-full flex items-center justify-center mb-3 text-base-content/20 shadow-sm">
               <MdDirectionsCar className="text-2xl" />
             </div>
             <p className="text-sm font-bold text-base-content/40">No active ride</p>
             <p className="text-[10px] text-base-content/30 mt-1 max-w-[200px]">Waiting for passenger requests...</p>
          </div>
        )}
      </div>

      {/* Incoming Request Modal-like Popup */}
      {isOnline && currentIncoming && (
        <div className="fixed inset-x-4 bottom-4 md:inset-auto md:right-8 md:bottom-8 z-50 animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-white rounded-2xl p-6 shadow-[0_20px_50px_rgba(37,99,235,0.2)] border border-blue-100 w-full md:w-96">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="badge badge-primary badge-sm font-bold mb-1">NEW REQUEST</span>
                  <h4 className="font-black text-slate-800 text-lg">PKR {Math.round(currentIncoming.fare)}</h4>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Fare</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                       <MdLocationOn className="text-lg" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Pickup</p>
                       <p className="text-sm font-bold text-slate-700 truncate">{currentIncoming.pickupAddress}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                       <MdLocationOn className="text-lg" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Dropoff</p>
                       <p className="text-sm font-bold text-slate-700 truncate">{currentIncoming.dropoffAddress}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => useDriverStore.getState().declineRide(currentIncoming.id)} 
                   className="btn btn-ghost bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold border-none"
                 >
                   Decline
                 </button>
                 <button 
                   onClick={() => acceptRide(currentIncoming.id)} 
                   disabled={!!acceptingId}
                   className="btn btn-primary font-bold shadow-lg shadow-primary/20"
                 >
                   {acceptingId === currentIncoming.id ? <span className="loading loading-spinner" /> : "Accept Ride"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
