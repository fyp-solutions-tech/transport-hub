"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  MdPhotoCamera,
  MdSave,
  MdWallet,
  MdShield,
  MdNotificationsActive,
  MdLockReset,
  MdExpandMore,
  MdAddCircle,
  MdChevronRight,
} from "react-icons/md";
import { useUserStore } from "@/store/useUserStore";

interface ProfileData {
  name: string;
  email: string;
  rideCount: number;
  avgRating: string;
  createdAt?: Date | string;
}

export function ProfileContent({ profile }: { profile: ProfileData }) {
  const { user } = useUserStore();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const [notif, setNotif] = useState({ rideStatus: true, promo: false, price: true });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="max-w-[1000px] mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left: Personal Info + Payments ───────── */}
        <div className="lg:col-span-7 space-y-6">

          {/* Personal Information Card */}
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-white">
            <h2 className="text-[24px] font-semibold text-[#111c2d] mb-6">Personal Information</h2>

            {/* Avatar */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative group shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#dee8ff] shadow-lg transition-transform duration-300 group-hover:scale-105">
                  {user?.image ? (
                    <Image src={user.image} alt={name} width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-4xl">
                      {initial}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors active:scale-90">
                  <MdPhotoCamera className="text-lg" />
                </button>
              </div>

              <div className="text-center md:text-left">
                <p className="text-[18px] font-semibold text-[#111c2d]">Change Profile Photo</p>
                <p className="text-[12px] text-[#434655] mt-1">JPG, GIF or PNG. Max size of 800K</p>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white text-[14px] font-semibold rounded-lg hover:shadow-lg transition-all active:scale-95">
                    Upload New
                  </button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 text-[14px] font-semibold rounded-lg hover:bg-slate-200 transition-all">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.rideCount}</p>
                <p className="text-xs text-slate-500 mt-1">Total Rides</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.avgRating}</p>
                <p className="text-xs text-slate-500 mt-1">Avg Rating</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-[16px] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-slate-600">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-[16px] outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-slate-600">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-[16px] outline-none cursor-not-allowed text-slate-400"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {saving ? <span className="loading loading-spinner loading-sm" /> : <MdSave className="text-lg" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Payment Preferences */}
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-white">
            <div className="flex items-center gap-2 mb-6">
              <MdWallet className="text-blue-600 text-2xl" />
              <h2 className="text-[24px] font-semibold text-[#111c2d]">Payment Preferences</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-slate-600">Default Payment Method</label>
                <div className="relative">
                  <select className="w-full appearance-none px-4 py-4 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all text-[16px] outline-none bg-[#f9f9ff]">
                    <option>Cash on Delivery</option>
                    <option>Debit/Credit Card (Visa ••••4242)</option>
                    <option>Skyline Flex Loan (BNPL)</option>
                  </select>
                  <MdExpandMore className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl" />
                </div>
              </div>
              <button className="flex items-center justify-between w-full p-4 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <MdAddCircle className="text-slate-400 group-hover:text-blue-600 transition-colors text-xl" />
                  <span className="text-[14px] font-semibold text-slate-500 group-hover:text-[#111c2d]">Add New Payment Method</span>
                </div>
                <MdChevronRight className="text-slate-300 text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Security + Notifications + Danger ─ */}
        <div className="lg:col-span-5 space-y-6">

          {/* Security */}
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-white">
            <div className="flex items-center gap-2 mb-6">
              <MdShield className="text-blue-600 text-2xl" />
              <h2 className="text-[24px] font-semibold text-[#111c2d]">Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#111c2d]">Change Password</p>
                  <p className="text-[12px] text-slate-500">Last updated 3 months ago</p>
                </div>
                <MdLockReset className="text-blue-600 text-xl" />
              </button>
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-[#111c2d]">Two-Factor Auth</p>
                  <p className="text-[12px] text-slate-500">Increase account security</p>
                </div>
                <div className="w-10 h-6 bg-slate-200 rounded-full relative flex items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl p-8 shadow-[0_20px_40px_rgba(37,99,235,0.05)] border border-white">
            <div className="flex items-center gap-2 mb-6">
              <MdNotificationsActive className="text-blue-600 text-2xl" />
              <h2 className="text-[24px] font-semibold text-[#111c2d]">Notifications</h2>
            </div>
            <div className="space-y-6">
              {[
                { key: "rideStatus" as const, label: "Ride Status Updates", sub: "Real-time tracking and arrival alerts" },
                { key: "promo" as const, label: "Promotional Offers", sub: "Discounts and loyalty program updates" },
                { key: "price" as const, label: "Price Alerts", sub: "Notify when prices drop on saved routes" },
              ].map(({ key, label, sub }) => (
                <div key={key} className="flex items-start justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111c2d]">{label}</p>
                    <p className="text-[12px] text-slate-500 max-w-[200px]">{sub}</p>
                  </div>
                  <button
                    onClick={() => setNotif((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${notif[key] ? "bg-blue-600 justify-end" : "bg-slate-200"}`}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-8 border border-red-200 rounded-xl bg-red-50/50">
            <h3 className="text-[14px] font-semibold text-red-600 mb-2">Danger Zone</h3>
            <p className="text-[12px] text-slate-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="w-full py-3 border border-red-500 text-red-600 text-[14px] font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
