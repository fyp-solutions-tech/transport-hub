import { create } from 'zustand';

interface IncomingRide {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  fare: number;
  passenger: {
    name: string;
    image?: string;
  };
}

interface DriverState {
  isOnline: boolean;
  incomingRides: IncomingRide[];
  setOnline: (status: boolean) => void;
  setIncomingRides: (rides: IncomingRide[]) => void;
  declineRide: (rideId: string) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  isOnline: false,
  incomingRides: [],
  setOnline: (status) => set({ isOnline: status }),
  setIncomingRides: (rides) => set({ incomingRides: rides }),
  declineRide: (rideId) => set((state) => ({
    incomingRides: state.incomingRides.filter((r) => r.id !== rideId),
  })),
}));
