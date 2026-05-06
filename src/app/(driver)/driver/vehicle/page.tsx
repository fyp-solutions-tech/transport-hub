"use client";

import { useEffect, useState } from "react";
import { MdDirectionsCar, MdEdit, MdCheckCircle, MdWarning, MdElectricCar } from "react-icons/md";
import { toast } from "sonner";

interface VehicleData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehiclePlate: string;
  vehicleType: string;
}

export default function DriverVehiclePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<VehicleData>({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehicleColor: "",
    vehiclePlate: "",
    vehicleType: "economy",
  });

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await fetch("/api/driver/vehicle");
        const json = await res.json();
        if (json) {
          setData({
            vehicleMake: json.vehicleMake || "",
            vehicleModel: json.vehicleModel || "",
            vehicleYear: json.vehicleYear || "",
            vehicleColor: json.vehicleColor || "",
            vehiclePlate: json.vehiclePlate || "",
            vehicleType: json.vehicleType || "economy",
          });
        }
      } catch (error) {
        toast.error("Failed to load vehicle data");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/driver/vehicle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Vehicle details updated successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update vehicle details");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-accent"></span>
      </div>
    );
  }

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
              <h2 className="text-2xl font-bold mt-0.5">
                {data.vehicleMake} {data.vehicleModel} || "Not set"
              </h2>
              <p className="text-sm opacity-75">{data.vehicleYear} · {data.vehicleColor}</p>
            </div>
            <MdElectricCar className="text-6xl opacity-30" />
          </div>
          <div className="bg-accent-content/10 rounded-xl p-3 mt-2">
            <p className="text-center font-mono font-bold text-lg tracking-widest">
              {data.vehiclePlate || "PLATE-PENDING"}
            </p>
          </div>
          <div className="flex gap-4 text-sm mt-1">
            <div>
              <p className="opacity-75">Type</p>
              <p className="font-semibold capitalize">{data.vehicleType}</p>
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

      {/* Document status (MOCKED as requested for visual detail) */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-0">
          <h2 className="font-semibold mb-3">Document Status</h2>
          {[
            { label: "Vehicle Registration", status: "verified", expiry: "Dec 2026" },
            { label: "Driver's License", status: "verified", expiry: "Mar 2027" },
            { label: "Insurance", status: "expiring", expiry: "May 2026" },
            { label: "Fitness Certificate", status: "pending", expiry: "—" },
          ].map((doc: any, i: number) => (
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
                <span className={`badge badge-sm ${doc.status === "verified" ? "badge-success" : doc.status === "expiring" ? "badge-warning" : "badge-error"}`}>
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
              { label: "Make", id: "vehicle-make", key: "vehicleMake" },
              { label: "Model", id: "vehicle-model", key: "vehicleModel" },
              { label: "Year", id: "vehicle-year", key: "vehicleYear" },
              { label: "Color", id: "vehicle-color", key: "vehicleColor" },
            ].map((f: any) => (
              <div key={f.id} className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-medium">{f.label}</span>
                </label>
                <input
                  id={f.id}
                  type="text"
                  value={data[f.key as keyof VehicleData]}
                  onChange={(e: any) => setData({ ...data, [f.key]: e.target.value })}
                  className="input input-bordered input-sm"
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">License Plate</span>
              </label>
              <input
                id="vehicle-plate"
                type="text"
                value={data.vehiclePlate}
                onChange={(e: any) => setData({ ...data, vehiclePlate: e.target.value })}
                className="input input-bordered input-sm"
              />
            </div>
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-xs font-medium">Vehicle Category</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={data.vehicleType}
                onChange={(e: any) => setData({ ...data, vehicleType: e.target.value })}
                >
                <option value="economy">Economy</option>
                <option value="comfort">Comfort</option>
                <option value="moto">Moto</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`btn btn-accent btn-block gap-2 ${saving ? "loading" : ""}`}
      >
        {!saving && <MdEdit />}
        {saving ? "Saving..." : "Save Vehicle Details"}
      </button>
    </div>
  );
}
