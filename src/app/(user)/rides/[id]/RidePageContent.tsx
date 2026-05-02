"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  MdArrowBack,
  MdLocationOn,
  MdMyLocation,
  MdPhone,
  MdStar,
  MdDirectionsCar,
  MdAccessTime,
  MdAttachMoney,
  MdClose,
  MdCheckCircle,
  MdDashboard,
  MdChat,
  MdInfo,
} from "react-icons/md";
import { toast } from "sonner";
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {
  useRideTrackingStore,
  getDriverForCategory,
  type MockDriver,
  type TrackingStatus,
} from "@/store/useRideTrackingStore";

// ── Types ──────────────────────────────────────────────
interface RideData {
  id: string;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress: string;
  fare: number;
  distanceKm: number;
  durationMin: number;
  vehicleType: string;
}

// ── Live Map Component ─────────────────────────────────
function LiveRideMap({
  pickup,
  dropoff,
  driverPos,
}: {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  driverPos: { lat: number; lng: number } | null;
  status: TrackingStatus;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#2563eb",
        strokeWeight: 6,
        strokeOpacity: 0.8,
      },
    });
    setDirectionsRenderer(renderer);
    return () => renderer.setMap(null);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!routesLibrary || !directionsRenderer || !pickup || !dropoff) return;
    const service = new routesLibrary.DirectionsService();
    service.route(
      {
        origin: pickup,
        destination: dropoff,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") directionsRenderer.setDirections(result);
      }
    );
  }, [routesLibrary, directionsRenderer, pickup, dropoff]);

  return (
    <>
      <AdvancedMarker position={pickup}>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10" />
        </div>
      </AdvancedMarker>
      <AdvancedMarker position={dropoff}>
        <div className="w-5 h-5 bg-red-500 rounded-sm border-2 border-white shadow-lg rotate-45" />
      </AdvancedMarker>
      {driverPos && (
        <AdvancedMarker position={driverPos}>
          <div className="bg-white p-2 rounded-xl shadow-2xl border border-slate-100 flex items-center justify-center">
            <MdDirectionsCar className="text-blue-600 text-xl" />
          </div>
        </AdvancedMarker>
      )}
    </>
  );
}

