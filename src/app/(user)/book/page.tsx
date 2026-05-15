// src/app/(user)/book/page.tsx
"use client";

import {
  MdMyLocation,
  MdLocationOn,
  MdDirectionsCar,
  MdElectricCar,
  MdArrowForward,
  MdGpsFixed,
  MdInfo,
  MdSchedule
} from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa6";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import BookRide from "@/components/ui/google/js-google";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  useBookingStore,
  VEHICLES,
  computeFare,
} from "@/store/useBookingStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const router = useRouter();
  const places = useMapsLibrary("places");
  const map = useMap();

  const {
    pickup,
    dropoff,
    liveLocation,
    distance,
    duration,
    selectedVehicle,
    setPickup,
    setDropoff,
    setLiveLocation,
    setSelectedVehicle,
  } = useBookingStore();

  const [isLocating, setIsLocating] = useState(false);
  const watchId = useRef<number | null>(null);

  const pickupRef = useRef<HTMLDivElement | null>(null);
  const dropoffRef = useRef<HTMLDivElement | null>(null);
  const pickupAutocompleteRef = useRef<any>(null);
  const dropoffAutocompleteRef = useRef<any>(null);

  // ── Live Location Watcher ───────────────────────────
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        const currentLive = useBookingStore.getState().liveLocation;
        setLiveLocation({
          ...coords,
          address: currentLive?.address || "Detecting address...",
        });
      },
      (error) => {
        if (error.code === 2 || error.code === 3) return;
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access denied. Please enable it in settings.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [setLiveLocation]);

  // ── Reverse geocode live location for label ─────────
  useEffect(() => {
    if (!liveLocation || liveLocation.address !== "Detecting address...") return;
    if (!places || !window.google || !window.google.maps || !window.google.maps.Geocoder) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: liveLocation.lat, lng: liveLocation.lng } },
      (results: any, status: any) => {
        if (status === "OK" && results?.[0]) {
          setLiveLocation({
            ...liveLocation,
            address: results[0].formatted_address,
          });
        }
      }
    );
  }, [liveLocation?.lat, liveLocation?.lng, places]);

  // ── Auto-set pickup from GPS on first load ──────────
  useEffect(() => {
    if (!liveLocation || pickup) return;
    setPickup({
      lat: liveLocation.lat,
      lng: liveLocation.lng,
      address: liveLocation.address,
    });
  }, [liveLocation, pickup, setPickup]);

  // ── Autocomplete setup ──────────────────────────────
  useEffect(() => {
    if (!places || !pickupRef.current || !dropoffRef.current) return;

    if (!pickupAutocompleteRef.current && (places as any).PlaceAutocompleteElement) {
      pickupAutocompleteRef.current = new (places as any).PlaceAutocompleteElement(
        { componentRestrictions: { country: "pk" } }
      );
      pickupRef.current.appendChild(pickupAutocompleteRef.current);
      if (pickup?.address) pickupAutocompleteRef.current.value = pickup.address;

      pickupAutocompleteRef.current.addEventListener("gmp-placeselect", (e: any) => {
        const place = e.place;
        if (place.location) {
          setPickup({
            lat: place.location.lat(),
            lng: place.location.lng(),
            address: place.formattedAddress,
          });
          if (map) map.panTo(place.location);
        }
      });
    }

    if (!dropoffAutocompleteRef.current && (places as any).PlaceAutocompleteElement) {
      dropoffAutocompleteRef.current = new (places as any).PlaceAutocompleteElement(
        { componentRestrictions: { country: "pk" } }
      );
      dropoffRef.current.appendChild(dropoffAutocompleteRef.current);
      if (dropoff?.address) dropoffAutocompleteRef.current.value = dropoff.address;

      dropoffAutocompleteRef.current.addEventListener("gmp-placeselect", (e: any) => {
        const place = e.place;
        if (place.location) {
          setDropoff({
            lat: place.location.lat(),
            lng: place.location.lng(),
            address: place.formattedAddress,
          });
        }
      });
    }
  }, [places, map, setPickup, setDropoff, pickup?.address, dropoff?.address]);

  // ── Fallback Geocoding for Manual Entry ─────────────
  const handleManualGeocode = async (type: "pickup" | "dropoff") => {
    const ref = type === "pickup" ? pickupAutocompleteRef : dropoffAutocompleteRef;
    const value = ref.current?.value;
    if (!value || (type === "pickup" ? pickup : dropoff)) return;
    if (!places || !window.google || !window.google.maps || !window.google.maps.Geocoder) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise<any[]>((resolve, reject) => {
        geocoder.geocode(
          { address: value, componentRestrictions: { country: "pk" } },
          (results: any, status: any) => {
            if (status === "OK" && results) resolve(results);
            else reject(new Error(status));
          }
        );
      });

      if (response[0]) {
        const { lat, lng } = response[0].geometry.location;
        const loc = { lat: lat(), lng: lng(), address: response[0].formatted_address };
        if (type === "pickup") setPickup(loc);
        else setDropoff(loc);
        if (map) map.panTo({ lat: lat(), lng: lng() });
      }
    } catch (err) {
      console.error("Manual geocoding failed:", err);
    }
  };

  // ── "Use My Location" handler ───────────────────────
  const handleRefreshLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos: any) => {
        const { latitude, longitude } = pos.coords;
        setLiveLocation({ lat: latitude, lng: longitude, address: "Detecting address..." });
        if (map) map.panTo({ lat: latitude, lng: longitude });
        setIsLocating(false);
        toast.success("Location updated");
      },
      () => {
        setIsLocating(false);
        toast.error("Could not refresh location");
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  // ── Computed fare ────────────────────────────────────
  const fare = useMemo(() => {
    if (!selectedVehicle || !distance) return null;
    return computeFare(selectedVehicle, distance);
  }, [selectedVehicle, distance]);

  // ── Confirm Booking ──────────────────────────────────
  const handleBookingTransition = () => {
    if (!selectedVehicle || !pickup || !dropoff) {
      toast.error("Please select locations and a vehicle");
      return;
    }
    if (!distance) {
      toast.error("Route not yet calculated. Please wait.");
      return;
    }
    router.push(`/book/confirm?vehicle=${selectedVehicle}`);
  };

  // ── Icon helper ─────────────────────────────────────
  const vehicleIcon = (icon: string) => {
    switch (icon) {
      case "car": return <MdDirectionsCar />;
      case "electric": return <MdElectricCar />;
      case "moto": return <FaMotorcycle />;
      default: return <MdDirectionsCar />;
    }
  };

  const pacStyles = {
    "--pac-font-family": "inherit",
    "--pac-font-size": "1rem",
    "--pac-icon-display": "none",
    "--pac-border": "none",
    "--pac-box-shadow": "none",
    "--pac-color": "#111c2d",
    "--pac-container-background-color": "transparent",
    "--pac-padding": "0",
  } as React.CSSProperties;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <style>{`
        gmp-place-autocomplete::part(search-icon) { display: none !important; }
        gmp-place-autocomplete::part(input) { 
          padding-left: 0 !important; 
          font-weight: 600;
          color: #111c2d;
        }
      `}</style>

      <div className="text-center space-y-2">
        <h1 className="text-[48px] font-bold tracking-tight text-[#111c2d]">Book a Ride</h1>
        <p className="text-[18px] text-slate-500">Fast, secure, and reliable travel at your fingertips.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left: Location Inputs ──────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 space-y-6">
            
            {/* Pickup */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Pickup Location</label>
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <MdMyLocation className="text-lg" />
                </div>
                <div className="flex-1">
                  <div ref={pickupRef} className="relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
                </div>
                <button onClick={handleRefreshLocation} disabled={isLocating} className="p-2 hover:bg-white rounded-lg transition-colors text-green-500">
                  {isLocating ? <span className="loading loading-spinner loading-xs" /> : <MdGpsFixed className="text-lg" />}
                </button>
              </div>
              {liveLocation?.address && liveLocation.address !== "Detecting address..." && (
                <button onClick={() => { setPickup(liveLocation); if (pickupAutocompleteRef.current) pickupAutocompleteRef.current.value = liveLocation.address; if (map) map.panTo({ lat: liveLocation.lat, lng: liveLocation.lng }); toast.success("Pickup set to live location"); }} className="text-[11px] font-bold text-blue-600 px-1 hover:underline">
                  Use current location
                </button>
              )}
            </div>

            {/* Dropoff */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Drop-off Destination</label>
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                  <MdLocationOn className="text-lg" />
                </div>
                <div className="flex-1">
                  <div ref={dropoffRef} onBlur={() => handleManualGeocode("dropoff")} className="relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
                </div>
              </div>
            </div>

            {distance && duration && (
              <div className="p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]"><GiPathDistance /></span>
                  <span className="text-[14px] font-bold text-blue-700">{distance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-[20px]"><MdSchedule /></span>
                  <span className="text-[14px] font-bold">~{Math.round(duration)} mins</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface-container p-6 rounded-2xl flex gap-4">
            <MdInfo className="text-blue-600 text-2xl shrink-0 mt-1" />
            <div>
              <h4 className="text-[14px] font-bold text-blue-700 mb-1">Travel Tip</h4>
              <p className="text-[12px] text-on-secondary-container leading-relaxed">
                Save your home and work addresses in <span className="font-bold underline cursor-pointer" onClick={() => router.push('/saved-places')}>Saved Places</span> for even faster bookings next time.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Map & Vehicle Selection ──────── */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50 h-[350px] relative">
            <BookRide />
          </div>

          <div className="space-y-4">
            <h3 className="text-[18px] font-bold text-[#111c2d] px-1">Choose Your Vehicle</h3>
            
            {!dropoff ? (
              <div className="bg-white border-2 border-dashed border-slate-100 rounded-2xl p-12 text-center">
                <MdDirectionsCar className="text-5xl text-slate-100 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Select a destination to see fares</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {VEHICLES.map((v: any) => {
                  const vFare = distance ? computeFare(v.id, distance) : null;
                  const isSelected = selectedVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected 
                          ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-600/5" 
                          : "border-slate-50 bg-white hover:border-blue-100"
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl transition-colors ${
                        isSelected ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400"
                      }`}>
                        {vehicleIcon(v.icon)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-bold text-[#111c2d]">{v.label}</span>
                          {v.id === "comfort" && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">TOP RATED</span>}
                        </div>
                        <p className="text-[12px] text-slate-400 truncate">{v.description} · {v.eta}</p>
                      </div>

                      <div className="text-right">
                        {vFare ? (
                          <>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p>
                            <p className="text-[20px] font-black text-blue-600 leading-none mt-1">PKR {vFare.total.toLocaleString()}</p>
                          </>
                        ) : (
                          <span className="loading loading-dots loading-sm text-blue-200" />
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute -right-2 -top-2 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <MdArrowForward className="text-sm" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            disabled={!selectedVehicle || !pickup || !dropoff || !distance}
            onClick={handleBookingTransition}
            className="w-full py-5 bg-blue-600 text-white font-bold text-[18px] rounded-2xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fare ? `Book ${selectedVehicle?.charAt(0).toUpperCase()}${selectedVehicle?.slice(1)} • PKR ${Math.round(fare.total).toLocaleString()}` : "Confirm Booking"}
            <MdArrowForward className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}