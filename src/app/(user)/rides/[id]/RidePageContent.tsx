"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
} from "react-icons/md";
import { toast } from "sonner";
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

// ── Types ──────────────────────────────────────────────
type RideStatus =
  | "SEARCHING"
  | "ACCEPTED"
  | "ARRIVING"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

interface Driver {
  name: string;
  vehicle: string;
  plate: string;
  rating: number;
  image?: string;
}

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

// ── Mock Data ──────────────────────────────────────────
const MOCK_DRIVERS: Driver[] = [
  { name: "Ahmed Hassan", vehicle: "Toyota Corolla (White)", plate: "LHR-7890", rating: 4.9 },
  { name: "Bilal Khan", vehicle: "Honda Civic (Black)", plate: "ISL-4422", rating: 4.8 },
  { name: "Zeeshan Ali", vehicle: "Suzuki Swift (Silver)", plate: "KHI-1155", rating: 4.7 },
];

// ── Components ─────────────────────────────────────────

function LiveRideMap({ 
  pickup, 
  dropoff, 
  driverPos, 
  status 
}: { 
  pickup: { lat: number, lng: number }, 
  dropoff: { lat: number, lng: number },
  driverPos: { lat: number, lng: number } | null,
  status: RideStatus
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: "#3B82F6", strokeWeight: 5, strokeOpacity: 0.8 },
    });
    setDirectionsRenderer(renderer);
    return () => renderer.setMap(null);
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!routesLibrary || !directionsRenderer || !pickup || !dropoff) return;
    const service = new routesLibrary.DirectionsService();
    service.route({
      origin: pickup,
      destination: dropoff,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === "OK") directionsRenderer.setDirections(result);
    });
  }, [routesLibrary, directionsRenderer, pickup, dropoff]);

  return (
    <>
      <AdvancedMarker position={pickup}>
        <Pin background="#22D3EE" glyphColor="#fff" borderColor="#0891B2" scale={1.2} />
      </AdvancedMarker>
      <AdvancedMarker position={dropoff}>
        <Pin background="#F87171" glyphColor="#fff" borderColor="#B91C1C" scale={1.2} />
      </AdvancedMarker>
      {driverPos && (
        <AdvancedMarker position={driverPos}>
          <div className="bg-white p-1.5 rounded-full shadow-xl border-2 border-primary animate-bounce">
            <MdDirectionsCar className="text-primary text-xl" />
          </div>
        </AdvancedMarker>
      )}
    </>
  );
}