// ── Main Component ─────────────────────────────────────
export default function RidePageContent({ ride }: { ride: RideData }) {
  const {
    status,
    driver: globalDriver,
    activeRideId,
    setActiveRide,
    setStatus: setGlobalStatus,
    setDriver: setGlobalDriver,
    clearTracking,
  } = useRideTrackingStore();

  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (activeRideId !== ride.id) {
       setActiveRide(ride.id);
       const assignedDriver = getDriverForCategory(ride.vehicleType);
       setGlobalDriver(assignedDriver);
    }
    if (globalDriver && !driverPos) {
       setDriverPos({
          lat: ride.pickupLat + 0.005,
          lng: ride.pickupLng + 0.005,
       });
    }
  }, [ride.id, ride.vehicleType, ride.pickupLat, ride.pickupLng, activeRideId, setActiveRide, setGlobalDriver, globalDriver, driverPos]);

  useEffect(() => {
    if (status === "ARRIVING" && driverPos) {
      const interval = setInterval(() => {
        setDriverPos((prev) => {
          if (!prev) return null;
          const latDiff = (ride.pickupLat - prev.lat) * 0.1;
          const lngDiff = (ride.pickupLng - prev.lng) * 0.1;
          return { lat: prev.lat + latDiff, lng: prev.lng + lngDiff };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    if (status === "IN_PROGRESS" && driverPos) {
      const interval = setInterval(() => {
        setDriverPos((prev) => {
          if (!prev) return null;
          const latDiff = (ride.dropoffLat - prev.lat) * 0.05;
          const lngDiff = (ride.dropoffLng - prev.lng) * 0.05;
          return { lat: prev.lat + latDiff, lng: prev.lng + lngDiff };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, ride.pickupLat, ride.pickupLng, ride.dropoffLat, ride.dropoffLng, driverPos]);

  const handleRating = async (stars: number) => {
    setRating(stars);
    setRatingSubmitted(true);
    try {
      await fetch(`/api/bookings/${ride.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: stars, status: "COMPLETED" }),
      });
      toast.success("Thanks for your feedback!");
    } catch {
      toast.error("Failed to save rating.");
    }
    clearTracking();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/rides" className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors">
            <MdArrowBack className="text-xl" />
          </Link>
          <div>
            <h1 className="text-[24px] font-bold text-[#111c2d]">Ride Status</h1>
            <p className="text-[12px] text-slate-500 font-mono">#{ride.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 ${
          status === "COMPLETED" ? "bg-green-100 text-green-700" : 
          status === "CANCELLED" ? "bg-red-100 text-red-700" : 
          "bg-blue-600 text-white animate-pulse"
        }`}>
          {status === "COMPLETED" || status === "CANCELLED" ? null : <span className="w-1.5 h-1.5 bg-white rounded-full" />}
          {status.replace("_", " ")}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left: Map & Timeline ──────────── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 relative">
            <Map
              defaultCenter={{ lat: ride.pickupLat, lng: ride.pickupLng }}
              defaultZoom={14}
              mapId="bf51a910020fa2c4"
              disableDefaultUI
              className="w-full h-full"
            >
              <LiveRideMap
                pickup={{ lat: ride.pickupLat, lng: ride.pickupLng }}
                dropoff={{ lat: ride.dropoffLat, lng: ride.dropoffLng }}
                driverPos={driverPos}
                status={status}
              />
            </Map>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <div className="w-0.5 h-12 bg-slate-100" />
                <div className="w-3 h-3 rounded-sm bg-red-500" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup</p>
                  <p className="text-[14px] font-semibold text-[#111c2d] leading-tight">{ride.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Destination</p>
                  <p className="text-[14px] font-semibold text-[#111c2d] leading-tight">{ride.dropoffAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Driver & Stats ──────────── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Driver Card */}
          {globalDriver ? (
            <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20">
                  {globalDriver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[18px] font-bold text-[#111c2d]">{globalDriver.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
                      <MdStar /> {globalDriver.rating}
                    </div>
                  </div>
                  <p className="text-[14px] text-slate-400">{globalDriver.vehicle} · <span className="font-mono font-bold text-slate-600">{globalDriver.plate}</span></p>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={`tel:${globalDriver.phone}`} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  <MdPhone className="text-lg" /> Call Driver
                </a>
                <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[14px] border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                  <MdChat className="text-lg" /> Chat
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 font-bold">Connecting with drivers...</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdAccessTime className="text-blue-600 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ETA</p>
              <p className="text-[16px] font-black text-[#111c2d]">{status === "COMPLETED" ? "--" : `${Math.round(ride.durationMin)}m`}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdAttachMoney className="text-green-500 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fare</p>
              <p className="text-[16px] font-black text-[#111c2d]">PKR {Math.round(ride.fare)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdMyLocation className="text-red-500 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KM</p>
              <p className="text-[16px] font-black text-[#111c2d]">{ride.distanceKm.toFixed(1)}</p>
            </div>
          </div>

          {/* Completion UI */}
          {status === "COMPLETED" && (
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <MdCheckCircle className="text-6xl text-blue-600 mx-auto" />
              <div>
                <h3 className="text-[24px] font-black text-blue-900 leading-tight">Journey Complete!</h3>
                <p className="text-[14px] text-blue-700/70 mt-2">Rate your ride with {globalDriver?.name}</p>
              </div>
              
              {!ratingSubmitted ? (
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => handleRating(s)} className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all ${rating >= s ? "text-orange-500" : "text-slate-300 hover:text-orange-300"}`} onMouseEnter={() => setRating(s)} onMouseLeave={() => setRating(0)}>
                      <MdStar />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1 text-orange-500 text-2xl">
                    {[1, 2, 3, 4, 5].map((s) => <MdStar key={s} className={s <= rating ? "" : "opacity-20"} />)}
                  </div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Feedback Saved</p>
                </div>
              )}
              
              <Link href="/dashboard" className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-[16px] shadow-lg shadow-blue-600/20">
                Back to Dashboard
              </Link>
            </div>
          )}

          {/* Cancel Button */}
          {status !== "COMPLETED" && status !== "CANCELLED" && (
            <button
              onClick={() => { if (confirm("Cancel this ride?")) { setGlobalStatus("CANCELLED"); clearTracking(); } }}
              disabled={["IN_PROGRESS", "ARRIVED"].includes(status)}
              className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-red-200 hover:text-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MdClose /> Cancel Ride
            </button>
          )}

          {status === "CANCELLED" && (
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100 text-center space-y-4">
              <MdClose className="text-4xl text-red-500 mx-auto" />
              <p className="font-bold text-red-900">Ride Cancelled</p>
              <Link href="/book" className="inline-block px-6 py-2 bg-red-500 text-white rounded-lg font-bold text-sm">Book Again</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
