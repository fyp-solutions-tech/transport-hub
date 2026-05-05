import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RideStatus = 
  | "IDLE" 
  | "ESTIMATING" 
  | "REQUESTING" 
  | "SEARCHING" 
  | "ACCEPTED" 
  | "ARRIVING" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED";

interface RideState {
  currentRide: any | null;
  status: RideStatus;
  estimate: any | null;
  
  // Actions
  setRide: (ride: any) => void;
  setStatus: (status: RideStatus) => void;
  setEstimate: (estimate: any) => void;
  resetRide: () => void;
}

export const useRideStore = create<RideState>()(
  persist(
    (set) => ({
      currentRide: null,
      status: "IDLE",
      estimate: null,

      setRide: (ride) => set({ currentRide: ride }),
      setStatus: (status) => set({ status }),
      setEstimate: (estimate) => set({ estimate }),
      resetRide: () => set({ currentRide: null, status: "IDLE", estimate: null }),
    }),
    {
      name: "ride-storage",
    }
  )
);
