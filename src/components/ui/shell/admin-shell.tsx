import Link from "next/link";
import Image from "next/image";
import SidebarNav from "@/components/ui/shell/sidebar-nav";
import AdminShellMenu from "@/components/ui/shell/admin-shell-menu";
import {
  MdDashboard,
  MdPeople,
  MdDirectionsCar,
  MdRoute,
  MdSettings,
  MdShield,
} from "react-icons/md";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/admin/users", label: "Users", icon: <MdPeople /> },
  { href: "/admin/drivers", label: "Drivers", icon: <MdDirectionsCar /> },
  { href: "/admin/rides", label: "All Rides", icon: <MdRoute /> },
  { href: "/admin/settings", label: "Settings", icon: <MdSettings /> },
];

export default async function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-30 px-4 lg:px-6">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="admin-drawer"
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
                Admin Control Panel
              </span>
              <span className="badge badge-secondary badge-sm">ADMIN</span>
            </div>
          </div>
          <div className="flex-none">
            <AdminShellMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label
          htmlFor="admin-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <aside className="bg-base-100 border-r border-base-200 w-64 min-h-full flex flex-col">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-6 py-5 border-b border-base-200"
          >
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <MdShield className="text-secondary-content text-lg" />
            </div>
            <span className="font-bold text-lg text-base-content">
              Transport<span className="text-secondary">Hub</span>
            </span>
          </Link>

          <nav className="flex-1 py-4">
            <SidebarNav items={navItems} />
          </nav>

          <div className="p-4 border-t border-base-200">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200">
              <div className="avatar placeholder">
                <div className="bg-secondary text-secondary-content rounded-full w-9">
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
                <p className="text-xs text-base-content/50 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
