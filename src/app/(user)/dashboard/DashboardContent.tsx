"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MdDirectionsCar,
  MdGpsFixed,
  MdLocationOn,
  MdMyLocation,
  MdStar,
  MdPayment,
  MdHistory,
  MdElectricBike,
  MdAirlineSeatReclineNormal,
  MdArrowForward,
  MdBookmark,
  MdWork,
} from "react-icons/md";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useRideTrackingStore } from "@/store/useRideTrackingStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useBookingStore } from "@/store/useBookingStore";
import { toast } from "sonner";
import {
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";

interface Ride {
  id: string;
  fare: number | null;
  rating: number | null;
  status: string;
  vehicleType: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  createdAt: Date | string;
}

interface DashboardContentProps {
  firstName: string;
  initialRides: Ride[];
}

const vehicleOptions = [
  { id: "moto", label: "Bike", icon: MdElectricBike, price: "PKR 80+" },
  { id: "economy", label: "Economy", icon: MdDirectionsCar, price: "PKR 200+" },
  { id: "comfort", label: "Comfort", icon: MdAirlineSeatReclineNormal, price: "PKR 350+" },
];

const paymentMethods = [
  { id: "cash", label: "Cash", sub: "Pay on arrival" },
  { id: "card", label: "Card", sub: "Visa •••• 4242" },
  { id: "loan", label: "Skyline Loan", sub: "Buy Now, Pay Later" },
];

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
  PENDING: "bg-yellow-50 text-yellow-700",
  SEARCHING: "bg-blue-50 text-blue-600",
  ACCEPTED: "bg-blue-50 text-blue-600",
  ARRIVING: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-purple-50 text-purple-600",
};

