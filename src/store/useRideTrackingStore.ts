import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TrackingStatus =
  | 'IDLE'
  | 'SEARCHING'
  | 'ACCEPTED'
  | 'ARRIVING'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface MockDriver {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  category: 'economy' | 'comfort' | 'moto';
}

interface RideTrackingState {
  activeRideId: string | null;
  status: TrackingStatus;
  driver: MockDriver | null;
  lastToastedStatus: TrackingStatus | null;

  setActiveRide: (rideId: string) => void;
  setStatus: (s: TrackingStatus) => void;
  setDriver: (d: MockDriver | null) => void;
  setLastToastedStatus: (s: TrackingStatus) => void;
  clearTracking: () => void;
}

// ── 30 Mock Drivers ──────────────────────────────────────
export const MOCK_DRIVERS: MockDriver[] = [
  // 10 Economy
  { name: 'Ahmed Hassan', vehicle: 'Toyota Corolla (White)', plate: 'LHR-7890', rating: 4.9, category: 'economy' },
  { name: 'Bilal Khan', vehicle: 'Honda City (Silver)', plate: 'ISL-4422', rating: 4.8, category: 'economy' },
  { name: 'Zeeshan Ali', vehicle: 'Suzuki Swift (Blue)', plate: 'KHI-1155', rating: 4.7, category: 'economy' },
  { name: 'Usman Tariq', vehicle: 'Toyota Yaris (White)', plate: 'LHR-2233', rating: 4.6, category: 'economy' },
  { name: 'Farhan Ahmed', vehicle: 'Suzuki Cultus (Grey)', plate: 'RWP-5566', rating: 4.5, category: 'economy' },
  { name: 'Hamza Malik', vehicle: 'Honda Civic (Black)', plate: 'LHR-9988', rating: 4.8, category: 'economy' },
  { name: 'Imran Rashid', vehicle: 'Toyota Vitz (Red)', plate: 'ISL-3344', rating: 4.4, category: 'economy' },
  { name: 'Kashif Iqbal', vehicle: 'Kia Picanto (White)', plate: 'KHI-7711', rating: 4.7, category: 'economy' },
  { name: 'Nabeel Shah', vehicle: 'Suzuki Alto (Silver)', plate: 'LHR-6655', rating: 4.3, category: 'economy' },
  { name: 'Omer Farooq', vehicle: 'Hyundai Santro (Blue)', plate: 'RWP-8844', rating: 4.6, category: 'economy' },
  // 10 Comfort
  { name: 'Saad Hussain', vehicle: 'Toyota Camry (Black)', plate: 'ISL-1100', rating: 4.9, category: 'comfort' },
  { name: 'Talha Javed', vehicle: 'Honda Accord (White)', plate: 'LHR-2211', rating: 4.8, category: 'comfort' },
  { name: 'Waqas Azam', vehicle: 'Toyota Corolla Grande (Silver)', plate: 'KHI-3322', rating: 4.9, category: 'comfort' },
  { name: 'Yasir Khan', vehicle: 'Honda Civic Turbo (Black)', plate: 'ISL-4433', rating: 4.7, category: 'comfort' },
  { name: 'Ali Raza', vehicle: 'Hyundai Elantra (White)', plate: 'LHR-5544', rating: 4.8, category: 'comfort' },
  { name: 'Danish Mehmood', vehicle: 'Kia Sportage (Grey)', plate: 'RWP-6655', rating: 4.6, category: 'comfort' },
  { name: 'Faisal Nawaz', vehicle: 'Toyota Fortuner (Black)', plate: 'ISL-7766', rating: 4.9, category: 'comfort' },
  { name: 'Ghulam Abbas', vehicle: 'Honda HR-V (Blue)', plate: 'KHI-8877', rating: 4.5, category: 'comfort' },
  { name: 'Haris Saeed', vehicle: 'Hyundai Tucson (White)', plate: 'LHR-9988', rating: 4.7, category: 'comfort' },
  { name: 'Junaid Akram', vehicle: 'MG HS (Red)', plate: 'RWP-1122', rating: 4.8, category: 'comfort' },
  // 10 Bike/Moto
  { name: 'Kamran Yousaf', vehicle: 'Honda CG125 (Black)', plate: 'LHR-1234', rating: 4.6, category: 'moto' },
  { name: 'Latif Chaudhry', vehicle: 'Yamaha YBR (Red)', plate: 'ISL-2345', rating: 4.5, category: 'moto' },
  { name: 'Mohsin Raza', vehicle: 'Suzuki GD110 (Blue)', plate: 'KHI-3456', rating: 4.7, category: 'moto' },
  { name: 'Nasir Abbas', vehicle: 'Honda CB150 (Black)', plate: 'RWP-4567', rating: 4.4, category: 'moto' },
  { name: 'Pervaiz Masih', vehicle: 'United US70 (Red)', plate: 'LHR-5678', rating: 4.3, category: 'moto' },
  { name: 'Qasim Shahzad', vehicle: 'Honda CD70 (Black)', plate: 'ISL-6789', rating: 4.6, category: 'moto' },
  { name: 'Rizwan Khalid', vehicle: 'Yamaha YB125Z (Blue)', plate: 'KHI-7890', rating: 4.5, category: 'moto' },
  { name: 'Shahid Mehmood', vehicle: 'Suzuki GS150 (Grey)', plate: 'RWP-8901', rating: 4.7, category: 'moto' },
  { name: 'Tariq Jameel', vehicle: 'Honda Pridor (Red)', plate: 'LHR-9012', rating: 4.4, category: 'moto' },
  { name: 'Umar Hayat', vehicle: 'Unique UD70 (Black)', plate: 'ISL-0123', rating: 4.3, category: 'moto' },
];

export function getDriverForCategory(vehicleType: string): MockDriver {
  const category = vehicleType === 'comfort' ? 'comfort' : vehicleType === 'moto' ? 'moto' : 'economy';
  const pool = MOCK_DRIVERS.filter((d) => d.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const useRideTrackingStore = create<RideTrackingState>()(
  persist(
    (set) => ({
      activeRideId: null,
      status: 'IDLE',
      driver: null,
      lastToastedStatus: null,

      setActiveRide: (rideId) => set({ activeRideId: rideId, status: 'SEARCHING', lastToastedStatus: null }),
      setStatus: (s) => set({ status: s }),
      setDriver: (d) => set({ driver: d }),
      setLastToastedStatus: (s) => set({ lastToastedStatus: s }),
      clearTracking: () => set({ activeRideId: null, status: 'IDLE', driver: null, lastToastedStatus: null }),
    }),
    {
      name: 'transport-hub-tracking',
    }
  )
);
