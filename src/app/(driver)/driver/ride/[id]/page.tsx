import Link from "next/link";
import { MdArrowBack, MdMyLocation, MdLocationOn, MdPhone, MdNavigation, MdCheckCircle, MdCancel } from "react-icons/md";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DriverRidePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/driver/dashboard" className="btn btn-ghost btn-circle btn-sm">
          <MdArrowBack className="text-lg" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Active Ride</h1>
          <p className="text-base-content/60 text-sm">Ride #{id}</p>
        </div>
        <span className="badge badge-warning animate-pulse ml-auto">In Progress</span>
      </div>

      {/* Map placeholder */}
      <div className="rounded-2xl border border-base-200 bg-base-200/50 h-72 flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-base-content/40 z-10">
          <MdNavigation className="text-5xl mx-auto mb-2 text-accent/40" />
          <p className="text-sm font-medium">Navigation view</p>
          <p className="text-xs">Turn-by-turn directions here</p>
        </div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 30px,currentColor 30px,currentColor 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,currentColor 30px,currentColor 31px)",
          }}
        />
        {/* Route line */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-1 h-48 bg-accent rounded-full rotate-12" />
        </div>
      </div>

      {/* Passenger info */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body flex-row items-center gap-4 py-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-12">
              <span className="text-lg font-bold">R</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold">Razia Sultana</p>
            <p className="text-sm text-base-content/60">Passenger · ৳87 (Cash)</p>
          </div>
          <a href="tel:+880123456789" className="btn btn-circle btn-accent btn-sm">
            <MdPhone className="text-base" />
          </a>
        </div>
      </div>

      {/* Route */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-3">
          <h2 className="font-semibold text-sm">Trip Route</h2>
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 mt-1">
              <MdMyLocation className="text-primary text-lg" />
              <div className="w-0.5 h-5 bg-base-300" />
              <MdLocationOn className="text-error text-lg" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs text-base-content/50">Pickup</p>
                <p className="text-sm font-medium">123 Main Street, Dhaka</p>
              </div>
              <div>
                <p className="text-xs text-base-content/50">Drop-off</p>
                <p className="text-sm font-medium">Gulshan 2 Circle, Dhaka</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status steps */}
      <div className="card bg-accent/5 border border-accent/20">
        <div className="card-body py-4">
          <ul className="steps steps-vertical text-sm">
            <li className="step step-accent">Picked up passenger</li>
            <li className="step step-accent">En route to destination</li>
            <li className="step">Arrived</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          id="cancel-ride-btn"
          className="btn btn-outline btn-error gap-2"
        >
          <MdCancel />
          Cancel Ride
        </button>
        <button
          id="end-ride-btn"
          className="btn btn-success gap-2"
        >
          <MdCheckCircle />
          End Ride
        </button>
      </div>
    </div>
  );
}
