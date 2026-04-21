"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DriverShellMenu({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/login");
        },
      },
    });
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-9 rounded-full bg-accent flex items-center justify-center">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <span className="text-accent-content font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-200"
      >
        <li className="menu-title px-2 py-1">
          <span className="font-semibold text-sm truncate">{user.name}</span>
          <span className="text-xs text-base-content/50 truncate">Driver</span>
        </li>
        <div className="divider my-0" />
        <li>
          <a href="/driver/profile">Profile Settings</a>
        </li>
        <li>
          <button onClick={handleLogout} className="text-error">
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}
