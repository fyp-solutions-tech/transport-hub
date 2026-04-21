import Link from "next/link";
import { MdDirectionsCar, MdStar, MdLocationOn } from "react-icons/md";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const statusBadge: Record<string, string> = {
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
  PENDING: "badge-warning",
  SEARCHING: "badge-info",
  ACCEPTED: "badge-info",
  ARRIVING: "badge-info",
  IN_PROGRESS: "badge-primary",
};

export default async function RidesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) return null;

  const rides = await prisma.ride.findMany({
    where: {
      passengerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      driver: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Rides</h1>
        <p className="text-base-content/60 mt-1">Your complete ride history</p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Completed", "Cancelled", "Ongoing"].map((f) => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            className={`btn btn-sm rounded-full ${f === "All" ? "btn-primary" : "btn-ghost border border-base-200"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Rides list */}
      <div className="space-y-4">
        {rides.map((ride) => (
          <Link
            key={ride.id}
            href={`/rides/${ride.id}`}
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow block"
          >
            <div className="card-body p-5 gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MdDirectionsCar className="text-primary text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm capitalize">{ride.vehicleType}</p>
                    <p className="text-xs text-base-content/50">
                      {new Date(ride.createdAt).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric", 
                        year: "numeric" 
                      })} · {new Date(ride.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">Rs {ride.fare?.toLocaleString()}</p>
                  <span className={`badge badge-sm ${statusBadge[ride.status]}`}>
                    {ride.status.toLowerCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-0.5 h-4 bg-base-300" />
                  <MdLocationOn className="text-error text-base -m-0.5" />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0">
                  <p className="text-base-content/80 truncate">{ride.pickupAddress}</p>
                  <p className="text-base-content/80 truncate">{ride.dropoffAddress}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-base-content/60 mt-1">
                  <MdStar className="text-warning" />
                  <span>5.0</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {rides.length === 0 && (
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-16 text-center">
            <MdDirectionsCar className="text-5xl text-base-content/20 mb-3" />
            <p className="font-medium text-base-content/60">No rides found</p>
            <Link href="/book" className="btn btn-primary btn-sm mt-4">
              Book a ride
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
