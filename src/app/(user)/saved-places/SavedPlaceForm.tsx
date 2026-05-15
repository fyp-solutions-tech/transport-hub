"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAddLocation, MdHome, MdFavorite, MdWork, MdShoppingBasket, MdMyLocation, MdInfo, MdGpsFixed } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const ICONS = [
  { id: "HOME", icon: MdHome },
  { id: "OTHER", icon: MdFavorite },
  { id: "WORK", icon: MdWork },
  { id: "SHOP", icon: MdShoppingBasket },
];

export function SavedPlaceForm() {
  const router = useRouter();
  const placesLib = useMapsLibrary("places");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("OTHER");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  
  const addressRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!placesLib || !addressRef.current) return;
    
    if (!autocompleteRef.current && (placesLib as any).PlaceAutocompleteElement) {
      autocompleteRef.current = new (placesLib as any).PlaceAutocompleteElement({
        componentRestrictions: { country: "pk" }
      });
      
      autocompleteRef.current.style.cssText = `
        --pac-font-family: inherit;
        --pac-font-size: 1rem;
        --pac-icon-display: none;
        --pac-border: none;
        --pac-box-shadow: none;
        --pac-color: #111c2d;
        --pac-container-background-color: transparent;
        --pac-padding: 0;
      `;
      
      addressRef.current.appendChild(autocompleteRef.current);
      
      autocompleteRef.current.addEventListener("gmp-placeselect", (e: any) => {
        const place = e.place;
        if (place.formattedAddress) {
          setAddress(place.formattedAddress);
        }
      });
    }
  }, [placesLib]);

  const handleRefreshLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos: any) => {
        const { latitude, longitude } = pos.coords;
        if (!placesLib || !window.google || !window.google.maps || !window.google.maps.Geocoder) {
          setIsLocating(false);
          return toast.error("Map service loading...");
        }
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
          if (status === "OK" && results?.[0]) {
            const newAddress = results[0].formatted_address;
            setAddress(newAddress);
            if (autocompleteRef.current) {
              autocompleteRef.current.value = newAddress;
            }
            toast.success("Address set to your live location");
          } else {
            toast.error("Could not determine address");
          }
          setIsLocating(false);
        });
      },
      () => { setIsLocating(false); toast.error("Could not access live location"); },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = autocompleteRef.current?.value || address;
    if (!name || !finalAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/places", {
        name,
        address: finalAddress,
        type,
      });
      toast.success("Place saved successfully!");
      setName("");
      setAddress("");
      if (autocompleteRef.current) {
        autocompleteRef.current.value = "";
      }
      router.refresh(); // Refresh server component
    } catch (err: any) {
      toast.error(err.message || "Failed to save place");
    } finally {
      setIsSubmitting(false);
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
    <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] sticky top-24">
      <style>{`
        gmp-place-autocomplete::part(search-icon) { display: none !important; }
        gmp-place-autocomplete::part(input) { 
          padding-left: 0 !important; 
          font-weight: 600;
          color: #111c2d;
        }
      `}</style>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <MdAddLocation className="text-xl" />
        </div>
        <h2 className="text-[24px] font-semibold text-[#111c2d]">New Place</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Place Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Grandma's House, Library" 
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all outline-none text-[16px]" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Address</label>
          <div className="flex items-center gap-3 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all px-4 py-3">
            <MdMyLocation className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <div ref={addressRef} className="relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
            </div>
            <button 
              type="button" 
              onClick={handleRefreshLocation} 
              disabled={isLocating}
              className="p-2 hover:bg-white rounded-lg transition-colors text-green-500 shrink-0"
            >
              {isLocating ? <span className="loading loading-spinner loading-xs" /> : <MdGpsFixed className="text-lg" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Select Icon</label>
          <div className="grid grid-cols-4 gap-3">
            {ICONS.map(({ id, icon: Icon }) => (
              <button 
                key={id} 
                type="button" 
                onClick={() => setType(id)}
                className={`p-3 border rounded-lg transition-all flex items-center justify-center ${
                  type === id 
                    ? "border-blue-600 text-blue-600 bg-blue-50" 
                    : "border-slate-100 hover:border-blue-600 hover:text-blue-600 bg-slate-50 text-slate-500"
                }`}
              >
                <Icon className="text-xl" />
              </button>
            ))}
          </div>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>
              <IoIosSave className="text-lg" />
              Save Place
            </>
          )}
        </button>
      </form>

      <div className="mt-8 p-4 bg-surface-container rounded-lg">
        <div className="flex gap-3">
          <MdInfo className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-on-secondary-container leading-relaxed">
            Saved places help our smart algorithm predict your travel needs and offer faster booking options during rush hour.
          </p>
        </div>
      </div>
    </div>
  );
}
