// src/app/(user)/book/page.tsx
"use client";

import {
  MdMyLocation,
  MdLocationOn,
  MdDirectionsCar,
  MdElectricCar,
  MdArrowForward,
  MdGpsFixed,
} from "react-icons/md";
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

    const geocoder = new (window as any).google.maps.Geocoder();
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
  }, [liveLocation?.lat, liveLocation?.lng]);

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

    try {
      const geocoder = new (window as any).google.maps.Geocoder();
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
      (pos) => {
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
      case "electric": return <MdElectricCar className="text-success" />;
      case "moto": return <FaMotorcycle className="text-warning" />;
      default: return <MdDirectionsCar />;
    }
  };

  const pacStyles = {
    "--pac-font-family": "inherit",
    "--pac-font-size": "0.875rem",
    "--pac-icon-display": "none",
    "--pac-border": "none",
    "--pac-box-shadow": "none",
    "--pac-color": "var(--color-base-content)",
    "--pac-container-background-color": "transparent",
    "--pac-padding": "0",
  } as React.CSSProperties;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <style>{`
        gmp-place-autocomplete::part(search-icon) { display: none !important; }
        gmp-place-autocomplete::part(input) { padding-left: 0 !important; }
      `}</style>

      <div>
        <h1 className="text-2xl font-bold">Book a Ride</h1>
        <p className="text-base-content/60 mt-1">Enter your pickup and destination</p>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-sm relative overflow-visible">
        <div className="card-body gap-5 p-4">
          <div className="form-control">
            <label className="label pb-1 px-1">
              <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Pickup Location</span>
            </label>
            <div className="flex items-center gap-2 h-13">
              <div className="flex items-center gap-3 bg-base-200/50 hover:bg-base-200 focus-within:bg-base-200 rounded-xl px-3 border border-base-200 relative grow h-full">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MdMyLocation className="text-primary text-xl" />
                </div>
                <div ref={pickupRef} className="grow w-full relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
              </div>
              <button type="button" onClick={handleRefreshLocation} disabled={isLocating} className="btn btn-square btn-ghost border border-base-200 rounded-xl h-full w-13 tooltip tooltip-bottom" data-tip="Refresh GPS">
                {isLocating ? <span className="loading loading-spinner loading-xs" /> : <MdGpsFixed className="text-xl text-success" />}
              </button>
            </div>
            {liveLocation?.address && liveLocation.address !== "Detecting address..." && (
              <div className="flex items-center justify-between mt-1.5 pl-1">
                <p className="text-xs text-base-content/50 flex items-center gap-1 truncate max-w-[80%]">
                  <span className="w-2 h-2 bg-blue-500 rounded-full inline-block animate-pulse shrink-0" />
                  {liveLocation.address}
                </p>
                <button type="button" onClick={() => { setPickup(liveLocation); if (pickupAutocompleteRef.current) pickupAutocompleteRef.current.value = liveLocation.address; if (map) map.panTo({ lat: liveLocation.lat, lng: liveLocation.lng }); toast.success("Pickup set to live location"); }} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tight shrink-0">
                  Use as Pickup
                </button>
              </div>
            )}
          </div>

          <div className="form-control">
            <label className="label pb-1 px-1">
              <span className="label-text font-semibold text-xs uppercase tracking-wider text-base-content/70">Drop-off Location</span>
            </label>
            <div className="flex items-center gap-3 bg-base-200/50 hover:bg-base-200 rounded-xl px-3 border border-base-200 h-13">
              <div className="bg-error/10 p-2 rounded-lg">
                <MdLocationOn className="text-error text-xl" />
              </div>
              <div ref={dropoffRef} onBlur={() => handleManualGeocode("dropoff")} className="grow w-full relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-base-200 bg-base-200/50 h-80 flex items-center justify-center relative overflow-hidden">
        <BookRide />
      </div>

      {distance && duration && (
        <div className="flex items-center gap-4 px-1">
          <div className="badge badge-primary badge-outline gap-1">{distance.toFixed(1)} km</div>
          <div className="badge badge-ghost gap-1">~{Math.round(duration)} min</div>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold mb-3">Choose Your Ride</h2>
        {!dropoff ? (
          <div className="text-center py-10 bg-base-200/30 rounded-2xl border border-dashed border-base-300">
            <p className="text-base-content/40 text-sm">Select locations to see fare estimates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {VEHICLES.map((v) => {
              const vFare = distance ? computeFare(v.id, distance) : null;
              const isSelected = selectedVehicle === v.id;
              return (
                <div key={v.id} onClick={() => setSelectedVehicle(v.id)} className={`relative group cursor-pointer transition-all duration-300 ${isSelected ? "scale-[1.01]" : "hover:scale-[1.005]"}`}>
                  <div className={`card border-2 transition-all duration-300 shadow-sm ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-base-200 bg-base-100 hover:border-base-300"}`}>
                    <div className="card-body flex-row items-center gap-4 py-3.5 px-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-colors duration-300 ${isSelected ? "bg-primary text-white" : "bg-base-200 text-base-content/70 group-hover:bg-base-300"}`}>
                        {vehicleIcon(v.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm tracking-tight">{v.label}</p>
                          {v.id === "comfort" && <span className="badge badge-xs badge-success text-[8px] font-bold">TOP RATED</span>}
                        </div>
                        <p className="text-[11px] text-base-content/60 truncate">{v.description} • {v.eta}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {vFare ? (
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-base-content/40 font-medium leading-none mb-1">Total PKR</span>
                            <span className="text-lg font-black text-primary leading-none">{vFare.total.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="loading loading-dots loading-xs text-base-content/20" />
                        )}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute -right-1 -top-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-base-100 animate-in zoom-in-50 duration-300">
                      <MdArrowForward className="text-[10px] -rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button disabled={!selectedVehicle || !pickup || !dropoff} onClick={handleBookingTransition} className="btn btn-primary btn-block gap-2 shadow-md">
        {fare ? `Confirm ${selectedVehicle === "moto" ? "Motorbike" : selectedVehicle === "comfort" ? "Comfort" : "Economy"} — Rs ${fare.total}` : "Confirm Booking"}
        <MdArrowForward className="text-lg" />
      </button>
    </div>
  );
}