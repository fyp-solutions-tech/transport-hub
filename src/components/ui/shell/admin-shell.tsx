import SidebarNav, { NavItem } from "@/components/ui/shell/sidebar-nav";
import AdminShellMenu from "@/components/ui/shell/admin-shell-menu";
import { MdOutlineDashboard, MdLocalTaxi, MdGroup, MdRoute, MdOutlinePayments, MdSupportAgent, MdOutlineSettings, MdSearch, MdNotifications, MdHelp } from "react-icons/md";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <MdOutlineDashboard /> },
  { href: "/admin/drivers", label: "Drivers", icon: <MdLocalTaxi /> },
  { href: "/admin/users", label: "Passengers", icon: <MdGroup /> },
  { href: "/admin/rides", label: "Rides", icon: <MdRoute /> },
  { href: "/admin/revenue", label: "Revenue", icon: <MdOutlinePayments /> },
  { href: "/admin/support", label: "Support", icon: <MdSupportAgent /> },
  { href: "/admin/settings", label: "Settings", icon: <MdOutlineSettings /> },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string; image?: string | null };
}) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-outline-variant bg-surface-container-lowest shadow-xl shadow-blue-900/5 flex-col py-6 gap-2 z-50 hidden lg:flex">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <MdLocalTaxi className="text-[24px]" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-primary leading-none tracking-tight">Hub Manager</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold mt-1">Terminal Alpha</p>
          </div>
        </div>

        <nav className="flex-1 px-4">
          <SidebarNav items={navItems} />
        </nav>

        <div className="px-6 pt-6 border-t border-outline-variant">
          <AdminShellMenu user={user} />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 w-full z-40 bg-surface-bright/80 backdrop-blur-md border-b border-outline-variant shadow-sm flex justify-between items-center h-16 px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" />
              <input
                className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
                placeholder="Search rides, drivers, or passengers..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors rounded-full relative active:scale-95">
              <MdNotifications className="text-[24px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-bright"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors rounded-full active:scale-95">
              <MdHelp className="text-[24px]" />
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

