"use client";

import { useState } from "react";
import Image from "next/image";
import { MdPerson, MdMail, MdPhone, MdEdit, MdStar, MdDirectionsCar, MdAttachMoney } from "react-icons/md";
import { toast } from "sonner";

interface DriverProfileContentProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    phone?: string | null;
  };
  stats: {
    totalTrips: string;
    avgRating: string;
    totalEarnings: string;
  };
}

export default function DriverProfileContent({ initialUser, stats }: DriverProfileContentProps) {
  const [name, setName] = useState(initialUser.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/driver/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="card bg-gradient-to-br from-accent to-accent/70 text-accent-content shadow-lg">
        <div className="card-body items-center text-center py-8 gap-3">
          <div className="avatar placeholder">
            <div className="bg-accent-content/20 text-accent-content rounded-full w-20 ring-4 ring-accent-content/30">
              {initialUser.image ? (
                <Image
                  src={initialUser.image}
                  alt={initialUser.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <span className="text-3xl font-bold">
                  {initialUser.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{initialUser.name}</h2>
            <p className="text-sm opacity-75">{initialUser.email}</p>
            <span className="badge badge-sm mt-1 bg-accent-content/20 border-0 text-accent-content">
              DRIVER
            </span>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg">{stats.totalTrips}</p>
              <p className="opacity-75 text-xs">Trips</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">{stats.avgRating}</p>
              <p className="opacity-75 text-xs">Rating</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">{stats.totalEarnings}</p>
              <p className="opacity-75 text-xs">Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-0">
          <h2 className="font-semibold mb-3">Driver Details</h2>
          
          <div className="flex flex-col gap-1">
             {/* Name Field - Editable */}
             <div className="form-control w-full">
                <label className="label py-1">
                   <span className="label-text-alt flex items-center gap-1"><MdPerson className="text-accent"/> Full Name</span>
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered input-sm flex-1"
                    />
                </div>
             </div>

             <div className="divider my-2" />

             {/* Email Field - Read Only */}
             <div className="form-control w-full">
                <label className="label py-1">
                   <span className="label-text-alt flex items-center gap-1"><MdMail className="text-accent"/> Email</span>
                </label>
                <input 
                    type="text" 
                    value={initialUser.email} 
                    readOnly
                    className="input input-bordered input-sm bg-base-200 cursor-not-allowed"
                />
                <label className="label py-0">
                    <span className="label-text-alt text-base-content/40 italic">Cannot be changed</span>
                </label>
             </div>

             <div className="divider my-2" />

             {/* Phone Field - Read Only */}
             <div className="form-control w-full">
                <label className="label py-1">
                   <span className="label-text-alt flex items-center gap-1"><MdPhone className="text-accent"/> Phone Number</span>
                </label>
                <input 
                    type="text" 
                    value={initialUser.phone || "Not set"} 
                    readOnly
                    className="input input-bordered input-sm bg-base-200 cursor-not-allowed"
                />
                <label className="label py-0">
                    <span className="label-text-alt text-base-content/40 italic">Cannot be changed</span>
                </label>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total trips", value: stats.totalTrips, icon: <MdDirectionsCar className="text-accent text-xl" /> },
          { label: "Avg rating", value: stats.avgRating, icon: <MdStar className="text-warning text-xl" /> },
          { label: "Total earned", value: stats.totalEarnings, icon: <MdAttachMoney className="text-success text-xl" /> },
        ].map((s) => (
          <div key={s.label} className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body items-center text-center p-4 gap-1">
              {s.icon}
              <p className="font-bold">{s.value}</p>
              <p className="text-xs text-base-content/50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className={`btn btn-accent btn-block ${saving ? 'loading' : ''}`}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
