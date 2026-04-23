"use client";

import { useState } from "react";
import { MdSettings, MdAttachMoney, MdSecurity, MdNotifications, MdLanguage, MdSave } from "react-icons/md";
import { updateSystemSettings } from "./actions";
import { toast } from "sonner";

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
    // Standard checkbox behavior: only present if checked
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Settings nav sidebar */}
      <div className="md:col-span-1 space-y-1">
        {[
          { id: "general", label: "General", icon: <MdSettings /> },
          { id: "pricing", label: "Pricing & Fees", icon: <MdAttachMoney /> },
          { id: "security", label: "Security", icon: <MdSecurity /> },
          { id: "notifications", label: "Notifications", icon: <MdNotifications /> },
          { id: "localization", label: "Localization", icon: <MdLanguage /> },
        ].map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`btn btn-sm w-full justify-start gap-3 ${
              i === 0 ? "btn-secondary" : "btn-ghost text-base-content/70 font-normal"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="md:col-span-3 space-y-6">
        {/* General Section */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body gap-5">
            <h2 className="card-title text-lg border-b border-base-200 pb-2">General Settings</h2>

            <div className="form-control w-full max-w-sm">
              <label className="label py-1">
                <span className="label-text font-medium">Platform Name</span>
              </label>
              <input
                name="platformName"
                type="text"
                defaultValue={initialSettings.platformName}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control w-full max-w-sm">
              <label className="label py-1">
                <span className="label-text font-medium">Support Email</span>
              </label>
              <input
                name="supportEmail"
                type="email"
                defaultValue={initialSettings.supportEmail}
                className="input input-bordered"
                required
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-4 p-0">
                <input 
                  type="checkbox" 
                  className="toggle toggle-secondary" 
                  checked={maintenance}
                  onChange={(e) => setMaintenance(e.target.checked)}
                />
                <div>
                  <span className="label-text font-medium block">Maintenance Mode</span>
                  <span className="text-xs text-base-content/50">Temporarily disable access for non-admins</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body gap-5">
            <h2 className="card-title text-lg border-b border-base-200 pb-2">Pricing & Fees</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Base Fare (Economy)</span>
                </label>
                <label className="input input-bordered flex items-center pr-0">
                  <span className="text-base-content/50 mr-2">৳</span>
                  <input 
                    name="baseFare" 
                    type="number" 
                    step="0.01"
                    defaultValue={initialSettings.baseFare} 
                    className="grow w-full" 
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Per Km Rate (Economy)</span>
                </label>
                <label className="input input-bordered flex items-center pr-0">
                  <span className="text-base-content/50 mr-2">৳</span>
                  <input 
                    name="perKmRate" 
                    type="number" 
                    step="0.01"
                    defaultValue={initialSettings.perKmRate} 
                    className="grow w-full" 
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-medium">Platform Fee (%)</span>
                </label>
                <label className="input input-bordered flex items-center pr-0">
                  <input 
                    name="platformFee" 
                    type="number" 
                    step="0.1"
                    defaultValue={initialSettings.platformFee} 
                    className="grow w-full" 
                  />
                  <span className="text-base-content/50 ml-2 bg-base-200 px-3 py-[0.8rem] rounded-r border-l border-base-300">%</span>
                </label>
                <p className="text-xs text-base-content/50 mt-1">Deducted from driver earnings</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn btn-ghost">Cancel</button>
          <button 
            type="submit" 
            className="btn btn-secondary gap-2 shadow-md"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <MdSave className="text-lg" />
            )}
            Save Settings
          </button>
        </div>
      </div>
    </form>
  );
}
