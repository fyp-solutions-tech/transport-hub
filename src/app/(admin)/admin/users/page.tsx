import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MdFilterList, MdPersonAdd, MdGroup, MdBolt, MdStars, MdSearch, MdRoute, MdEdit, MdBlock, MdMoreVert, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      _count: {
        select: { ridesAsPassenger: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const displayUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    rides: u._count.ridesAsPassenger,
    joined: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(u.createdAt)),
    status: "Active" // Mock status
  }));

  const stats = [
    { label: "Total Passengers", value: displayUsers.length.toString(), icon: <MdGroup />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Today", value: "24", icon: <MdBolt />, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "New This Week", value: "12", icon: <MdPersonAdd />, color: "text-primary", bg: "bg-primary/5" },
    { label: "High Value", value: "8", icon: <MdStars />, color: "text-secondary", bg: "bg-secondary/5" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">Passenger Directory</h2>
          <p className="text-secondary font-body-md mt-1">Manage all registered passengers and their activity across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdFilterList className="text-lg" />
            Filters
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdPersonAdd className="text-lg" />
            Add Passenger
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                <span className="text-xl flex items-center justify-center">{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-on-surface leading-tight">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: User Table */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
              placeholder="Search passengers by name, email or ID..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-xs font-bold text-on-surface-variant outline-none">
              <option>Recently Joined</option>
              <option>Most Rides</option>
              <option>Status: Active</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Passenger Details</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Ride History</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {displayUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary font-black text-sm uppercase">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.name}</p>
                        <p className="text-[10px] text-outline font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MdRoute className="text-secondary text-sm" />
                      <span className="text-sm font-bold text-on-surface-variant">{user.rides} Rides</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-success/10 text-success text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <MdEdit className="text-[18px]" />
                      </button>
                      <button className="p-2 text-outline hover:text-error transition-colors rounded-lg hover:bg-error/5">
                        <MdBlock className="text-[18px]" />
                      </button>
                      <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                        <MdMoreVert className="text-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">Showing <span className="font-bold text-on-surface">{displayUsers.length}</span> of <span className="font-bold text-on-surface">{displayUsers.length}</span> passengers</p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-lg text-outline hover:bg-surface-container transition-all" disabled>
              <MdKeyboardArrowLeft className="text-lg" />
            </button>
            <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">1</button>
            <button className="p-2 border border-outline-variant rounded-lg text-outline hover:bg-surface-container transition-all">
              <MdKeyboardArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

