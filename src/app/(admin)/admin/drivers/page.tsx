import { MdDirectionsCar, MdSearch, MdMoreVert, MdCheckCircle, MdBlock, MdWarning } from "react-icons/md";

const mockDrivers = [
  { id: "d1", name: "Ahmed Hassan", email: "ahmed@example.com", vehicle: "Toyota Axio", plate: "Dhaka-Ka 11-1234", trips: 47, rating: 4.8, status: "active", docStatus: "verified" },
  { id: "d2", name: "Rahim Uddin", email: "rahim@example.com", vehicle: "Honda Fit", plate: "Dhaka-Ga 22-5678", trips: 12, rating: 4.5, status: "active", docStatus: "expiring" },
  { id: "d3", name: "Fatema Khatun", email: "fatema@example.com", vehicle: "Suzuki Alto", plate: "Dhaka-Kha 33-9012", trips: 0, rating: null, status: "pending", docStatus: "pending" },
];

const docBadge: Record<string, string> = {
  verified: "badge-success",
  expiring: "badge-warning",
  pending: "badge-error",
};

export default function AdminDriversPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Drivers</h1>
          <p className="text-base-content/60 mt-1">Manage drivers and approvals</p>
        </div>
        <div className="stat bg-base-100 border border-base-200 rounded-xl py-3 px-5 shadow-sm">
          <div className="stat-figure text-accent">
            <MdDirectionsCar className="text-2xl" />
          </div>
          <div className="stat-value text-xl">{mockDrivers.length}</div>
          <div className="stat-desc">Total drivers</div>
        </div>
      </div>

      {/* Alert */}
      <div className="alert alert-warning py-3">
        <MdWarning className="text-lg" />
        <span className="text-sm">
          <strong>1 driver</strong> has pending document verification. Review below.
        </span>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <label className="input input-bordered flex items-center gap-2 flex-1 max-w-sm">
          <MdSearch className="text-base-content/50 text-lg" />
          <input id="driver-search" type="text" placeholder="Search by name or vehicle" className="grow text-sm" />
        </label>
        <select id="driver-status-filter" className="select select-bordered text-sm">
          <option>All statuses</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Trips</th>
                <th>Rating</th>
                <th>Documents</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {mockDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-accent/10 text-accent rounded-full w-9">
                          <span className="text-sm font-semibold">
                            {driver.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{driver.name}</p>
                        <p className="text-xs text-base-content/50">{driver.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm">{driver.vehicle}</p>
                    <p className="text-xs text-base-content/50 font-mono">{driver.plate}</p>
                  </td>
                  <td className="text-sm">{driver.trips}</td>
                  <td className="text-sm">
                    {driver.rating ? (
                      <div className="flex items-center gap-1">
                        <span className="text-warning">★</span>
                        <span>{driver.rating}</span>
                      </div>
                    ) : (
                      <span className="text-base-content/40">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-sm ${docBadge[driver.docStatus]}`}>
                      {driver.docStatus}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        driver.status === "active"
                          ? "badge-success"
                          : driver.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0} id={`driver-actions-${driver.id}`} className="btn btn-ghost btn-circle btn-xs">
                        <MdMoreVert />
                      </button>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box border border-base-200 shadow-lg w-40 z-10"
                      >
                        <li>
                          <a className="text-sm gap-2">
                            <MdCheckCircle className="text-success" /> Approve
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