export default function RidePageContent({ ride }: { ride: RideData }) {
  const [status, setStatus] = useState<RideStatus>("SEARCHING");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [driverPos, setDriverPos] = useState<{ lat: number; lng: number } | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  // ── Simulation Logic ────────────────────────────────
  useEffect(() => {
    const sequence: { status: RideStatus; delay: number }[] = [
      { status: "SEARCHING", delay: 0 },
      { status: "ACCEPTED", delay: 5000 },
      { status: "ARRIVING", delay: 8000 },
      { status: "ARRIVED", delay: 15000 },
      { status: "IN_PROGRESS", delay: 18000 },
      { status: "COMPLETED", delay: 25000 },
    ];

    const timeouts = sequence.map((step) => 
      setTimeout(() => {
        setStatus(step.status);
        if (step.status === "ACCEPTED") {
          setDriver(MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)]);
          setDriverPos({ lat: ride.pickupLat + 0.01, lng: ride.pickupLng + 0.01 });
        }
      }, step.delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [ride]);

  // Mock driver movement
  useEffect(() => {
    if (status === "ARRIVING" && driverPos) {
      const interval = setInterval(() => {
        setDriverPos(prev => {
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
        setDriverPos(prev => {
          if (!prev) return null;
          const latDiff = (ride.dropoffLat - prev.lat) * 0.05;
          const lngDiff = (ride.dropoffLng - prev.lng) * 0.05;
          return { lat: prev.lat + latDiff, lng: prev.lng + lngDiff };
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, ride]);

  const steps = [
    { label: "Searching", active: true },
    { label: "Accepted", active: ["ACCEPTED", "ARRIVING", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Arriving", active: ["ARRIVING", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Started", active: ["IN_PROGRESS", "COMPLETED"].includes(status) },
    { label: "Finished", active: status === "COMPLETED" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/rides" className="btn btn-ghost btn-circle btn-sm">
          <MdArrowBack className="text-lg" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Ride Tracking</h1>
          <p className="text-xs text-base-content/50">ID: {ride.id}</p>
        </div>
        <div className={`ml-auto badge badge-md gap-2 ${status === 'COMPLETED' ? 'badge-success' : 'badge-primary animate-pulse'}`}>
          {status.replace('_', ' ')}
        </div>
      </div>

      {/* Map */}
      <div className="h-72 rounded-3xl border-4 border-base-200 shadow-inner relative overflow-hidden bg-base-300">
        <Map
          defaultCenter={{ lat: ride.pickupLat, lng: ride.pickupLng }}
          defaultZoom={13}
          mapId="bf51a910020fa2c4"
          disableDefaultUI
        >
          <LiveRideMap 
            pickup={{ lat: ride.pickupLat, lng: ride.pickupLng }}
            dropoff={{ lat: ride.dropoffLat, lng: ride.dropoffLng }}
            driverPos={driverPos}
            status={status}
          />
        </Map>
      </div>

      {/* Ride Quick Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card bg-base-100 border border-base-200 p-3 items-center text-center shadow-sm">
          <MdAccessTime className="text-primary text-xl mb-1" />
          <p className="text-[10px] uppercase font-bold text-base-content/40">ETA</p>
          <p className="text-sm font-black">{status === 'COMPLETED' ? '--' : `~${Math.round(ride.durationMin)}m`}</p>
        </div>
        <div className="card bg-base-100 border border-base-200 p-3 items-center text-center shadow-sm">
          <MdMyLocation className="text-success text-xl mb-1" />
          <p className="text-[10px] uppercase font-bold text-base-content/40">Distance</p>
          <p className="text-sm font-black">{ride.distanceKm.toFixed(1)} km</p>
        </div>
        <div className="card bg-base-100 border border-base-200 p-3 items-center text-center shadow-sm">
          <MdAttachMoney className="text-warning text-xl mb-1" />
          <p className="text-[10px] uppercase font-bold text-base-content/40">Fare</p>
          <p className="text-sm font-black">Rs {ride.fare}</p>
        </div>
      </div>

      {/* Driver Card */}
      {driver ? (
        <div className="card bg-base-100 border border-base-200 shadow-md">
          <div className="card-body p-4 flex-row items-center gap-4">
            <div className="avatar">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-content text-2xl font-bold">
                {driver.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight">{driver.name}</p>
              <p className="text-xs text-base-content/60 font-medium">{driver.vehicle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="badge badge-sm badge-outline font-mono font-bold">{driver.plate}</span>
                <div className="flex items-center gap-0.5 text-warning font-bold text-xs">
                  <MdStar /> {driver.rating}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="btn btn-circle btn-primary btn-sm">
                <MdPhone />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 border-2 border-dashed border-base-300 py-8 items-center text-center">
          <span className="loading loading-spinner loading-md text-primary mb-2"></span>
          <p className="text-sm font-bold text-base-content/60">Finding your driver...</p>
        </div>
      )}

      {/* Timeline */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          <ul className="steps steps-vertical lg:steps-horizontal w-full py-6 px-4">
            {steps.map((s, i) => (
              <li key={i} className={`step ${s.active ? 'step-primary font-bold' : 'text-base-content/20'}`}>
                <span className="text-[10px] uppercase tracking-tighter">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fare Breakdown & Rating */}
      {status === 'COMPLETED' ? (
        <div className="card bg-success/5 border-2 border-success/20 animate-in fade-in zoom-in duration-500">
          <div className="card-body p-5 items-center text-center">
            <MdCheckCircle className="text-5xl text-success mb-2" />
            <h2 className="text-xl font-black">Ride Completed!</h2>
            <p className="text-sm text-base-content/60 mb-4">How was your experience with {driver?.name}?</p>
            
            <div className="rating rating-lg gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <input 
                  key={s} 
                  type="radio" 
                  name="rating" 
                  className="mask mask-star-2 bg-warning" 
                  onClick={() => {
                    setRating(s);
                    toast.success("Thanks for your feedback!");
                  }}
                  checked={rating === s}
                  onChange={() => {}}
                />
              ))}
            </div>
            
            <div className="divider w-full my-4"></div>
            <div className="w-full space-y-2 text-sm font-medium">
              <div className="flex justify-between opacity-60">
                <span>Base Fare</span>
                <span>Rs {Math.round(ride.fare * 0.3)}</span>
              </div>
              <div className="flex justify-between opacity-60">
                <span>Distance ({ride.distanceKm.toFixed(1)} km)</span>
                <span>Rs {Math.round(ride.fare * 0.7)}</span>
              </div>
              <div className="flex justify-between text-lg font-black border-t pt-2">
                <span>Total Paid</span>
                <span className="text-success">Rs {ride.fare}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        status !== 'CANCELLED' && (
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to cancel this ride?")) {
                setStatus('CANCELLED');
                toast.error("Ride cancelled");
              }
            }}
            disabled={['IN_PROGRESS', 'ARRIVED'].includes(status)}
            className="btn btn-ghost btn-block text-error hover:bg-error/10 gap-2 border-2 border-error/10"
          >
            <MdClose /> Cancel Ride
          </button>
        )
      )}
    </div>
  );
}
