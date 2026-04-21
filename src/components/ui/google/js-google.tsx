"use client";

import { useBookingStore } from "@/store/useBookingStore";
import { useUserStore } from "@/store/useUserStore";
import {
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { MdDirectionsCar } from "react-icons/md";

export default function BookRide() {
  const { pickup, dropoff, liveLocation, setPickup } = useBookingStore();
  const user = useUserStore((s) => s.user);
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const hasFittedInitial = useRef(false);

  // ── Mock Nearby Cars ────────────────────────────────
  const mockCars = useMemo(() => {
    if (!pickup) return [];
    // Generate 3-5 random cars around pickup
    return [
      { id: 1, lat: pickup.lat + 0.002, lng: pickup.lng + 0.002, rotation: 45 },
      { id: 2, lat: pickup.lat - 0.001, lng: pickup.lng + 0.003, rotation: 120 },
      { id: 3, lat: pickup.lat + 0.003, lng: pickup.lng - 0.001, rotation: 280 },
      { id: 4, lat: pickup.lat - 0.002, lng: pickup.lng - 0.002, rotation: 10 },
    ];
  }, [pickup?.lat, pickup?.lng]);

  // ── Initialize Directions Service / Renderer ──────────
  useEffect(() => {
    if (!routesLibrary || !map) return;
    const service = new routesLibrary.DirectionsService();
    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3B82F6",
        strokeWeight: 5,
        strokeOpacity: 0.85,
      },
    });
    setDirectionsService(service);
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  // ── Calculate Route & Draw Polyline ───────────────────
  useEffect(() => {
    if (!directionsService || !directionsRenderer || !map) return;

    if (!pickup || !dropoff) {
      directionsRenderer.setDirections({ routes: [] } as unknown as google.maps.DirectionsResult);
      return;
    }

    setIsRouting(true);
    directionsService.route(
      {
        origin: { lat: pickup.lat, lng: pickup.lng },
        destination: { lat: dropoff.lat, lng: dropoff.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setIsRouting(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);

          const route = result.routes[0];
          if (route?.legs[0]) {
            const distKm = (route.legs[0].distance?.value || 0) / 1000;
            const durMin = (route.legs[0].duration?.value || 0) / 60;
            useBookingStore.getState().setSearchParams(distKm, durMin);
          }

          // Auto-fit bounds to show entire route
          if (map) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: pickup.lat, lng: pickup.lng });
            bounds.extend({ lat: dropoff.lat, lng: dropoff.lng });
            map.fitBounds(bounds, { top: 80, right: 80, bottom: 80, left: 80 });
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [
    directionsService,
    directionsRenderer,
    pickup?.lat,
    pickup?.lng,
    dropoff?.lat,
    dropoff?.lng,
    map,
  ]);

  // ── Pan map to pickup when it changes ─────────────────
  useEffect(() => {
    if (!map || !pickup || dropoff) return; // don't pan if route is showing
    if (!hasFittedInitial.current) {
      map.panTo({ lat: pickup.lat, lng: pickup.lng });
      map.setZoom(15);
      hasFittedInitial.current = true;
    }
  }, [map, pickup, dropoff]);

  // ── Reverse geocode on pickup drag ────────────────────
  const handlePickupDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const coords = { lat, lng };

      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: coords });
        const address =
          response.results[0]?.formatted_address || "Custom Location";
        setPickup({ ...coords, address });
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setPickup({ ...coords, address: "Custom Location" });
      }
    },
    [setPickup]
  );

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={pickup || { lat: 33.6844, lng: 73.0479 }}
        defaultZoom={15}
        mapId={process.env.NEXT_PUBLIC_MAP_STYLE_ID || "bf51a910020fa2c4"}
        gestureHandling="greedy"
        disableDefaultUI={true}
        className="w-full h-full"
      >
        {/* ── Pickup Pin (Draggable) ─────────────────── */}
        {pickup && (
          <AdvancedMarker
            position={{ lat: pickup.lat, lng: pickup.lng }}
            draggable
            onDragEnd={handlePickupDragEnd}
          >
            <Pin
              background="#22D3EE"
              glyphColor="#0C172C"
              borderColor="#0C172C"
              scale={1.2}
            />
          </AdvancedMarker>
        )}

        {/* ── Drop-off Pin ───────────────────────────── */}
        {dropoff && (
          <AdvancedMarker position={{ lat: dropoff.lat, lng: dropoff.lng }}>
            <div className="relative group cursor-pointer">
              {/* Pulsing glow for destination */}
              <div className="absolute inset-0 -m-3 bg-error/20 rounded-full animate-ping group-hover:bg-error/30" />
              <Pin
                background="#EF4444"
                glyphColor="#FFFFFF"
                borderColor="#991B1B"
                scale={1.4}
              />
            </div>
          </AdvancedMarker>
        )}

        {/* ── Mock Nearby Cars ────────────────────────── */}
        {pickup &&
          mockCars.map((car) => (
            <AdvancedMarker
              key={car.id}
              position={{ lat: car.lat, lng: car.lng }}
            >
              <div
                className="transition-all duration-700 hover:z-50"
                style={{ transform: `rotate(${car.rotation}deg)` }}
              >
                <div className="bg-white p-1 rounded-lg shadow-xl border border-gray-100 flex flex-col items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
                  <MdDirectionsCar className="text-gray-800 text-lg" />
                  <div className="absolute -bottom-6 bg-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm border border-gray-100 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    2 MIN
                  </div>
                </div>
              </div>
            </AdvancedMarker>
          ))}

        {/* ── Live Location Blue Dot + InfoWindow ────── */}
        {liveLocation && (
          <AdvancedMarker
            position={{ lat: liveLocation.lat, lng: liveLocation.lng }}
            onClick={() => setShowInfoWindow(!showInfoWindow)}
          >
            {/* Pulsing blue dot */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
              <div className="absolute w-6 h-6 bg-blue-500/20 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10" />
            </div>
          </AdvancedMarker>
        )}

        {liveLocation && showInfoWindow && (
          <InfoWindow
            position={{ lat: liveLocation.lat, lng: liveLocation.lng }}
            pixelOffset={[0, -20]}
            onCloseClick={() => setShowInfoWindow(false)}
            headerDisabled
          >
            <div className="flex items-center gap-2.5 p-1 min-w-[180px]">
              <div className="shrink-0">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-semibold text-sm text-gray-900 truncate max-w-[140px]">
                  {user?.name || "User"}
                </span>
                <span className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">
                  Passenger
                </span>
                <span className="text-[11px] text-gray-500 truncate max-w-[140px] mt-0.5">
                  {liveLocation.address || "Detecting…"}
                </span>
              </div>
            </div>
          </InfoWindow>
        )}

        {/* ── Routing Overlay ── */}
        {isRouting && (
          <div className="absolute inset-0 bg-base-100/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-50">
            <div className="bg-base-100 px-4 py-2 rounded-full shadow-xl border border-primary/20 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <span className="loading loading-spinner loading-xs text-primary" />
              <span className="text-xs font-bold tracking-tight text-primary uppercase">Calculating Route</span>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
