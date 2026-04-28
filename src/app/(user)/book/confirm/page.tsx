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
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa6";
import { toast } from "sonner";
import {
  useBookingStore,
  computeFare,
  VEHICLES,
  type VehicleCategory,
} from "@/store/useBookingStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";

// Fix: Add PaymentMethod type
type PaymentMethod = "cash" | "loan" | "card";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: "cash", label: "Cash on Delivery", desc: "Pay driver directly", icon: <MdAccountBalance className="text-xl text-success" /> },
  { id: "loan", label: "Loan", desc: "Company pays now, repay later", icon: <MdPayment className="text-xl text-warning" /> },
  { id: "card", label: "Debit Card", desc: "Visa •••• 1234", icon: <MdCreditCard className="text-xl text-info" /> },
];

const ADD_METHODS = [
  { id: "jazzcash", label: "JazzCash", color: "text-red-500" },
  { id: "easypaisa", label: "Easypaisa", color: "text-green-500" },
  { id: "googlepay", label: "Google Pay", color: "text-blue-500" },
  { id: "paypal", label: "PayPal", color: "text-indigo-500" },
];

const LOAN_INTEREST_RATE = 0.05; // 5% interest

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

  const { setActiveRide } = useRideTrackingStore();
  const { paymentMethods, updateLoan, addTransaction } = usePaymentStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);

  // ── Sync vehicle from URL param ─────────────────────
  useEffect(() => {
    if (vehicleParam && !selectedVehicle) {
      setSelectedVehicle(vehicleParam);
    }
  }, [vehicleParam, selectedVehicle, setSelectedVehicle]);

  const vehicle = vehicleParam || selectedVehicle;

  // ── Validate required data on mount ─────────────────
  useEffect(() => {
    if (!pickup || !dropoff) {
      toast.error("Missing pickup or drop-off. Please go back and select locations.");
      router.replace("/book");
    }
  }, [pickup, dropoff, router]);

  // ── Compute fare ────────────────────────────────────
  const fare = useMemo(() => {
    if (!vehicle || !distance) return null;
    return computeFare(vehicle as VehicleCategory, distance);
  }, [vehicle, distance]);

  // ── Loan fare adjustment ────────────────────────────
  const loanInterest = useMemo(() => {
    if (!loanApplied || !fare) return 0;
    return Math.round(fare.total * LOAN_INTEREST_RATE);
  }, [loanApplied, fare]);

  const vehicleDef = VEHICLES.find((v) => v.id === vehicle);

  // ── Icon helper ─────────────────────────────────────
  const getVehicleIcon = () => {
    switch (vehicleDef?.icon) {
      case "car":
        return <MdDirectionsCar className="text-2xl text-primary mx-auto mb-1" />;
      case "electric":
        return <MdElectricCar className="text-2xl text-success mx-auto mb-1" />;
      case "moto":
        return <FaMotorcycle className="text-2xl text-warning mx-auto mb-1" />;
      default:
        return <MdDirectionsCar className="text-2xl text-primary mx-auto mb-1" />;
    }
  };

  // ── Payment method selection handler ────────────────
  const handlePaymentSelect = (methodId: string) => {
    const selected = paymentMethods.find(m => m.id === methodId);
    if (!selected) return;
    
    setPaymentMethod(selected.type as any);
    
    if (selected.type === "loan") {
      setLoanApplied(true);
      toast.info("Company will pay now. The amount will be added to your next ride with 5% interest.", {
        duration: 5000,
        icon: <MdPayment className="text-warning" />,
      });
    } else {
      setLoanApplied(false);
    }
    setShowPaymentModal(false);
  };

  // ── Add method handler ──────────────────────────────
  const handleAddMethod = () => {
    toast.info("This feature is coming soon!", { duration: 2500 });
    setShowAddMethodModal(false);
  };

  // ── Confirm Booking handler ─────────────────────────
  const handleConfirmBooking = async () => {
    if (!pickup || !dropoff || !vehicle || !fare) {
      toast.error("Missing booking data. Please go back.");
      return;
    }

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
        paymentMethod,
        loanAmount: loanApplied ? fare.total : 0,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success(`Ride booked! ID: ${data.bookingId}`);
      router.push(`/rides/${data.bookingId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pickup || !dropoff) return null;

  const paymentLabel = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label || "Cash on Delivery";

  return (
    <>
      <div className="max-w-lg mx-auto space-y-6">
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link href="/book" className="btn btn-ghost btn-circle btn-sm">
            <MdArrowBack className="text-lg" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Confirm Booking</h1>
            <p className="text-base-content/60 text-sm">Review your trip details</p>
          </div>
        </div>

        {/* ── Trip Summary ───────────────────────────── */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body gap-4">
            <h2 className="font-semibold text-base">Trip Details</h2>

            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 mt-1">
                <MdMyLocation className="text-primary text-xl" />
                <div className="w-0.5 h-6 bg-base-300" />
                <MdLocationOn className="text-error text-xl" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">
                    Pickup
                  </p>
                  <p className="font-medium text-sm">
                    {pickup.address || "Selected location"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-base-content/50 uppercase tracking-wide">
                    Drop-off
                  </p>
                  <p className="font-medium text-sm">
                    {dropoff.address || "Selected location"}
                  </p>
                </div>
              </div>
            </div>

            <div className="divider my-0" />

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                {getVehicleIcon()}
                <p className="text-xs text-base-content/50">Vehicle</p>
                <p className="text-sm font-semibold">
                  {vehicleDef?.label || vehicle}
                </p>
              </div>
              <div className="text-center">
                <MdAccessTime className="text-2xl text-success mx-auto mb-1" />
                <p className="text-xs text-base-content/50">ETA</p>
                <p className="text-sm font-semibold">
                  {vehicleDef?.eta || "~5 min"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-base-content/50">Distance</p>
                <p className="text-2xl font-bold text-primary">
                  {distance?.toFixed(1) || "—"}
                </p>
                <p className="text-xs text-base-content/50">km</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fare Breakdown ─────────────────────────── */}
        {fare && (
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-3">
              <h2 className="font-semibold text-base">Fare Breakdown</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Base fare</span>
                  <span>Rs {fare.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">
                    Distance ({distance?.toFixed(1)} km × Rs{" "}
                    {vehicleDef?.perKm || 0})
                  </span>
                  <span>Rs {fare.distanceFare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Service fee</span>
                  <span>Rs {fare.serviceFee}</span>
                </div>
                {loanApplied && loanInterest > 0 && (
                  <div className="flex justify-between text-warning">
                    <span>Loan interest (5%)</span>
                    <span>+ Rs {loanInterest}</span>
                  </div>
                )}
                <div className="divider my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">
                    Rs {(fare.total + loanInterest).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Payment Method ─────────────────────────── */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body flex-row items-center gap-4 py-4">
            <MdPayment className="text-2xl text-primary" />
            <div className="flex-1">
              <p className="font-medium text-sm">Payment Method</p>
              <p className="text-xs text-base-content/60">{paymentLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="btn btn-ghost btn-xs"
            >
              Change
            </button>
          </div>
        </div>

        {/* ── Confirm Button ─────────────────────────── */}
        <button
          id="confirm-booking-btn"
          type="button"
          disabled={isSubmitting || !fare}
          onClick={handleConfirmBooking}
          className="btn btn-primary btn-block gap-2 shadow-md"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Booking...
            </>
          ) : (
            <>
              <MdCheckCircle className="text-lg" />
              Confirm Booking{fare ? ` — Rs ${(fare.total + loanInterest).toLocaleString()}` : ""}
            </>
          )}
        </button>
      </div>

      {/* ═══ Payment Method Modal ═══════════════════════ */}
      {showPaymentModal && (
        <div className="modal modal-open modal-bottom sm:modal-middle" style={{ zIndex: 100 }}>
          <div className="modal-box">
            <button
              type="button"
              onClick={() => setShowPaymentModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
            >
              <MdClose className="text-lg" />
            </button>
            <h3 className="font-bold text-lg mb-4">Select Payment Method</h3>

            <div className="space-y-2">
              {paymentMethods.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handlePaymentSelect(opt.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    paymentMethod === opt.type
                      ? "border-primary bg-primary/5"
                      : "border-base-200 hover:border-base-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                    {opt.type === 'cash' ? <MdAccountBalance className="text-xl text-success" /> : 
                     opt.type === 'loan' ? <MdPayment className="text-xl text-warning" /> : 
                     <MdCreditCard className="text-xl text-info" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{opt.name}</p>
                    <p className="text-xs text-base-content/50">
                      {opt.type === 'loan' ? 'Company pays now' : opt.type === 'cash' ? 'Pay driver directly' : 'Secure payment'}
                    </p>
                  </div>
                  {paymentMethod === opt.type && (
                    <MdCheckCircle className="text-primary text-xl" />
                  )}
                </button>
              ))}
            </div>

            <div className="divider" />

            <button
              type="button"
              onClick={() => {
                setShowPaymentModal(false);
                setShowAddMethodModal(true);
              }}
              className="btn btn-outline btn-primary btn-block gap-2"
            >
              <MdAdd className="text-lg" />
              Add Payment Method
            </button>
          </div>
          <div className="modal-backdrop" onClick={() => setShowPaymentModal(false)} />
        </div>
      )}

      {/* ═══ Add Payment Method Modal ═══════════════════ */}
      {showAddMethodModal && (
        <div className="modal modal-open modal-bottom sm:modal-middle" style={{ zIndex: 100 }}>
          <div className="modal-box">
            <button
              type="button"
              onClick={() => setShowAddMethodModal(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
            >
              <MdClose className="text-lg" />
            </button>
            <h3 className="font-bold text-lg mb-4">Add Payment Method</h3>

            <div className="grid grid-cols-2 gap-3">
              {ADD_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={handleAddMethod}
                  className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-base-200 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <MdPayment className={`text-3xl ${m.color}`} />
                  <span className="font-semibold text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowAddMethodModal(false)} />
        </div>
      )}
    </>
  );
}