"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdOutlineUnfoldMore } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { IoIosMail } from "react-icons/io";

export default function AdminShellMenu({
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
    <div className="dropdown dropdown-top w-full">
      <div
        tabIndex={0}
        role="button"
        className="flex items-center gap-3 p-3 bg-surface-container-low hover:bg-surface-container rounded-lg transition-all duration-200 cursor-pointer border border-outline-variant/50 w-full group"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-bright shadow-sm shrink-0 group-hover:border-primary/20 transition-all">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="overflow-hidden flex-1 text-left">
          <p className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
            {user.name}
          </p>
          <p className="text-[10px] text-outline uppercase tracking-tight font-bold">
            System Admin
          </p>
        </div>
        <span className="material-symbols-outlined text-outline text-lg group-hover:text-primary transition-all">
          <MdOutlineUnfoldMore />
        </span>
      </div>
      
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow-2xl bg-surface-bright border border-outline-variant rounded-lg w-full mb-2 z-50 animate-in slide-in-from-bottom-2"
      >
        <li className="gap-2 px-3 py-2 border-b border-outline-variant mb-1">
          <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
        </li>
        <li>
          <Link href="/admin/settings" className="flex items-center gap-2 py-2.5 rounded-xl font-semibold text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg"><MdOutlineSettings /></span>
            Settings
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 py-2.5 rounded-xl font-semibold text-error hover:bg-error-container/10 transition-colors mt-1"
          >
            <span className="material-symbols-outlined text-lg"><CgLogOut /></span>
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}

import Link from "next/link";

