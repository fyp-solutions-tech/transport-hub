"use client";

import { useState } from "react";
import { 
  MdEdit, 
  MdEmail, 
  MdPhone, 
  MdSave, 
  MdStar, 
  MdDirectionsCar,
  MdLocationOn,
  MdLock
} from "react-icons/md";
import { toast } from "sonner";
import { useProfileStore } from "@/store/useProfileStore";

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  rideCount: number;
  avgRating: string;
  createdAt: string | Date;
}

export function ProfileContent({ profile }: { profile: UserProfile }) {
  const { name, updateName, savedPlaces } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name || profile.name);

  const handleSave = () => {
    updateName(newName);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-primary"></div>
        <div className="card-body -mt-16 pt-0 items-center sm:items-start sm:flex-row gap-6">
          <div className="avatar">
            <div className="w-32 h-32 rounded-3xl bg-base-100 p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-secondary flex items-center justify-center text-secondary-content text-5xl font-bold">
                {(name || profile.name).charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left pt-16 sm:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              {isEditing ? (
                <div className="join w-full max-w-sm">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input input-bordered join-item flex-1 font-bold"
                  />
                  <button onClick={handleSave} className="btn btn-primary join-item">
                    <MdSave className="text-xl" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">{name || profile.name}</h1>
                  <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-circle btn-sm">
                    <MdEdit className="text-lg opacity-50" />
                  </button>
                </>
              )}
            </div>
            <p className="text-base-content/60 flex items-center justify-center sm:justify-start gap-2">
              <MdEmail className="opacity-40" /> {profile.email}
            </p>
          </div>

          <div className="pt-2 sm:pt-20">
             <div className="badge badge-lg badge-outline gap-2 font-bold px-4 py-3">
               Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-6">
              <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-base-content/60">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MdDirectionsCar className="text-primary" />
                    </div>
                    <span>Total Rides</span>
                  </div>
                  <span className="font-bold text-lg">{profile.rideCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-base-content/60">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <MdStar className="text-success" />
                    </div>
                    <span>Avg Rating</span>
                  </div>
                  <span className="font-bold text-lg">{profile.avgRating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body p-6">
              <h2 className="text-lg font-bold mb-4">Saved Places</h2>
              <div className="space-y-3">
                {savedPlaces.map(place => (
                  <div key={place.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center text-info">
                      <MdLocationOn />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{place.label}</p>
                      <p className="text-[10px] text-base-content/50 truncate">{place.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info */}
        <div className="md:col-span-2 card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <h2 className="text-lg font-bold mb-6">Account Details</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold opacity-60">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name || profile.name}
                    className="input input-bordered bg-base-200 cursor-not-allowed"
                    disabled
                  />
                  <label className="label">
                     <span className="label-text-alt text-primary">Use the editor above to change name</span>
                  </label>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold opacity-60">Email Address</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile.email}
                      className="input input-bordered w-full pr-10 bg-base-200 cursor-not-allowed"
                      disabled
                    />
                    <MdLock className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold opacity-60">Phone Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profile.phone || "Not linked"}
                      className="input input-bordered w-full pr-10 bg-base-200 cursor-not-allowed"
                      disabled
                    />
                    <MdLock className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30" />
                  </div>
                </div>
              </div>

              <div className="divider opacity-50"></div>

              <div>
                <h3 className="font-bold text-sm mb-4">Security</h3>
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <MdLock className="text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Two-Factor Authentication</p>
                      <p className="text-xs text-base-content/50">Add an extra layer of security</p>
                    </div>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
