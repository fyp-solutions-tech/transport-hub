'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRideTrackingStore } from '@/store/useRideTrackingStore';

/**
 * Invisible component mounted in the user layout.
 * Watches ride tracking state and fires global toasts
 * for ride status changes — even when user navigates away.
 */
export default function RideTracker() {
  const { status, lastToastedStatus, driver, setLastToastedStatus } =
    useRideTrackingStore();

  useEffect(() => {
    if (status === 'IDLE' || status === lastToastedStatus) return;

    switch (status) {
      case 'SEARCHING':
        toast.loading('Searching for a driver...', { id: 'ride-status', duration: 8000 });
        break;
      case 'ACCEPTED':
        toast.success(`Driver assigned: ${driver?.name || 'Your driver'}`, { id: 'ride-status' });
        break;
      case 'ARRIVING':
        toast.info(`${driver?.name || 'Driver'} is on the way!`, { id: 'ride-status' });
        break;
      case 'ARRIVED':
        toast.info(`${driver?.name || 'Driver'} has arrived at pickup!`, { id: 'ride-status' });
        break;
      case 'IN_PROGRESS':
        toast.success('Ride started! Enjoy your trip.', { id: 'ride-status' });
        break;
      case 'COMPLETED':
        toast.success('Ride completed! Please rate your experience.', { id: 'ride-status' });
        break;
      case 'CANCELLED':
        toast.error('Ride has been cancelled.', { id: 'ride-status' });
        break;
    }

    setLastToastedStatus(status);
  }, [status, lastToastedStatus, driver, setLastToastedStatus]);

  return null;
}
