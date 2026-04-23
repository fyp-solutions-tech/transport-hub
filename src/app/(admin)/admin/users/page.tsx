import { MdPeople, MdSearch, MdMoreVert, MdShield, MdBlock } from "react-icons/md";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      _count: {
        select: { passengerRides: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const displayUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    rides: u._count.passengerRides,
    joined: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(u.createdAt)),
    status: "active" // Defaulting to active as there's no status field in schema yet
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-base-content/60 mt-1">All registered passengers</p>
        </div>
        <div className="stat bg-base-100 border border-base-200 rounded-xl py-3 px-5 shadow-sm">
          <div className="stat-figure text-primary">
            <MdPeople className="text-2xl" />
          </div>
          <div className="stat-value text-xl">{displayUsers.length}</div>
          <div className="stat-desc">Total users</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <label className="input input-bordered flex items-center gap-2 flex-1 max-w-sm">
          <MdSearch className="text-base-content/50 text-lg" />
          <input id="user-search" type="text" placeholder="Search by name or email" className="grow text-sm" />
        </label>
        <select id="user-status-filter" className="select select-bordered text-sm">
          <option>All statuses</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Rides</th>
                <th>Joined</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {displayUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary/10 text-primary rounded-full w-9">
                          <span className="text-sm font-semibold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-base-content/50">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-ghost badge-sm">{user.role}</span>
                  </td>
                  <td className="text-sm">{user.rides}</td>
                  <td className="text-sm text-base-content/60">{user.joined}</td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        user.status === "active" ? "badge-success" : "badge-error"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <button
                        tabIndex={0}
                        id={`user-actions-${user.id}`}
                        className="btn btn-ghost btn-circle btn-xs"
                      >
                        <MdMoreVert />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box border border-base-200 shadow-lg w-40 z-10"
                      >
                        <li>
                          <a className="text-sm gap-2">
                            <MdShield className="text-primary" /> Make Admin
                          </a>
                        </li>
                        <li>
                          <a className="text-sm text-error gap-2">
                            <MdBlock className="text-error" /> Suspend
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