export function DashboardContent({ firstName, initialRides }: DashboardContentProps) {
  const { activeRideId, status: activeStatus } = useRideTrackingStore();
  const { activeLoan } = usePaymentStore();
  const { savedPlaces } = useProfileStore();
  const { liveLocation, setLiveLocation } = useBookingStore();

  const [selectedVehicle, setSelectedVehicle] = useState("economy");
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isLocating, setIsLocating] = useState(false);
  const watchId = useRef<number | null>(null);
  const map = useMap();

  const avgRating = useMemo(() => {
    const ratings = initialRides.filter((r) => r.rating != null).map((r) => r.rating!);
    return ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : "—";
  }, [initialRides]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        const currentLive = useBookingStore.getState().liveLocation;
        setLiveLocation({ ...coords, address: currentLive?.address || "Detecting address..." });
      },
      (error) => {
        if (error.code === 2 || error.code === 3) return;
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location access denied.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 }
    );
    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [setLiveLocation]);

  useEffect(() => {
    if (!liveLocation || liveLocation.address !== "Detecting address...") return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat: liveLocation.lat, lng: liveLocation.lng } },
      (results: any, status: any) => {
        if (status === "OK" && results?.[0]) {
          setLiveLocation({ ...liveLocation, address: results[0].formatted_address });
        }
      }
    );
  }, [liveLocation?.lat, liveLocation?.lng]);

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
      () => { setIsLocating(false); toast.error("Could not refresh location"); },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* ── Left Column: Booking & Saved Places ─────── */}
      <div className="lg:col-span-4 space-y-8">

        {/* Active Ride Banner */}
        {activeRideId && activeStatus !== "IDLE" && activeStatus !== "COMPLETED" && activeStatus !== "CANCELLED" && (
          <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-blue-600/20">
            <div>
              <p className="font-bold text-sm">Active Ride in Progress</p>
              <p className="text-blue-100 text-xs mt-0.5">{activeStatus.replace("_", " ")}</p>
            </div>
            <Link href={`/rides/${activeRideId}`} className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              Track →
            </Link>
          </div>
        )}

        {/* Book a Ride Panel */}
        <section className="bg-white rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-6 border border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-semibold text-[#111c2d]">Book a Ride</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[12px] font-medium">Live Rates</span>
          </div>

          {/* Pickup/Dropoff */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <div className="w-0.5 h-10 bg-slate-200" />
              <div className="w-2 h-2 rounded-sm bg-red-500" />
            </div>
            <div className="ml-10 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[12px] text-slate-400 font-medium">Pickup Location</p>
                <p className="text-[16px] font-semibold text-[#111c2d] truncate mt-0.5">
                  {liveLocation?.address ? liveLocation.address.split(",")[0] : "Detecting location..."}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[12px] text-slate-400 font-medium">Drop-off Destination</p>
                <Link href="/book">
                  <input readOnly placeholder="Where to?" className="w-full bg-transparent border-none p-0 focus:ring-0 text-[16px] font-semibold cursor-pointer placeholder-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {vehicleOptions.map(({ id, label, icon: Icon, price }) => (
              <button
                key={id}
                onClick={() => setSelectedVehicle(id)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                  selectedVehicle === id
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <Icon className={`text-2xl mb-1 ${selectedVehicle === id ? "text-blue-600" : "text-slate-500"}`} />
                <span className={`text-[12px] font-bold ${selectedVehicle === id ? "text-blue-700" : "text-slate-700"}`}>{label}</span>
                <span className={`text-[10px] ${selectedVehicle === id ? "text-blue-500" : "text-slate-500"}`}>{price}</span>
              </button>
            ))}
          </div>

          {/* Fare Preview */}
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-[12px] text-slate-500">Estimated Fare</p>
              <p className="text-[24px] font-semibold text-[#111c2d]">
                {selectedVehicle === "moto" ? "PKR 80" : selectedVehicle === "economy" ? "PKR 200" : "PKR 350"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-slate-500">Arrival</p>
              <p className="text-[16px] font-bold text-[#111c2d]">~5 mins</p>
            </div>
          </div>

          <Link href="/book" className="block w-full py-4 bg-blue-600 text-white font-semibold text-[18px] rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all text-center">
            Book Ride
          </Link>
        </section>

        {/* Saved Places */}
        <section className="space-y-3">
          <h3 className="text-[14px] font-semibold text-slate-500 uppercase tracking-wider">Saved Places</h3>
          <div className="flex flex-wrap gap-3">
            {savedPlaces.length > 0 ? savedPlaces.slice(0, 2).map((place, i) => (
              <button key={i} className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {i === 0 ? <MdBookmark className="text-sm" /> : <MdWork className="text-sm" />}
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold">{place.label || `Place ${i + 1}`}</p>
                  <p className="text-[11px] text-slate-400 truncate max-w-[120px]">{place.address || "Saved location"}</p>
                </div>
              </button>
            )) : (
              <>
                <button className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <MdBookmark className="text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold">Home</p>
                    <p className="text-[11px] text-slate-400">Add your home address</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <MdWork className="text-sm" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold">Work</p>
                    <p className="text-[11px] text-slate-400">Add your work address</p>
                  </div>
                </button>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ── Right Column: Map, Payment, Recent Rides ─── */}
      <div className="lg:col-span-8 space-y-8">

        {/* Live Map */}
        <section className="relative h-[450px] bg-white rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-slate-50">
          <Map
            defaultCenter={liveLocation || { lat: 33.6844, lng: 73.0479 }}
            defaultZoom={15}
            mapId={process.env.NEXT_PUBLIC_MAP_STYLE_ID || "bf51a910020fa2c4"}
            gestureHandling="greedy"
            disableDefaultUI={true}
            className="w-full h-full"
          >
            {liveLocation && (
              <AdvancedMarker position={{ lat: liveLocation.lat, lng: liveLocation.lng }}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10" />
                </div>
              </AdvancedMarker>
            )}
            {liveLocation && [
              { lat: liveLocation.lat + 0.002, lng: liveLocation.lng + 0.002 },
              { lat: liveLocation.lat - 0.0015, lng: liveLocation.lng + 0.0025 },
              { lat: liveLocation.lat + 0.003, lng: liveLocation.lng - 0.001 },
            ].map((pos, i) => (
              <AdvancedMarker key={i} position={pos}>
                <div className="bg-white p-1 rounded-lg shadow-xl border border-gray-100">
                  <MdDirectionsCar className="text-gray-800 text-lg" />
                </div>
              </AdvancedMarker>
            ))}
          </Map>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors font-bold text-lg">+</button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors font-bold text-lg">−</button>
          </div>

          {/* GPS Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleRefreshLocation}
              disabled={isLocating}
              className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
            >
              {isLocating ? <span className="loading loading-spinner loading-xs" /> : <MdGpsFixed className="text-xl text-green-500" />}
            </button>
          </div>

          {/* Current Position Card */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse">
                <MdMyLocation className="text-lg" />
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Current Position</p>
                <p className="text-[14px] font-bold">
                  {liveLocation?.address ? liveLocation.address.split(",")[0] : "Locating..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-4">
          <h3 className="text-[14px] font-semibold text-slate-500 uppercase tracking-wider">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map(({ id, label, sub }) => (
              <button
                key={id}
                onClick={() => setSelectedPayment(id)}
                className={`flex items-center justify-between p-4 bg-white rounded-xl border-2 transition-all text-left ${
                  selectedPayment === id ? "border-blue-600 bg-blue-50/30" : "border-slate-100 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MdPayment className={selectedPayment === id ? "text-blue-600 text-xl" : "text-slate-400 text-xl"} />
                  <div>
                    <p className={`text-[14px] font-semibold ${selectedPayment === id ? "text-blue-700" : ""}`}>{label}</p>
                    <p className={`text-[10px] ${selectedPayment === id ? "text-blue-500" : "text-slate-400"}`}>{sub}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === id ? "border-blue-600 bg-blue-600" : "border-slate-200"}`}>
                  {selectedPayment === id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Rides */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-slate-500 uppercase tracking-wider">Recent Rides</h3>
            <Link href="/rides" className="text-[12px] text-blue-600 font-bold hover:underline flex items-center gap-1">
              View History <MdArrowForward className="text-sm" />
            </Link>
          </div>

          {initialRides.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
              {initialRides.slice(0, 3).map((ride) => (
                <Link
                  key={ride.id}
                  href={`/rides/${ride.id}`}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                      <MdDirectionsCar className="text-slate-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold">
                        {ride.pickupAddress.split(",")[0]} → {ride.dropoffAddress.split(",")[0]}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {new Date(ride.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {ride.vehicleType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[16px] font-bold text-[#111c2d]">PKR {Math.round(ride.fare || 0).toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusColors[ride.status] || "bg-slate-50 text-slate-500"}`}>
                      {ride.status.charAt(0) + ride.status.slice(1).toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
              <MdHistory className="text-5xl text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-400">No rides yet</p>
              <p className="text-sm text-slate-300 mt-1">Your ride history will appear here</p>
              <Link href="/book" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                Book your first ride
              </Link>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
