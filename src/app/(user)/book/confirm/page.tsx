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
} from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa6";
import { toast } from "sonner";
import {
  useBookingStore,
  computeFare,
  VEHICLES,
  type VehicleCategory,
} from "@/store/useBookingStore";

export default function BookConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleParam = searchParams.get("vehicle") as VehicleCategory | null;

  const { pickup, dropoff, distance, duration, selectedVehicle, setSelectedVehicle } =
    useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        fare: fare.total,
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
      // DO NOT reset yet, wait for navigation
      router.push(`/rides/${data.bookingId}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pickup || !dropoff) return null;

  return (
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
              <div className="divider my-1" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">Rs {fare.total}</span>
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
            <p className="text-xs text-base-content/60">Cash on delivery</p>
          </div>
          <Link href="/payment" className="btn btn-ghost btn-xs">
            Change
          </Link>
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
            Confirm Booking{fare ? ` — Rs ${fare.total}` : ""}
          </>
        )}
      </button>
    </div>
  );
}
