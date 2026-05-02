"use client";

import { useEffect, useState, useMemo } from "react";
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { MdMyLocation, MdAddCircleOutline, MdRemoveCircleOutline } from "react-icons/md";
import { useDriverStore } from "@/store/useDriverStore";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";
import { toast } from "sonner";

const DEFAULT_CENTER = { lat: 24.8607, lng: 67.0011 }; // Karachi default

export default function DriverMapPanel() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(13);
  const [locationAcquired, setLocationAcquired] = useState(false);
  
  const { incomingRides, declineRide } = useDriverStore();
  const { setActiveRide } = useRideTrackingStore();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const newestRide = useMemo(() => incomingRides[0], [incomingRides]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationAcquired(true);
      },
      () => {
        setLocationAcquired(false);
      }
    );
  }, []);

  const handleAccept = async (rideId: string) => {
    setAcceptingId(rideId);
    try {
      const res = await fetch("/api/driver/accept-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Ride accepted! Starting navigation...", { icon: "🚗" });
        setActiveRide(rideId);
      } else {
        toast.error(data.error || "Failed to accept ride");
      }
    } catch {
      toast.error("Connection error");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          center={center}
          zoom={zoom}
          mapId="driver-dashboard-map"
          disableDefaultUI
          style={{ width: "100%", height: "100%" }}
          gestureHandling="greedy"
        >
          {/* Driver position marker */}
          <AdvancedMarker position={center}>
            <Pin
              background="#004ac6"
              borderColor="#0036a0"
              glyphColor="#ffffff"
            />
          </AdvancedMarker>

          {/* Incoming ride markers (optional, but good for context) */}
          {newestRide && (
            <AdvancedMarker position={{ lat: newestRide.pickupLat, lng: newestRide.pickupLng }}>
               <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                  <span className="material-symbols-outlined text-white text-sm">my_location</span>
               </div>
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>

      {/* Floating overlay: status badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-base-100/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-base-200 shadow-sm">
          <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Live Location</p>
          <p className="text-sm font-bold text-base-content">
            {locationAcquired ? "GPS Acquired" : "Default Location"}
          </p>
        </div>
      </div>

      {/* NEW RIDE REQUEST CARD (Floating element in bottom-left corner) */}
      {newestRide && (
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-96 bg-white/95 backdrop-blur-md rounded-xl p-5 shadow-[0_20px_50px_rgba(37,99,235,0.15)] border border-blue-100/50 z-20 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">New Ride Request</span>
              <h3 className="font-bold text-slate-800 mt-1 truncate max-w-[200px]">Ride to {newestRide.dropoffAddress.split(',')[0]}</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-600">PKR {Math.round(newestRide.fare)}</span>
              <p className="text-xs text-slate-400">Est. 14 mins</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-500 text-sm">my_location</span>
              <span className="text-sm font-medium text-slate-600 truncate">{newestRide.pickupAddress}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400 text-sm">location_on</span>
              <span className="text-sm font-medium text-slate-600 truncate">{newestRide.dropoffAddress}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => declineRide(newestRide.id)}
              className="py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Decline
            </button>
            <button 
              onClick={() => handleAccept(newestRide.id)}
              disabled={!!acceptingId}
              className={`py-3 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 ${acceptingId ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {acceptingId ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Accepting...
                </>
              ) : (
                'Accept Ride'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Map zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(z + 1, 20))}
          className="w-10 h-10 bg-base-100 rounded-xl border border-base-200 shadow-md flex items-center justify-center text-base-content/60 hover:text-primary transition-colors"
          aria-label="Zoom in"
        >
          <MdAddCircleOutline className="text-xl" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 1, 3))}
          className="w-10 h-10 bg-base-100 rounded-xl border border-base-200 shadow-md flex items-center justify-center text-base-content/60 hover:text-primary transition-colors"
          aria-label="Zoom out"
        >
          <MdRemoveCircleOutline className="text-xl" />
        </button>
        <button
          onClick={() => {
            navigator.geolocation?.getCurrentPosition((p) =>
              setCenter({ lat: p.coords.latitude, lng: p.coords.longitude })
            );
          }}
          className="w-10 h-10 bg-base-100 rounded-xl border border-base-200 shadow-md flex items-center justify-center text-base-content/60 hover:text-primary transition-colors"
          aria-label="My location"
        >
          <MdMyLocation className="text-xl" />
        </button>
      </div>
    </div>
  );
}
