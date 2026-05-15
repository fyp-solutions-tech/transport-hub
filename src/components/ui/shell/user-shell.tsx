"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserShellMenu from "@/components/ui/shell/user-shell-menu";
import {
  MdDashboard,
  MdDirectionsCar,
  MdPayment,
  MdBookmark,
  MdContactSupport,
  MdPerson,
  MdNotifications,
  MdHelpCenter,
  MdSearch,
  MdHome,
  MdWork,
} from "react-icons/md";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/rides", label: "My Rides", icon: MdDirectionsCar },
  { href: "/payment", label: "Payments", icon: MdPayment },
  { href: "/saved-places", label: "Saved Places", icon: MdBookmark },
  { href: "/support", label: "Support", icon: MdContactSupport },
  { href: "/profile", label: "Profile", icon: MdPerson },
];

const bottomNavItems = [
  { href: "/dashboard", label: "Home", icon: MdHome },
  { href: "/rides", label: "Rides", icon: MdDirectionsCar },
  { href: "/payment", label: "Pay", icon: MdPayment },
  { href: "/profile", label: "Profile", icon: MdPerson },
];

export default function UserShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-bright font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ── Fixed Sidebar (Desktop) ─────────────────────── */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 border-r border-slate-100 bg-white z-50 flex-col py-8 px-4">
        {/* Logo */}
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-black text-blue-600 leading-tight">TransportHub</h1>
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">
            Passenger Portal
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="text-xl shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="mt-auto px-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
              {user.image ? (
                <Image src={user.image} alt={user.name} width={36} height={36} className="rounded-full object-cover" />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────── */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-[0_4px_20px_rgba(37,99,235,0.03)] flex justify-between items-center px-4 md:px-8">
          {/* Mobile brand */}
          <span className="md:hidden text-lg font-black text-blue-600">TransportHub</span>

          {/* Search */}
          <div className="hidden md:flex flex-1 items-center max-w-md">
            <div className="relative w-full group">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xl" />
              <input
                type="text"
                placeholder="Search your destination..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
              <MdNotifications className="text-xl" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="hidden md:flex p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <MdHelpCenter className="text-xl" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1 hidden md:block" />
            <UserShellMenu user={user} />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 px-4 z-50">
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 ${active ? "text-blue-600" : "text-slate-400"}`}
            >
              <Icon className="text-2xl" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
