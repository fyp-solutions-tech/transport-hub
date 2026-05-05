"use client";

import { useState } from "react";
import { updateSystemSettings } from "./actions";
import { toast } from "sonner";
import Link from "next/link";
import { MdEdit, MdMail, MdPayments, MdMap, MdShield, MdSave, MdArrowForward, MdPerson, MdSecurity, MdVerifiedUser } from "react-icons/md";
import { PiMonitorThin } from "react-icons/pi";

interface SettingsFormProps {
  initialSettings: {
    platformName: string;
    supportEmail: string;
    maintenance: boolean;
    baseFare: number;
    perKmRate: number;
    platformFee: number;
  };
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [maintenance, setMaintenance] = useState(initialSettings.maintenance);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    if (maintenance) {
      formData.set("maintenance", "on");
    }

    const result = await updateSystemSettings(formData);

    if (result.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error(result.error || "Failed to update settings");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Section: General Settings */}
      <section>
        <div className="mb-6">
          <h3 className="font-h3 text-h3 text-on-surface">General Settings</h3>
          <p className="text-secondary font-body-md mt-1">Configure your platform's core identity and localization.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 group hover:border-primary/20 transition-all">
            <label className="block font-label-sm text-on-surface mb-3">Platform Name</label>
            <div className="relative">
              <input
                name="platformName"
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant/30 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all font-body-md text-on-surface outline-none bg-surface"
                placeholder="Enter platform name"
                type="text"
                defaultValue={initialSettings.platformName}
              />
              <MdEdit className="absolute right-4 top-1/2 -translate-y-1/2 text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 group hover:border-primary/20 transition-all">
            <label className="block font-label-sm text-on-surface mb-3">Support Email</label>
            <div className="relative">
              <input
                name="supportEmail"
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant/30 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all font-body-md text-on-surface outline-none bg-surface"
                placeholder="support@transporthub.com"
                type="email"
                defaultValue={initialSettings.supportEmail}
              />
              <MdMail className="absolute right-4 top-1/2 -translate-y-1/2 text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Pricing Configuration */}
      <section>
        <div className="mb-6">
          <h3 className="font-h3 text-h3 text-on-surface">Pricing Settings</h3>
          <p className="text-secondary font-body-md mt-1">Define the revenue model and automated billing parameters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MdPayments className="text-xl" />
              </div>
              <label className="font-label-sm text-on-surface">Base Fare</label>
            </div>
            <div className="flex">
              <div className="px-4 py-3 bg-surface-container-low border-2 border-r-0 border-outline-variant/30 rounded-l-xl text-outline font-bold">PKR</div>
              <input
                name="baseFare"
                className="w-full px-4 py-3 rounded-r-xl border-2 border-outline-variant/30 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all font-body-md text-on-surface outline-none bg-surface"
                step="0.01"
                type="number"
                defaultValue={initialSettings.baseFare}
              />
            </div>
            <p className="mt-3 text-caption text-outline">Minimum charge applied to any trip request.</p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MdMap className="text-xl" />
              </div>
              <label className="font-label-sm text-on-surface">Per KM Rate</label>
            </div>
            <div className="flex">
              <div className="px-4 py-3 bg-surface-container-low border-2 border-r-0 border-outline-variant/30 rounded-l-xl text-outline font-bold">PKR</div>
              <input
                name="perKmRate"
                className="w-full px-4 py-3 rounded-r-xl border-2 border-outline-variant/30 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all font-body-md text-on-surface outline-none bg-surface"
                step="0.01"
                type="number"
                defaultValue={initialSettings.perKmRate}
              />
            </div>
            <p className="mt-3 text-caption text-outline">Distance-based multiplier applied after base fare.</p>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <PiMonitorThin className="text-xl" />
              </div>
              <label className="font-label-sm text-on-surface">Platform Fee (%)</label>
            </div>
            <div className="flex">
              <input
                name="platformFee"
                className="w-full px-4 py-3 rounded-l-xl border-2 border-r-0 border-outline-variant/30 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 transition-all font-body-md text-on-surface outline-none bg-surface"
                step="0.1"
                type="number"
                defaultValue={initialSettings.platformFee}
              />
              <div className="px-4 py-3 bg-surface-container-low border-2 border-outline-variant/30 rounded-r-xl text-outline font-bold">%</div>
            </div>
            <p className="mt-3 text-caption text-outline">Percentage deducted from driver earnings.</p>
          </div>
        </div>
      </section>

      {/* Save Changes Section */}
      <div className="flex items-center justify-between p-8 bg-surface-container-highest rounded-3xl border border-primary/10 mt-4 shadow-xl shadow-blue-900/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface-bright rounded-2xl flex items-center justify-center shadow-sm text-primary">
            <MdShield className="text-xl" />
          </div>
          <div>
            <h4 className="font-label-sm text-on-surface">System Protection</h4>
            <p className="text-caption text-secondary">These changes will affect all active trips and platform revenue.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="button" className="px-6 py-3 bg-surface-bright text-secondary font-label-sm rounded-xl hover:bg-surface transition-colors border border-outline-variant active:scale-95 duration-150">Discard</button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 duration-150 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <MdSave className="text-sm" />
            )}
            Save Configuration
          </button>
        </div>
      </div>

      {/* System Logs & Load Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-label-sm text-lg text-on-surface">System Audit Log</h3>
            <button type="button" className="text-primary text-caption flex items-center gap-1 font-bold">Full History <MdArrowForward className="text-sm" /></button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 hover:bg-surface transition-colors cursor-default border-l-4 border-primary rounded-r-xl bg-surface/50">
              <MdPerson className="text-outline" />
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">Admin modified Per KM Rate</p>
                <p className="text-[10px] text-outline uppercase font-black">Today, 2:45 PM</p>
              </div>
              <span className="text-caption font-black text-primary">+$0.15</span>
            </div>
            <div className="flex items-center gap-4 p-4 hover:bg-surface transition-colors cursor-default border-l-4 border-outline-variant rounded-r-xl">
              <MdSecurity className="text-outline" />
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">2FA enforcement enabled for all staff</p>
                <p className="text-[10px] text-outline uppercase font-black">Yesterday, 10:12 AM</p>
              </div>
              <MdVerifiedUser className="text-outline/50" />
            </div>
          </div>
        </div>
        
        <div className="bg-primary text-white rounded-3xl p-8 shadow-xl shadow-blue-500/20 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div>
            <h3 className="text-lg font-black tracking-tight">System Load</h3>
            <p className="text-white/60 text-caption mt-1">Real-time resource tracking</p>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="text-6xl font-black mb-2 animate-pulse">12.4%</div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Minimal Pressure</p>
            <div className="w-full mt-8 flex gap-1.5 h-2">
              <div className="h-full bg-white/30 rounded-full flex-1"></div>
              <div className="h-full bg-white/30 rounded-full flex-1"></div>
              <div className="h-full bg-white rounded-full flex-1"></div>
              <div className="h-full bg-white/10 rounded-full flex-1"></div>
              <div className="h-full bg-white/10 rounded-full flex-1"></div>
              <div className="h-full bg-white/10 rounded-full flex-1"></div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}

