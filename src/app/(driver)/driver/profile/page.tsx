import { requireRole } from "@/lib/session";
import Image from "next/image";
import { MdPerson, MdMail, MdPhone, MdEdit, MdStar, MdDirectionsCar, MdAttachMoney } from "react-icons/md";

export default async function DriverProfilePage() {
  const { session } = await requireRole("DRIVER");
  const user = session.user;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Driver Profile</h1>
        <p className="text-base-content/60 mt-1">Edit your driver information</p>
      </div>

      {/* Banner */}
      <div className="card bg-gradient-to-br from-accent to-accent/70 text-accent-content shadow-lg">
        <div className="card-body items-center text-center py-8 gap-3">
          <div className="avatar placeholder">
            <div className="bg-accent-content/20 text-accent-content rounded-full w-20 ring-4 ring-accent-content/30">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <span className="text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-75">{user.email}</p>
            <span className="badge badge-sm mt-1 bg-accent-content/20 border-0 text-accent-content">
              DRIVER
            </span>
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg">0</p>
              <p className="opacity-75 text-xs">Trips</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">—</p>
              <p className="opacity-75 text-xs">Rating</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">৳0</p>
              <p className="opacity-75 text-xs">Earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-0">
          <h2 className="font-semibold mb-3">Driver Details</h2>
          {[
            { label: "Full Name", value: user.name, icon: <MdPerson className="text-accent" />, id: "edit-driver-name" },
            { label: "Email", value: user.email, icon: <MdMail className="text-accent" />, id: "edit-driver-email" },
            { label: "Phone", value: "Not set", icon: <MdPhone className="text-accent" />, id: "edit-driver-phone" },
          ].map((field, i) => (
            <div key={field.id}>
              {i !== 0 && <div className="divider my-0" />}
              <div className="flex items-center gap-4 py-2">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  {field.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-base-content/50">{field.label}</p>
                  <p className="font-medium text-sm">{field.value}</p>
                </div>
                <button id={field.id} className="btn btn-ghost btn-circle btn-sm">
                  <MdEdit className="text-base-content/50" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total trips", value: "0", icon: <MdDirectionsCar className="text-accent text-xl" /> },
          { label: "Avg rating", value: "—", icon: <MdStar className="text-warning text-xl" /> },
          { label: "Total earned", value: "৳0", icon: <MdAttachMoney className="text-success text-xl" /> },
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

      <button id="save-driver-profile-btn" className="btn btn-accent btn-block">
        Save Changes
      </button>
    </div>
  );
}
