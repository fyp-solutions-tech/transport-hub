"use client";

import { useEffect } from "react";
import { useRideStore } from "@/store/useRideStore";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function RideTrackerProvider({ children }: { children: React.ReactNode }) {
  const { currentRide, status, setStatus, setRide } = useRideStore();
  const { socket, isConnected } = useSocket();

  // 1. Sync active ride on mount
  useEffect(() => {
    const syncActiveRide = async () => {
      try {
        const activeRides = await api.get<any[]>("/rides/active");
        if (activeRides && activeRides.length > 0) {
          const ride = activeRides[0];
          setRide(ride);
          setStatus(ride.status);
        }
      } catch (err) {
        console.error("Failed to sync active ride:", err);
      }
    };

    syncActiveRide();
  }, [setRide, setStatus]);

  // 2. Global Socket Listeners for Status
  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data: { status: any }) => {
      setStatus(data.status);
      
      const toastId = "ride-status-update";
      switch (data.status) {
        case "ACCEPTED":
          toast.success("Driver found! They are on their way.", { id: toastId });
          break;
        case "ARRIVING":
          toast.info("Driver has arrived at the pickup location.", { id: toastId });
          break;
        case "IN_PROGRESS":
          toast.success("Ride started! Have a safe trip.", { id: toastId });
          break;
        case "COMPLETED":
          toast.success("You have arrived! Journey completed.", { id: toastId });
          break;
        case "CANCELLED":
          toast.error("Ride was cancelled.", { id: toastId });
          break;
      }
    };

    socket.on("ride:status_update", handleStatusUpdate);

    return () => {
      socket.off("ride:status_update", handleStatusUpdate);
    };
  }, [socket, setStatus]);

  return <>{children}</>;
}
