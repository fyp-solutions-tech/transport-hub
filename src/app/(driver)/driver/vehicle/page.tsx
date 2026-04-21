import { MdDirectionsCar, MdEdit, MdCheckCircle, MdWarning, MdElectricCar } from "react-icons/md";

export default function DriverVehiclePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Vehicle</h1>
        <p className="text-base-content/60 mt-1">Manage your vehicle information</p>
      </div>

      {/* Vehicle card */}
      <div className="card bg-gradient-to-br from-accent to-accent/70 text-accent-content shadow-lg">
        <div className="card-body gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">Current Vehicle</p>
              <h2 className="text-2xl font-bold mt-0.5">Toyota Axio</h2>
              <p className="text-sm opacity-75">2019 · White</p>
            </div>
            <MdElectricCar className="text-6xl opacity-30" />
          </div>
          <div className="bg-accent-content/10 rounded-xl p-3 mt-2">
            <p className="text-center font-mono font-bold text-lg tracking-widest">
              Dhaka–Ka 11–1234
            </p>
          </div>
          <div className="flex gap-4 text-sm mt-1">
            <div>
              <p className="opacity-75">Type</p>
              <p className="font-semibold">Economy</p>
            </div>
            <div>
              <p className="opacity-75">Seats</p>
              <p className="font-semibold">4</p>
            </div>
            <div>
              <p className="opacity-75">AC</p>
              <p className="font-semibold">Yes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Document status */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-0">
          <h2 className="font-semibold mb-3">Document Status</h2>
          {[
            { label: "Vehicle Registration", status: "verified", expiry: "Dec 2026" },
            { label: "Driver's License", status: "verified", expiry: "Mar 2027" },
            { label: "Insurance", status: "expiring", expiry: "May 2026" },
            { label: "Fitness Certificate", status: "pending", expiry: "—" },
          ].map((doc, i) => (
            <div key={doc.label}>
              {i !== 0 && <div className="divider my-0" />}
              <div className="flex items-center gap-3 py-2">
                {doc.status === "verified" ? (
                  <MdCheckCircle className="text-success text-xl shrink-0" />
                ) : (
                  <MdWarning className={`text-xl shrink-0 ${doc.status === "expiring" ? "text-warning" : "text-error"}`} />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.label}</p>
                  <p className="text-xs text-base-content/50">
                    {doc.status === "pending" ? "Upload required" : `Expires: ${doc.expiry}`}
                  </p>
                </div>
                <span
                  className={`badge badge-sm ${
                    doc.status === "verified"
                      ? "badge-success"
                      : doc.status === "expiring"
                      ? "badge-warning"
                      : "badge-error"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit fields */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-4">
          <h2 className="font-semibold">Update Vehicle Info</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Make", placeholder: "e.g. Toyota", id: "vehicle-make" },
              { label: "Model", placeholder: "e.g. Axio", id: "vehicle-model" },
              { label: "Year", placeholder: "e.g. 2019", id: "vehicle-year" },
              { label: "Color", placeholder: "e.g. White", id: "vehicle-color" },
            ].map((f) => (
              <div key={f.id} className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">{f.label}</span>
                </label>
                <input
                  id={f.id}
                  type="text"
                  placeholder={f.placeholder}
                  className="input input-bordered input-sm"
                />
              </div>
            ))}
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs font-medium">License Plate</span>
            </label>
            <input
              id="vehicle-plate"
              type="text"
              placeholder="e.g. Dhaka-Ka 11-1234"
              className="input input-bordered input-sm"
            />
          </div>
        </div>
      </div>

      <button id="save-vehicle-btn" className="btn btn-accent btn-block gap-2">
        <MdEdit />
        Save Vehicle Details
      </button>
    </div>
  );
}
