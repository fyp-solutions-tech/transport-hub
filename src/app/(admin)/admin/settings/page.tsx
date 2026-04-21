import { MdSettings, MdAttachMoney, MdSecurity, MdNotifications, MdLanguage, MdSave } from "react-icons/md";

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-base-content/60 mt-1">Configure global application parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              id={`nav-setting-${item.id}`}
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
                  id="setting-platform-name"
                  type="text"
                  defaultValue="Transport Hub"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control w-full max-w-sm">
                <label className="label py-1">
                  <span className="label-text font-medium">Support Email</span>
                </label>
                <input
                  id="setting-support-email"
                  type="email"
                  defaultValue="support@transporthub.com"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4 p-0">
                  <input id="setting-maintenance" type="checkbox" className="toggle toggle-secondary" />
                  <div>
                    <span className="label-text font-medium block">Maintenance Mode</span>
                    <span className="text-xs text-base-content/50">Temporarily disable access for non-admins</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing Section (Mockup) */}
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
                    <input id="setting-base-fare" type="number" defaultValue="30" className="grow w-full" />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Per Km Rate (Economy)</span>
                  </label>
                  <label className="input input-bordered flex items-center pr-0">
                    <span className="text-base-content/50 mr-2">৳</span>
                    <input id="setting-per-km" type="number" defaultValue="10" className="grow w-full" />
                  </label>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium">Platform Fee (%)</span>
                  </label>
                  <label className="input input-bordered flex items-center pr-0">
                    <input id="setting-platform-fee" type="number" defaultValue="15" className="grow w-full" />
                    <span className="text-base-content/50 ml-2 bg-base-200 px-3 py-[0.8rem] rounded-r border-l border-base-300">%</span>
                  </label>
                  <p className="text-xs text-base-content/50 mt-1">Deducted from driver earnings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button id="settings-cancel-btn" className="btn btn-ghost">Cancel</button>
            <button id="settings-save-btn" className="btn btn-secondary gap-2 shadow-md">
              <MdSave className="text-lg" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
