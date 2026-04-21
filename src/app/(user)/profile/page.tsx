import { requireRole } from "@/lib/session";
import Image from "next/image";
import { MdPerson, MdMail, MdPhone, MdEdit, MdStar, MdDirectionsCar, MdShield } from "react-icons/md";

export default async function ProfilePage() {
  const { session } = await requireRole("USER");
  const user = session.user;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-base-content/60 mt-1">Manage your account information</p>
      </div>

      {/* Avatar + name banner */}
      <div className="card bg-gradient-to-br from-primary to-primary/70 text-primary-content shadow-lg">
        <div className="card-body items-center text-center py-8 gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary-content/20 text-primary-content rounded-full w-20 ring-4 ring-primary-content/30">
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
          </div>
          <div className="flex gap-4 mt-2 text-sm">
            <div className="text-center">
              <p className="font-bold text-lg">0</p>
              <p className="opacity-75 text-xs">Rides</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">—</p>
              <p className="opacity-75 text-xs">Rating</p>
            </div>
            <div className="divider divider-horizontal" />
            <div className="text-center">
              <p className="font-bold text-lg">৳0</p>
              <p className="opacity-75 text-xs">Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info fields */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-0">
          <h2 className="font-semibold mb-3">Account Details</h2>

          {[
            { label: "Full Name", value: user.name, icon: <MdPerson className="text-primary" />, id: "edit-name" },
            { label: "Email Address", value: user.email, icon: <MdMail className="text-primary" />, id: "edit-email" },
            { label: "Phone Number", value: "Not set", icon: <MdPhone className="text-primary" />, id: "edit-phone" },
          ].map((field, i) => (
            <div key={field.id}>
              {i !== 0 && <div className="divider my-0" />}
              <div className="flex items-center gap-4 py-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
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
          { label: "Rides taken", value: "0", icon: <MdDirectionsCar className="text-primary text-xl" /> },
          { label: "Avg rating", value: "—", icon: <MdStar className="text-warning text-xl" /> },
          { label: "Member since", value: "2026", icon: <MdShield className="text-success text-xl" /> },
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

      <button id="save-profile-btn" className="btn btn-primary btn-block">
        Save Changes
      </button>
    </div>
  );
}
