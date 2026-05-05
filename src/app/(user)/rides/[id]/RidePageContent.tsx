"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MdArrowBack,
  MdMyLocation,
  MdPhone,
  MdStar,
  MdDirectionsCar,
  MdAccessTime,
  MdAttachMoney,
  MdClose,
  MdCheckCircle,
  MdChat,
} from "react-icons/md";
import { toast } from "sonner";
import {
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useRideStore } from "@/store/useRideStore";
import { api } from "@/lib/api";
import { useSocket } from "@/hooks/useSocket";
import {
  getDeterministicDemoDriver,
  useRideTrackingStore,
} from "@/store/useRideTrackingStore";

const DEMO_CONNECT_MS = 3200;
const DEMO_DRIVER_NOTE =
  "Demo mode: this profile simulates a matched driver for your audience.";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function animateLatLng(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  durationMs: number,
  onStep: (pos: { lat: number; lng: number }) => void,
  cancelled: () => boolean
) {
  const start = performance.now();
  return new Promise<void>((resolve) => {
    function frame(now: number) {
      if (cancelled()) return resolve();
      const t = Math.min(1, (now - start) / durationMs);
      onStep({
        lat: from.lat + (to.lat - from.lat) * t,
        lng: from.lng + (to.lng - from.lng) * t,
      });
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

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
  status: string;
  driverId?: string | null;
  driver?: any;
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
export function RidePageContent({ ride }: { ride: RideData }) {
  const { setStatus: setRideStoreStatus, setRide } = useRideStore();
  const { socket } = useSocket();

  const [localDemoDriver, setLocalDemoDriver] = useState<any>(null);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);
  const demoTripStartedRef = useRef(false);

  const displayDriver = ride.driver ?? localDemoDriver;
  const displayStatus = (ride.driver ? ride.status : demoStatus ?? ride.status) as string;

  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    demoTripStartedRef.current = false;
  }, [ride.id]);

  useEffect(() => {
    setRide(ride);
  }, [ride, setRide]);

  useEffect(() => {
    setRideStoreStatus(displayStatus as any);
  }, [displayStatus, setRideStoreStatus]);

  /** Passenger demo: no server-assigned driver yet → show connecting, then mock driver + trip simulation */
  useEffect(() => {
    if (ride.driver) return;
    if (!["PENDING", "SEARCHING"].includes(ride.status)) return;

    const timer = window.setTimeout(() => {
      const mock = getDeterministicDemoDriver(ride.id, ride.vehicleType);
      const ui = {
        id: "demo-driver",
        name: mock.name,
        rating: mock.rating,
        phone: mock.phone,
        isDemo: true,
        vehicleDisplay: mock.vehicle,
        plate: mock.plate,
      };
      setLocalDemoDriver(ui);
      setDemoStatus("ACCEPTED");
      useRideTrackingStore.getState().setDriver(mock);
      useRideTrackingStore.getState().setStatus("ACCEPTED");
      toast.success(`${mock.name} is your driver`, {
        description: DEMO_DRIVER_NOTE,
      });
      window.setTimeout(() => {
        setDemoStatus("ARRIVING");
        useRideTrackingStore.getState().setStatus("ARRIVING");
      }, 700);
    }, DEMO_CONNECT_MS);

    return () => window.clearTimeout(timer);
  }, [ride.id, ride.driver, ride.status, ride.vehicleType]);

  /** Animate demo vehicle: toward pickup → trip → completed */
  useEffect(() => {
    if (!localDemoDriver?.isDemo || ride.driver || demoTripStartedRef.current) return;
    demoTripStartedRef.current = true;

    let cancelled = false;
    const isCancelled = () => cancelled;

    const pickup = { lat: ride.pickupLat, lng: ride.pickupLng };
    const dropoff = { lat: ride.dropoffLat, lng: ride.dropoffLng };

    const run = async () => {
      await sleep(400);
      const angle = (ride.id.charCodeAt(0) % 360) * (Math.PI / 180);
      const km = 1.2;
      const dLat = (km / 111) * Math.cos(angle);
      const dLng = (km / (111 * Math.cos((pickup.lat * Math.PI) / 180))) * Math.sin(angle);
      const from = { lat: pickup.lat + dLat, lng: pickup.lng + dLng };

      setDriverPos(from);
      await animateLatLng(from, pickup, 6800, setDriverPos, isCancelled);
      if (cancelled) return;

      setDemoStatus("IN_PROGRESS");
      useRideTrackingStore.getState().setStatus("IN_PROGRESS");
      toast.info("Trip started — heading to destination");

      const tripMs = Math.min(
        20000,
        Math.max(7000, (ride.distanceKm || 6) * 200)
      );
      await animateLatLng(pickup, dropoff, tripMs, setDriverPos, isCancelled);
      if (cancelled) return;

      setDemoStatus("COMPLETED");
      useRideTrackingStore.getState().setStatus("COMPLETED");
      toast.success("You’ve arrived — thanks for riding with Skyline Hub!");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [
    localDemoDriver?.isDemo,
    ride.driver,
    ride.id,
    ride.pickupLat,
    ride.pickupLng,
    ride.dropoffLat,
    ride.dropoffLng,
    ride.distanceKm,
  ]);

  useEffect(() => {
    if (!socket || !ride?.id) return;
    socket.emit("join:ride", ride.id);
  }, [socket, ride?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (data: {
      rideId?: string;
      lat: number;
      lng: number;
    }) => {
      if (data.rideId && data.rideId !== ride.id) return;
      if (localDemoDriver?.isDemo) return;
      setDriverPos({ lat: data.lat, lng: data.lng });
    };

    socket.on("location:updated", handleLocationUpdate);

    return () => {
      socket.off("location:updated", handleLocationUpdate);
    };
  }, [socket, ride.id, localDemoDriver?.isDemo]);

  const handleRating = async (stars: number) => {
    const isDemoPassengerRide =
      !ride.driverId && Boolean(displayDriver?.isDemo);

    if (isDemoPassengerRide) {
      setRating(stars);
      setRatingSubmitted(true);
      toast.success("Thanks for your feedback!", {
        description: "Demo mode — review is shown locally only.",
      });
      return;
    }

    try {
      await api.post(`/rides/${ride.id}/review`, {
        rating: stars,
        comment: "Great ride!",
      });
      setRating(stars);
      setRatingSubmitted(true);
      toast.success("Thanks for your feedback!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const telHref = displayDriver?.phone
    ? `tel:${String(displayDriver.phone).replace(/\s/g, "")}`
    : undefined;

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
          displayStatus === "COMPLETED" ? "bg-green-100 text-green-700" : 
          displayStatus === "CANCELLED" ? "bg-red-100 text-red-700" : 
          "bg-blue-600 text-white animate-pulse"
        }`}>
          {displayStatus === "COMPLETED" || displayStatus === "CANCELLED" ? null : <span className="w-1.5 h-1.5 bg-white rounded-full" />}
          {displayStatus.replace("_", " ")}
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
          {displayDriver ? (
            <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 space-y-6">
              {displayDriver.isDemo && (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  <MdDirectionsCar className="text-lg shrink-0" />
                  Demo driver — for showcase only
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20">
                  {displayDriver.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[18px] font-bold text-[#111c2d] truncate">{displayDriver.name}</h3>
                    <div className="flex items-center gap-1 text-orange-500 font-bold text-sm shrink-0">
                      <MdStar /> {displayDriver.rating ?? 4.9}
                    </div>
                  </div>
                  <p className="text-[14px] text-slate-400 truncate">
                    {displayDriver.vehicleDisplay
                      ? `${displayDriver.vehicleDisplay} · `
                      : displayDriver.vehicleMake
                        ? `${displayDriver.vehicleMake} ${displayDriver.vehicleModel || ""} · `
                        : ""}
                    <span className="font-mono font-bold text-slate-600">
                      {displayDriver.plate || displayDriver.vehiclePlate || "—"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={telHref || "#"}
                  onClick={(e) => {
                    if (!telHref) {
                      e.preventDefault();
                      toast.message("Demo phone", {
                        description: "Use a real booking to call your assigned driver.",
                      });
                    }
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MdPhone className="text-lg" /> Call Driver
                </a>
                <button
                  type="button"
                  onClick={() =>
                    toast.message("Chat", {
                      description: `Messaging ${displayDriver.name} (demo — messages are not delivered).`,
                    })
                  }
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-[14px] border border-slate-100 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                >
                  <MdChat className="text-lg" /> Chat
                </button>
              </div>
              {displayDriver.isDemo && (
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Trip shared (demo)", {
                      description:
                        "In production, contacts receive your live trip link.",
                    })
                  }
                  className="w-full py-2.5 text-[13px] font-bold text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-50/80 transition-colors"
                >
                  Share trip status
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-10 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-slate-600 font-bold">Connecting with driver...</p>
              <p className="text-[13px] text-slate-400 max-w-xs mx-auto leading-snug">
                We&apos;re matching you with the nearest available driver for your route.
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdAccessTime className="text-blue-600 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ETA</p>
              <p className="text-[16px] font-black text-[#111c2d]">{displayStatus === "COMPLETED" ? "--" : `${Math.round(ride.durationMin || 10)}m`}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdAttachMoney className="text-green-500 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fare</p>
              <p className="text-[16px] font-black text-[#111c2d]">PKR {Math.round(ride.fare)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-50 shadow-sm text-center">
              <MdMyLocation className="text-red-500 text-xl mx-auto mb-2" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">KM</p>
              <p className="text-[16px] font-black text-[#111c2d]">{(ride.distanceKm || 5).toFixed(1)}</p>
            </div>
          </div>

          {/* Completion UI */}
          {displayStatus === "COMPLETED" && (
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center space-y-6">
              <MdCheckCircle className="text-6xl text-blue-600 mx-auto" />
              <div>
                <h3 className="text-[24px] font-black text-blue-900 leading-tight">Journey Complete!</h3>
                <p className="text-[14px] text-blue-700/70 mt-2">Rate your ride with {displayDriver?.name || "your driver"}</p>
              </div>
              
              {!ratingSubmitted ? (
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => handleRating(s)} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all ${rating >= s ? "text-orange-500" : "text-slate-300 hover:text-orange-300"}`} 
                      onMouseEnter={() => setRating(s)} 
                      onMouseLeave={() => setRating(0)}
                    >
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
          {displayStatus !== "COMPLETED" && displayStatus !== "CANCELLED" && (
            <button
              onClick={async () => {
                if (confirm("Cancel this ride?")) {
                  try {
                    await api.post(`/rides/${ride.id}/cancel`);
                    setDemoStatus("CANCELLED");
                    useRideTrackingStore.getState().setStatus("CANCELLED");
                    setRideStoreStatus("CANCELLED");
                    toast.success("Ride cancelled");
                  } catch (err: any) {
                    toast.error(err.message);
                  }
                }
              }}
              disabled={["IN_PROGRESS", "ARRIVING"].includes(displayStatus)}
              className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold rounded-2xl hover:border-red-200 hover:text-red-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MdClose /> Cancel Ride
            </button>
          )}

          {displayStatus === "CANCELLED" && (
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
