"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRideTrackingStore, TrackingStatus } from "@/store/useRideTrackingStore";

export function RideTrackerProvider({ children }: { children: React.ReactNode }) {
  const { 
    activeRideId, 
    status, 
    lastToastedStatus, 
    setStatus, 
    setLastToastedStatus,
    driver,
    setDriver,
    clearTracking
  } = useRideTrackingStore();

  useEffect(() => {
    if (!activeRideId || status === 'IDLE' || status === 'COMPLETED' || status === 'CANCELLED') return;

    // Progression logic
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
        // Random chance or timer-based progression
        // For demonstration/FYP, we just use a simple timer-based sequence controlled by intervals
        // but here we just trigger the next one every 15-30 seconds if not already there
        setStatus(nextStatus);
      }
    }, 15000); // 15 seconds per stage for demo speed

    return () => clearInterval(interval);
  }, [activeRideId, status, setStatus]);

  // Toast Notifications
  useEffect(() => {
    if (status !== lastToastedStatus) {
      switch (status) {
        case 'SEARCHING':
          toast.loading("Finding a nearby driver...", { id: 'ride-tracking' });
          break;
        case 'ACCEPTED':
          toast.success("Driver assigned! Ahmed Hassan is on his way.", { id: 'ride-tracking' });
          break;
        case 'ARRIVING':
          toast.info("Driver is approaching your location.", { id: 'ride-tracking' });
          break;
        case 'ARRIVED':
          toast.success("Driver has arrived at the pickup point!", { id: 'ride-tracking' });
          break;
        case 'IN_PROGRESS':
          toast.info("Your ride has started. Have a safe journey!", { id: 'ride-tracking' });
          break;
        case 'COMPLETED':
          toast.success("You have arrived! Rate your experience.", { id: 'ride-tracking' });
          break;
        case 'CANCELLED':
          toast.error("Ride has been cancelled.", { id: 'ride-tracking' });
          break;
      }
      setLastToastedStatus(status);
    }
  }, [status, lastToastedStatus, setLastToastedStatus]);

  return <>{children}</>;
}
