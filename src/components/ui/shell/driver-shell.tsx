import Link from "next/link";
import Image from "next/image";
import { MdOutlineSettings } from "react-icons/md";
import DriverShellMenu from "@/components/ui/shell/driver-shell-menu";
import {
  MdDashboard,
  MdHistory,
  MdPerson,
  MdSupportAgent,
  MdPayments,
} from "react-icons/md";

const navItems = [
  { href: "/driver/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  { href: "/driver/analytics", label: "Earnings", icon: <MdPayments /> },
  { href: "/driver/trips", label: "Ride History", icon: <MdHistory /> },
  { href: "/driver/profile", label: "Profile", icon: <MdPerson /> },
  { href: "/driver/support", label: "Support", icon: <MdSupportAgent /> },
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
        <header className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200/60 sticky top-0 z-30 px-4 lg:px-6 shadow-sm shadow-primary/5">
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
            <div className="w-full max-w-7xl md:hidden">
              <Link href="/driver/dashboard" className="text-2xl font-black tracking-tight text-primary btn btn-ghost py-6">
                <Image src="/logo.png" alt="TransportHub" width={150} height={150} />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-base-content/60 hover:bg-base-200 transition-colors rounded-full">
              <span className="text-xl"><MdOutlineSettings /></span>
            </button>
            <DriverShellMenu user={user} />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="driver-drawer"
          aria-label="Close sidebar"
          className="drawer-overlay"
        />
        <aside className="bg-base-100 border-r border-base-200 w-64 min-h-full flex flex-col shadow-[4px_0_24px_rgba(37,99,235,0.04)]">
          <div className="p-6">
            <div className="w-full max-w-7xl hidden md:block mb-5">
              <Link href="/driver/dashboard" className="text-2xl font-black tracking-tight text-primary btn btn-ghost py-6">
                <Image src="/logo.png" alt="TransportHub" width={150} height={150} />
              </Link>
            </div>

            <nav className="flex flex-col gap-2 p-0">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-all hover:translate-x-1 duration-200 rounded-lg"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-8 left-0 w-full px-6">
            <div className="avatar placeholder">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-primary font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
