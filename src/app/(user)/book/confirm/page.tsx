"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MdMyLocation,
  MdLocationOn,
  MdDirectionsCar,
  MdElectricCar,
  MdAccessTime,
  MdPayment,
  MdCheckCircle,
  MdArrowBack,
  MdClose,
  MdAccountBalance,
  MdCreditCard,
  MdAdd,
  MdInfo,
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa6";
import { toast } from "sonner";
import {
  useBookingStore,
  computeFare,
  VEHICLES,
  type VehicleCategory,
} from "@/store/useBookingStore";
import { useRideStore } from "@/store/useRideStore";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";
import { api } from "@/lib/api";

type PaymentMethod = "cash" | "loan" | "card";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; icon: any }[] = [
  { id: "cash", label: "Cash on Delivery", desc: "Pay driver directly", icon: MdAccountBalance },
  { id: "loan", label: "Loan", desc: "Company pays now, repay later", icon: MdPayment },
  { id: "card", label: "Debit Card", desc: "Visa •••• 1234", icon: MdCreditCard },
];

const LOAN_INTEREST_RATE = 0.05;

export default function BookConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleParam = searchParams.get("vehicle") as VehicleCategory | null;

  const {
    pickup,
    dropoff,
    distance,
    duration,
    selectedVehicle,
    setSelectedVehicle,
    paymentMethod,
    setPaymentMethod,
    loanApplied,
    setLoanApplied,
  } = useBookingStore();

  const { setRide, setStatus } = useRideStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (vehicleParam && !selectedVehicle) {
      setSelectedVehicle(vehicleParam);
    }
  }, [vehicleParam, selectedVehicle, setSelectedVehicle]);

  const vehicle = vehicleParam || selectedVehicle;

  useEffect(() => {
    if (!pickup || !dropoff) {
      toast.error("Missing booking data. Redirecting...");
      router.replace("/book");
    }
  }, [pickup, dropoff, router]);

  const fare = useMemo(() => {
    if (!vehicle || !distance) return null;
    return computeFare(vehicle as VehicleCategory, distance);
  }, [vehicle, distance]);

  const loanInterest = useMemo(() => {
    if (!loanApplied || !fare) return 0;
    return Math.round(fare.total * LOAN_INTEREST_RATE);
  }, [loanApplied, fare]);

  const vehicleDef = VEHICLES.find((v: any) => v.id === vehicle);

  const vehicleIcon = (icon: string) => {
    switch (icon) {
      case "car": return <MdDirectionsCar />;
      case "electric": return <MdElectricCar />;
      case "moto": return <FaMotorcycle />;
      default: return <MdDirectionsCar />;
    }
  };

  const handlePaymentSelect = (methodId: string) => {
    const selected = PAYMENT_OPTIONS.find((m: any) => m.id === methodId);
    if (!selected) return;

    setPaymentMethod(selected.id);
    setLoanApplied(selected.id === "loan");
    setShowPaymentModal(false);
  };

  const handleConfirmBooking = async () => {
    if (!pickup || !dropoff || !vehicle || !fare) return;

    setIsSubmitting(true);
    try {
      const payload = {
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        pickupAddress: pickup.address || "Unknown",
        dropoffLat: dropoff.lat,
        dropoffLng: dropoff.lng,
        dropoffAddress: dropoff.address || "Unknown",
        vehicleType: vehicle,
        distanceKm: distance,
        durationMin: duration,
        fare: fare.total + loanInterest,
        paymentMethod: paymentMethod.toUpperCase(),
        loanAmount: loanApplied ? fare.total : 0,
      };

      const response = await api.post<any>("/rides/request", payload);

      setRide(response);
      setStatus("SEARCHING");
      useRideTrackingStore.getState().setActiveRide(response.id);
      toast.success("Ride requested! Searching for drivers...");
      router.push(`/rides/${response.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pickup || !dropoff) return null;

  const currentPayment = PAYMENT_OPTIONS.find((m: any) => m.id === paymentMethod) || PAYMENT_OPTIONS[0];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
          <MdArrowBack className="text-xl" />
        </button>
        <div>
          <h1 className="text-[32px] font-bold text-[#111c2d]">Confirm Booking</h1>
          <p className="text-[16px] text-slate-500">Review and finalize your travel details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ── Left: Trip Summary ────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 space-y-8">
            <h2 className="text-[20px] font-bold text-[#111c2d]">Trip Details</h2>
            
            <div className="relative">
              <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-slate-100 mt-2 mb-2" />
              <div className="space-y-10">
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-blue-600 border-4 border-blue-100 z-10 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Pickup</p>
                    <p className="text-[16px] font-semibold text-[#111c2d] leading-tight">{pickup.address}</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-red-500 border-4 border-red-100 z-10 flex-shrink-0" />
                  <div>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Drop-off</p>
                    <p className="text-[16px] font-semibold text-[#111c2d] leading-tight">{dropoff.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 mx-auto mb-2">
                  {vehicleIcon(vehicleDef?.icon || "car")}
                </div>
                <p className="text-[12px] text-slate-500 mb-0.5">Vehicle</p>
                <p className="text-[16px] font-bold text-[#111c2d]">{vehicleDef?.label}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 mx-auto mb-2">
                  <MdAccessTime className="text-xl" />
                </div>
                <p className="text-[12px] text-slate-500 mb-0.5">ETA</p>
                <p className="text-[16px] font-bold text-[#111c2d]">{vehicleDef?.eta}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#f0f3ff] p-6 rounded-2xl flex gap-4">
            <MdInfo className="text-blue-600 text-2xl shrink-0 mt-1" />
            <div>
              <h4 className="text-[14px] font-bold text-blue-700 mb-1">Estimated Distance</h4>
              <p className="text-[18px] font-black text-blue-600">{distance?.toFixed(1)} km</p>
              <p className="text-[12px] text-[#54647a] mt-1">Based on the most efficient route found.</p>
            </div>
          </div>
        </div>

        {/* ── Right: Payment & Confirmation ───── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 space-y-6">
            <h2 className="text-[20px] font-bold text-[#111c2d]">Fare Breakdown</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-slate-500">Base Fare</span>
                <span className="text-[16px] font-semibold text-[#111c2d]">PKR {fare?.baseFare}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-slate-500">Distance ({distance?.toFixed(1)} km)</span>
                <span className="text-[16px] font-semibold text-[#111c2d]">PKR {fare?.distanceFare}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-slate-500">Service Fee</span>
                <span className="text-[16px] font-semibold text-[#111c2d]">PKR {fare?.serviceFee}</span>
              </div>
              {loanApplied && (
                <div className="flex justify-between items-center text-blue-600 font-bold">
                  <span className="text-[16px]">Loan Interest (5%)</span>
                  <span className="text-[16px]">+ PKR {loanInterest}</span>
                </div>
              )}
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-[18px] font-bold text-[#111c2d]">Total Fare</span>
                <span className="text-[24px] font-black text-blue-600">PKR {Math.round((fare?.total || 0) + loanInterest).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <MdPayment className="text-2xl" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</p>
                <p className="text-[16px] font-bold text-[#111c2d]">{currentPayment?.label}</p>
              </div>
            </div>
            <button onClick={() => setShowPaymentModal(true)} className="text-sm font-bold text-blue-600 hover:underline">Change</button>
          </div>

          <button
            disabled={isSubmitting || !fare}
            onClick={handleConfirmBooking}
            className="w-full py-5 bg-blue-600 text-white font-bold text-[18px] rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              <>
                <MdCheckCircle className="text-2xl" />
                Book Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111c2d]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#111c2d]">Payment Method</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-blue-600 transition-colors"><MdClose className="text-2xl" /></button>
            </div>
            <div className="p-6 space-y-3">
              {PAYMENT_OPTIONS.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => handlePaymentSelect(m.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === m.id ? "border-blue-600 bg-blue-50" : "border-slate-50 bg-slate-50/50 hover:border-blue-100"
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === m.id ? "bg-blue-600 text-white" : "bg-white text-slate-400 shadow-sm"}`}>
                      <m.icon className="text-xl" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#111c2d]">{m.label}</p>
                      <p className="text-[12px] text-slate-400 capitalize">{m.desc}</p>
                    </div>
                  </div>
                  {paymentMethod === m.id && <MdCheckCircle className="text-blue-600 text-xl" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}