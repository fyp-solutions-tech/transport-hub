"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MdPerson, 
  MdMail, 
  MdPhone, 
  MdEdit, 
  MdStar, 
  MdDirectionsCar, 
  MdAttachMoney,
  MdPhotoCamera,
  MdDescription,
  MdAdd,
  MdSettings,
  MdLock,
  MdAccountBalanceWallet,
  MdAccountBalance,
  MdErrorOutline
} from "react-icons/md";
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
  const [phone, setPhone] = useState(initialUser.phone || "+1 (555) 000-1234");
  const [licenseNumber, setLicenseNumber] = useState("DL-992039485");
  const [vehicleType, setVehicleType] = useState("SUV (Premium)");
  const [plateNumber, setPlateNumber] = useState("DH-PLATINUM-1");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
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

  const handleDiscard = () => {
    setName(initialUser.name);
    setPhone(initialUser.phone || "+1 (555) 000-1234");
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Profile</h1>
        <p className="text-base-content/60">Manage your personal information, vehicle details, and account security.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Personal Information */}
        <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-8 border border-base-200">
          <div className="flex items-center gap-2 mb-6">
            <MdPerson className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-base-content">Personal Information</h2>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-base-200 flex items-center justify-center overflow-hidden border-4 border-base-200">
                  {initialUser.image ? (
                    <Image
                      src={initialUser.image}
                      alt={initialUser.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {initialUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg active:scale-95 duration-200">
                  <MdPhotoCamera className="text-sm" />
                </button>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-base-content">Profile Picture</h4>
                <p className="text-xs text-base-content/60">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">Full Name</label>
                <input
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">Phone Number</label>
                <input
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">Email Address</label>
                <input
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  type="email"
                  value={initialUser.email}
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Vehicle & Licensing */}
        <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-8 border border-base-200">
          <div className="flex items-center gap-2 mb-6">
            <MdDirectionsCar className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-base-content">Vehicle &amp; Licensing</h2>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">License Number</label>
                <input
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">Vehicle Type</label>
                <select
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option>Sedan (Standard)</option>
                  <option>SUV (Premium)</option>
                  <option>Electric (Eco)</option>
                  <option>Van (XL)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-base-content/60 font-medium">Vehicle Plate Number</label>
                <input
                  className="w-full border-2 border-base-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-base-content outline-none transition-all bg-base-100"
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 p-6 bg-base-100 rounded-xl border border-dashed border-base-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-base-content">Vehicle Documents</span>
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold">Verified</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg shadow-sm border border-base-200">
                  <MdDescription className="text-primary text-xl" />
                  <span className="text-xs font-medium">Insurance_Exp_2025.pdf</span>
                </div>
                <button className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                  <MdAdd className="text-sm" /> Upload New Documents
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Section: Account Settings & Payment Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Account Settings */}
        <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-8 border border-base-200">
          <div className="flex items-center gap-2 mb-6">
            <MdSettings className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-base-content">Account Settings</h2>
          </div>
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-sm font-semibold text-base-content mb-4">Notification Preferences</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-base-content">Push Notifications</p>
                    <p className="text-xs text-base-content/60">New ride alerts and system updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-base-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-base-content">SMS Alerts</p>
                    <p className="text-xs text-base-content/60">Important safety announcements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      checked={smsAlerts}
                      onChange={() => setSmsAlerts(!smsAlerts)}
                      className="sr-only peer"
                      type="checkbox"
                    />
                    <div className="w-11 h-6 bg-base-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-base-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button className="flex items-center gap-2 text-primary font-semibold hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors">
                <MdLock className="text-xl" />
                <span className="text-sm font-semibold">Change Security Password</span>
              </button>
            </div>
          </div>
        </section>

        {/* Payment Info */}
        <section className="bg-base-100 rounded-xl shadow-[0_20px_40px_rgba(37,99,235,0.05)] p-8 border border-base-200">
          <div className="flex items-center gap-2 mb-6">
            <MdAccountBalanceWallet className="text-primary text-2xl" />
            <h2 className="text-xl font-bold text-base-content">Payment Info</h2>
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-sm text-base-content/60 font-medium">Primary Payout Method</p>
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary to-primary-container p-8 text-white shadow-lg">
              <div className="flex justify-between items-start mb-12">
                <div className="flex flex-col">
                  <span className="text-xs opacity-80">Bank Account</span>
                  <span className="text-lg font-bold">**** 8821</span>
                </div>
                <MdAccountBalance className="text-3xl" />
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-xs opacity-80">{initialUser.name}</span>
                  <span className="text-xs">United Global Bank</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Primary</span>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -left-4 top-0 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 border-2 border-base-200 hover:bg-base-200 py-3 rounded-xl text-sm font-semibold text-base-content transition-colors">
                Edit Bank Details
              </button>
              <button className="flex-1 border-2 border-base-200 hover:bg-base-200 py-3 rounded-xl text-sm font-semibold text-base-content transition-colors">
                History
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Global Action Bar */}
      <div className="sticky bottom-8 left-0 right-0 flex justify-end gap-4 max-w-5xl mx-auto px-6">
        <button
          onClick={handleDiscard}
          className="bg-base-100 border-2 border-base-200 text-base-content px-8 py-3 rounded-xl font-semibold active:scale-95 duration-200 shadow-lg"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`bg-primary text-white px-12 py-3 rounded-xl font-semibold active:scale-95 duration-200 shadow-xl shadow-primary/20 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
