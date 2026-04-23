"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRideTrackingStore, TrackingStatus } from "@/store/useRideTrackingStore";

export function RideTrackerProvider({ children }: { children: React.ReactNode }) {
  const { 
    activeRideId, 
    status, 
    lastToastedStatus, 
    setStatus, 
    setLastToastedStatus,
    clearTracking
  } = useRideTrackingStore();

  const syncInterval = useRef<NodeJS.Timeout | null>(null);

  // Background progression logic (Demo speed)
  useEffect(() => {
    if (!activeRideId || status === 'IDLE' || status === 'COMPLETED' || status === 'CANCELLED') {
      if (syncInterval.current) clearInterval(syncInterval.current);
      return;
    }

    const interval = setInterval(() => {
      const nextStatusMap: Record<TrackingStatus, TrackingStatus | null> = {
        'IDLE': null,
        'SEARCHING': 'ACCEPTED',
        'ACCEPTED': 'ARRIVING',
        'ARRIVING': 'ARRIVED',
        'ARRIVED': 'IN_PROGRESS',
        'IN_PROGRESS': 'COMPLETED',
        'COMPLETED': null,
        'CANCELLED': null,
      };

      const nextStatus = nextStatusMap[status];

      if (nextStatus) {
        setStatus(nextStatus);
        
        // Sync to DB
        fetch(`/api/bookings/${activeRideId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus })
        }).catch(err => console.error("Sync error:", err));
      }
    }, 20000); // 20 seconds per stage for realistic background movement

    syncInterval.current = interval;
    return () => clearInterval(interval);
  }, [activeRideId, status, setStatus]);

  // Toast Notifications
  useEffect(() => {
    if (status !== lastToastedStatus) {
      const toastId = 'ride-tracking-global';
      switch (status) {
        case 'SEARCHING':
          toast.loading("Finding a nearby driver...", { id: toastId });
          break;
        case 'ACCEPTED':
          toast.success("Driver assigned! They are preparing to pick you up.", { id: toastId });
          break;
        case 'ARRIVING':
          toast.info("Driver is on the way to your location.", { id: toastId });
          break;
        case 'ARRIVED':
          toast.success("Driver has arrived at the pickup point!", { id: toastId });
          break;
        case 'IN_PROGRESS':
          toast.info("Your ride has started. Have a safe journey!", { id: toastId });
          break;
        case 'COMPLETED':
          toast.success("You have arrived! Ride completed successfully.", { id: toastId });
          // Clear tracking after a delay
          setTimeout(() => clearTracking(), 5000);
          break;
        case 'CANCELLED':
          toast.error("Ride has been cancelled.", { id: toastId });
          setTimeout(() => clearTracking(), 5000);
          break;
      }
      setLastToastedStatus(status);
    }
  }, [status, lastToastedStatus, setLastToastedStatus, clearTracking]);

  return <>{children}</>;
}
