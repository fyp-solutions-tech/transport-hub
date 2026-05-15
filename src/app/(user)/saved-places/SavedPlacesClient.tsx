"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MdHome, MdWork, MdFavorite, MdShoppingBasket, 
  MdModeEditOutline, MdDelete, MdLocationOn, MdGpsFixed
} from "react-icons/md";
import { SavedPlaceForm } from "./SavedPlaceForm";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

const ICONS: Record<string, any> = {
  HOME: MdHome,
  WORK: MdWork,
  SHOP: MdShoppingBasket,
  OTHER: MdFavorite,
};

export default function SavedPlacesClient({ home, work, others }: { home: any, work: any, others: any[] }) {
  const router = useRouter();
  const placesLib = useMapsLibrary("places");
  
  const [editingPlace, setEditingPlace] = useState<any>(null);
  const [deletingPlace, setDeletingPlace] = useState<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const editAddressRef = useRef<HTMLDivElement>(null);
  const editAutocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!editingPlace || !placesLib || !editAddressRef.current) return;
    
    if (!editAutocompleteRef.current && (placesLib as any).PlaceAutocompleteElement) {
      editAutocompleteRef.current = new (placesLib as any).PlaceAutocompleteElement({
        componentRestrictions: { country: "pk" }
      });
      
      editAutocompleteRef.current.style.cssText = `
        --pac-font-family: inherit;
        --pac-font-size: 1rem;
        --pac-icon-display: none;
        --pac-border: none;
        --pac-box-shadow: none;
        --pac-color: #111c2d;
        --pac-container-background-color: transparent;
        --pac-padding: 0;
      `;
      
      editAddressRef.current.appendChild(editAutocompleteRef.current);
      if (editingPlace.address) editAutocompleteRef.current.value = editingPlace.address;
      
      editAutocompleteRef.current.addEventListener("gmp-placeselect", (e: any) => {
        const place = e.place;
        if (place.location) {
          setEditingPlace((prev: any) => ({ ...prev, address: place.formattedAddress }));
        }
      });
    }
  }, [editingPlace, placesLib]);

  const handleUpdate = async () => {
    const finalAddress = editAutocompleteRef.current?.value || editingPlace.address;
    if (!finalAddress) return;

    try {
      if (editingPlace.id) {
        await api.patch(`/places/${editingPlace.id}`, { address: finalAddress });
        toast.success("Place updated!");
      } else {
        await api.post(`/places`, { name: editingPlace.name, address: finalAddress, type: editingPlace.type });
        toast.success("Place created!");
      }
      setEditingPlace(null);
      if (editAutocompleteRef.current) editAutocompleteRef.current.remove();
      editAutocompleteRef.current = null;
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save place");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/places/${deletingPlace.id}`);
      toast.success("Place deleted!");
      setDeletingPlace(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete place");
    }
  };

  const closeEditModal = () => {
    setEditingPlace(null);
    if (editAutocompleteRef.current) editAutocompleteRef.current.remove();
    editAutocompleteRef.current = null;
  };

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
            setEditingPlace((prev: any) => ({ ...prev, address: results[0].formatted_address }));
            if (editAutocompleteRef.current) {
              editAutocompleteRef.current.value = results[0].formatted_address;
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

  const renderQuickAccessCard = (place: any, defaultName: string, IconComponent: any) => (
    <div className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between group">
      <div 
        className={`flex gap-4 ${!place ? "cursor-pointer" : ""}`} 
        onClick={() => !place && setEditingPlace({ type: defaultName.toUpperCase(), name: defaultName })}
      >
        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
          <IconComponent className="text-xl" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-[#111c2d]">{defaultName}</h3>
          <p className="text-sm text-slate-500 mt-1">{place?.address || `Click to add your ${defaultName.toLowerCase()} address`}</p>
        </div>
      </div>
      {place && (
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditingPlace(place)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
            <MdModeEditOutline className="text-[20px]" />
          </button>
          <button onClick={() => setDeletingPlace(place)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
            <MdDelete className="text-[20px]" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        gmp-place-autocomplete::part(search-icon) { display: none !important; }
        gmp-place-autocomplete::part(input) { 
          padding-left: 0 !important; 
          font-weight: 600;
          color: #111c2d;
        }
      `}</style>
      <div className="space-y-8 pb-12">
        {/* Quick Access */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-semibold text-[#111c2d]">Quick Access</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderQuickAccessCard(home, "Home", MdHome)}
            {renderQuickAccessCard(work, "Work", MdWork)}
          </div>
        </section>

        {/* Collection + Form */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Saved Places Grid */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-[24px] font-semibold text-[#111c2d]">Your Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {others.length > 0 ? others.map((place) => {
                const Icon = ICONS[place.type] || MdFavorite;
                return (
                  <div key={place.id} className="bg-white rounded-xl p-6 shadow-[0_20px_40px_rgba(37,99,235,0.05)] hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col group">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-lg bg-surface-container text-blue-600 flex items-center justify-center">
                        <Icon className="text-lg" />
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingPlace(place)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><MdModeEditOutline className="text-[18px]" /></button>
                        <button onClick={() => setDeletingPlace(place)} className="p-2 text-slate-400 hover:text-red-600 transition-all"><MdDelete className="text-[18px]" /></button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-[14px] font-semibold text-[#111c2d]">{place.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{place.address}</p>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-xl border border-slate-100">
                  <MdFavorite className="text-4xl text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">No saved places yet.</p>
                  <p className="text-slate-400 text-sm">Add some places using the form.</p>
                </div>
              )}
            </div>
          </div>

          {/* Add New Place Form */}
          <div className="lg:col-span-4">
            <SavedPlaceForm />
          </div>
        </section>
      </div>

      {/* Modals */}
      {editingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-[#111c2d]">Edit Location: {editingPlace.name || editingPlace.type}</h3>
            
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Destination Address</label>
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/5 transition-all">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <MdLocationOn className="text-lg" />
                </div>
                <div className="flex-1">
                  <div ref={editAddressRef} className="relative h-6 *:absolute *:-top-3 *:bg-transparent! *:w-full" style={pacStyles} />
                </div>
                <button type="button" onClick={handleRefreshLocation} disabled={isLocating} className="p-2 hover:bg-white rounded-lg transition-colors text-green-500 shrink-0">
                  {isLocating ? <span className="loading loading-spinner loading-xs" /> : <MdGpsFixed className="text-lg" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={closeEditModal} className="px-4 py-2 font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {deletingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete className="text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#111c2d]">Delete Place?</h3>
            <p className="text-slate-500 mb-6">Are you sure you want to delete this place? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeletingPlace(null)} className="flex-1 px-4 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
