import { create } from 'zustand';

// ── Types ──────────────────────────────────────────────
export interface Location {
  lat: number;
  lng: number;
  address?: string;
  name?: string;
}

export type VehicleCategory = 'economy' | 'comfort' | 'moto';

export interface VehicleDef {
  id: VehicleCategory;
  label: string;
  description: string;
  icon: 'car' | 'electric' | 'moto';
  baseFare: number;
  perKm: number;
  eta: string;
}

export type PaymentMethod = 'cash' | 'loan' | 'card';

export interface BookingState {
  // Locations
  pickup: Location | null;
  dropoff: Location | null;
  liveLocation: Location | null;

  // Route
  distance: number | null;   // km
  duration: number | null;   // mins

  // Vehicle
  selectedVehicle: VehicleCategory | null;

  // Payment
  paymentMethod: PaymentMethod;
  loanApplied: boolean;

  // Actions
  setPickup: (loc: Location | null) => void;
  setDropoff: (loc: Location | null) => void;
  setLiveLocation: (loc: Location | null) => void;
  setSearchParams: (distance: number, duration: number) => void;
  setSelectedVehicle: (v: VehicleCategory | null) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  setLoanApplied: (v: boolean) => void;
  resetBooking: () => void;
}

// ── Pricing from env (with sensible defaults) ──────────
export const PRICING = {
  economy: {
    baseFare: Number(process.env.NEXT_PUBLIC_ECONOMY_BASE_FARE) || 150,
    perKm:    Number(process.env.NEXT_PUBLIC_ECONOMY_PER_KM)    || 35,
  },
  comfort: {
    baseFare: Number(process.env.NEXT_PUBLIC_COMFORT_BASE_FARE) || 250,
    perKm:    Number(process.env.NEXT_PUBLIC_COMFORT_PER_KM)    || 55,
  },
  moto: {
    baseFare: Number(process.env.NEXT_PUBLIC_MOTO_BASE_FARE) || 50,
    perKm:    Number(process.env.NEXT_PUBLIC_MOTO_PER_KM)    || 18,
  },
  serviceFee: Number(process.env.NEXT_PUBLIC_SERVICE_FEE) || 25,
} as const;

// ── Vehicle definitions ────────────────────────────────
export const VEHICLES: VehicleDef[] = [
  {
    id: 'economy',
    label: 'Car (Economy)',
    description: 'Affordable everyday rides',
    icon: 'car',
    baseFare: PRICING.economy.baseFare,
    perKm: PRICING.economy.perKm,
    eta: '3–5 min',
  },
  {
    id: 'comfort',
    label: 'Car (Comfort)',
    description: 'Spacious AC vehicles',
    icon: 'electric',
    baseFare: PRICING.comfort.baseFare,
    perKm: PRICING.comfort.perKm,
    eta: '5–8 min',
  },
  {
    id: 'moto',
    label: 'Motorbike',
    description: 'Beat traffic on two wheels',
    icon: 'moto',
    baseFare: PRICING.moto.baseFare,
    perKm: PRICING.moto.perKm,
    eta: '2–4 min',
  },
];

// ── Fare calculator ────────────────────────────────────
export function computeFare(
  vehicleId: VehicleCategory,
  distanceKm: number
): { baseFare: number; distanceFare: number; serviceFee: number; total: number } {
  const v = PRICING[vehicleId];
  const baseFare = v.baseFare;
  const distanceFare = Math.round(distanceKm * v.perKm);
  const serviceFee = PRICING.serviceFee;
  const total = baseFare + distanceFare + serviceFee;
  return { baseFare, distanceFare, serviceFee, total };
}

// ── Store ──────────────────────────────────────────────
export const useBookingStore = create<BookingState>((set) => ({
  pickup: null,
  dropoff: null,
  liveLocation: null,
  distance: null,
  duration: null,
  selectedVehicle: null,
  paymentMethod: 'cash',
  loanApplied: false,

  setPickup: (loc) => set({ pickup: loc }),
  setDropoff: (loc) => set({ dropoff: loc }),
  setLiveLocation: (loc) => set({ liveLocation: loc }),
  setSearchParams: (distance, duration) => set({ distance, duration }),
  setSelectedVehicle: (v) => set({ selectedVehicle: v }),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  setLoanApplied: (v) => set({ loanApplied: v }),
  resetBooking: () =>
    set({
      pickup: null,
      dropoff: null,
      distance: null,
      duration: null,
      selectedVehicle: null,
      paymentMethod: 'cash',
      loanApplied: false,
    }),
}));
