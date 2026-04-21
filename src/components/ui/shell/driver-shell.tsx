import Link from "next/link";
import Image from "next/image";
import SidebarNav from "@/components/ui/shell/sidebar-nav";
import DriverShellMenu from "@/components/ui/shell/driver-shell-menu";
import {
  MdDashboard,
  MdDirectionsCar,
  MdHistory,
  MdPerson,
  MdElectricCar,
} from "react-icons/md";

const navItems = [
  { href: "/driver/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/driver/trips", label: "My Trips", icon: <MdHistory /> },
  { href: "/driver/vehicle", label: "My Vehicle", icon: <MdElectricCar /> },
  { href: "/driver/profile", label: "Profile", icon: <MdPerson /> },
];

export default async function DriverShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="driver-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-30 px-4 lg:px-6">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="driver-drawer"
              className="btn btn-square btn-ghost"
              aria-label="Open sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/50 font-medium hidden sm:block">
                Driver Portal
              </span>
              <span className="badge badge-accent badge-sm">DRIVER</span>
            </div>
          </div>
          <div className="flex-none">
            <DriverShellMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="driver-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <aside className="bg-base-100 border-r border-base-200 w-64 min-h-full flex flex-col">
          <Link
            href="/driver/dashboard"
            className="flex items-center gap-3 px-6 py-5 border-b border-base-200"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <MdDirectionsCar className="text-accent-content text-lg" />
            </div>
            <span className="font-bold text-lg text-base-content">
              Transport<span className="text-accent">Hub</span>
            </span>
          </Link>

          <nav className="flex-1 py-4">
            <SidebarNav items={navItems} />
          </nav>

          <div className="p-4 border-t border-base-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200">
              <div className="avatar placeholder">
                <div className="bg-accent text-accent-content rounded-full w-9">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-base-content/50 truncate">Driver</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
