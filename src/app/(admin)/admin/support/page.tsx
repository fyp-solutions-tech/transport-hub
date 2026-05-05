import { prisma } from "@/lib/prisma";
import { MdConfirmationNumber, MdEmergency, MdTimer, MdMood, MdForum, MdAddComment, MdSearch, MdReply, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default async function AdminSupportPage() {
  // In a real app, we'd have a SupportTicket model. For now, we'll mock it or use recent user activity.
  const tickets = [
    { id: "TK-8492", user: "Ahmed Khan", type: "Billing", subject: "Double charge on ride #X92", status: "OPEN", priority: "HIGH", time: "12m ago" },
    { id: "TK-8488", user: "Sara Malik", type: "Safety", subject: "Driver was speeding excessively", status: "OPEN", priority: "URGENT", time: "45m ago" },
    { id: "TK-8485", user: "John Doe", type: "App Issue", subject: "Cannot add new credit card", status: "IN_PROGRESS", priority: "MEDIUM", time: "2h ago" },
    { id: "TK-8481", user: "Zainab Bib", type: "Lost Item", subject: "Left phone in the back seat", status: "RESOLVED", priority: "LOW", time: "5h ago" },
  ];

  const stats = [
    { label: "Active Tickets", value: "14", icon: <MdConfirmationNumber />, color: "text-primary", bg: "bg-primary/10" },
    { label: "Urgent Priority", value: "3", icon: <MdEmergency />, color: "text-error", bg: "bg-error/10" },
    { label: "Avg Response", value: "18m", icon: <MdTimer />, color: "text-success", bg: "bg-success/10" },
    { label: "Satisfaction", value: "94%", icon: <MdMood />, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface">Support Nexus</h2>
          <p className="text-secondary font-body-md mt-1">Resolve user inquiries, safety reports, and technical issues.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface-variant font-label-sm rounded-xl border border-outline-variant hover:bg-surface-container-highest transition-all flex items-center gap-2">
            <MdForum className="text-lg" />
            Canned Responses
          </button>
          <button className="px-4 py-2 bg-primary text-white font-label-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2">
            <MdAddComment className="text-lg" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Support Stats */}
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

      {/* Ticket Queue */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-body-md"
              placeholder="Search tickets by ID, user or keyword..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
             <button className="px-4 py-2 bg-surface text-on-surface font-bold text-xs rounded-xl border border-outline-variant">Priority: All</button>
             <button className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-sm">Status: Open</button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Ticket</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-caption font-bold text-outline uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-surface-container-low/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface">{ticket.subject}</p>
                    <p className="text-[10px] text-outline font-medium">{ticket.id} • {ticket.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-on-surface-variant">{ticket.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-outline">{ticket.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.priority === "URGENT" ? "bg-error/10 text-error" :
                      ticket.priority === "HIGH" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                         ticket.status === "OPEN" ? "bg-primary animate-pulse" :
                         ticket.status === "IN_PROGRESS" ? "bg-warning" :
                         "bg-success"
                       }`}></span>
                       <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{ticket.status}</span>
                    </div>
                  </td>
                   <td className="px-6 py-4 text-right">
                    <button className="p-2 text-outline hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
                      <MdReply className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/30 flex items-center justify-between">
          <p className="text-xs text-outline font-medium">Showing <span className="font-bold text-on-surface">{tickets.length}</span> of <span className="font-bold text-on-surface">42</span> tickets</p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-lg text-outline hover:bg-surface-container transition-all">
              <MdKeyboardArrowLeft className="text-lg" />
            </button>
            <button className="p-2 border border-outline-variant rounded-lg text-outline hover:bg-surface-container transition-all">
              <MdKeyboardArrowRight className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
