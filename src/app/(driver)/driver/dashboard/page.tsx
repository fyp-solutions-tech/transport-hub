// src/app/(driver)/driver/dashboard/page.tsx
import { requireRole } from "@/lib/session";
import Link from "next/link";
import {
  MdToggleOn,
  MdDirectionsCar,
  MdAttachMoney,
  MdStar,
  MdHistory,
  MdLocationOn,
  MdNotifications,
  MdRateReview,
  MdTrendingUp,
} from "react-icons/md";
import { prisma } from "@/lib/prisma";

export default async function DriverDashboardPage() {
  const { session } = await requireRole("DRIVER");
  const firstName = session.user.name.split(" ")[0];

  // Fetch driver stats
  let todayEarnings = 0
  let tripsToday = 0
  let avgRating = 0
  let totalRatings = 0
  let totalTrips = 0
  let ratedTripsData: any[] = [] // Move here to fix type error

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Today's trips
    const todayTrips = await prisma.ride.findMany({
      where: {
        driverId: session.user.id,
        createdAt: { gte: today },
        status: "COMPLETED",
      },
    })
    tripsToday = todayTrips.length
    todayEarnings = todayTrips.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)

    // All trips
    const allTrips = await prisma.ride.findMany({
      where: { driverId: session.user.id },
    })
    totalTrips = allTrips.length

    // Ratings received - assign to outer variable
    ratedTripsData = allTrips.filter((r: any) => r.rating)
    totalRatings = ratedTripsData.length
    if (totalRatings > 0) {
      avgRating = ratedTripsData.reduce((sum: number, r: any) => sum + r.rating, 0) / totalRatings
    }
  } catch (error) {
    console.error('Failed to fetch driver stats:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {firstName} 🚗</h1>
          <p className="text-base-content/60 mt-1">Driver Dashboard</p>
        </div>
        {/* Availability Toggle */}
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body flex-row items-center gap-4 py-3 px-5">
            <div>
              <p className="font-semibold text-sm">Availability</p>
              <p className="text-xs text-base-content/50">Toggle to go online</p>
            </div>
            <input
              id="availability-toggle"
              type="checkbox"
              className="toggle toggle-success toggle-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center mb-3">
              <MdAttachMoney className="text-success text-2xl" />
            </div>
            <p className="text-2xl font-bold">৳{todayEarnings}</p>
            <p className="text-sm text-base-content/60">Today's Earnings</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <MdDirectionsCar className="text-primary text-2xl" />
            </div>
            <p className="text-2xl font-bold">{tripsToday}</p>
            <p className="text-sm text-base-content/60">Trips Today</p>
          </div>
        </div>

        {/* Avg Rating - FROM PASSENGERS */}
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
              <MdStar className="text-warning text-2xl" />
            </div>
            <div className="flex items-center gap-1">
              <p className="text-2xl font-bold">
                {avgRating > 0 ? avgRating.toFixed(1) : "—"}
              </p>
              {avgRating > 0 && (
                <span className="text-warning text-lg">★</span>
              )}
            </div>
            <p className="text-sm text-base-content/60">
              Avg Rating {totalRatings > 0 && `(${totalRatings})`}
            </p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-info/10 flex items-center justify-center mb-3">
              <MdHistory className="text-info text-2xl" />
            </div>
            <p className="text-2xl font-bold">{totalTrips}</p>
            <p className="text-sm text-base-content/60">Total Trips</p>
          </div>
        </div>
      </div>

      {/* Driver Rating Section - FROM PASSENGERS */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title text-lg">
              <MdRateReview className="text-warning mr-2" />
              My Ratings
            </h2>
            <Link href="/driver/ratings" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>

          {totalRatings === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3">
                <MdStar className="text-3xl text-base-content/30" />
              </div>
              <p className="font-medium text-base-content/60">No ratings yet</p>
              <p className="text-sm text-base-content/40 mt-1">
                Complete trips to receive ratings from passengers
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Rating distribution - FIXED: use ratedTripsData */}
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratedTripsData.filter((r: any) => r.rating === star).length
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-xs font-medium">{star}</span>
                      <MdStar className="text-warning text-xs" />
                    </div>
                    <progress 
                      className="progress progress-warning flex-1" 
                      value={percentage} 
                      max="100"
                    />
                    <span className="text-xs text-base-content/50 w-8 text-right">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Incoming requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Incoming Requests</h2>
          <span className="badge badge-ghost">0 pending</span>
        </div>

        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
              <MdNotifications className="text-3xl text-base-content/30" />
            </div>
            <p className="font-medium text-base-content/60">No ride requests yet</p>
            <p className="text-sm text-base-content/40 mt-1">
              Toggle availability to start receiving requests
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/driver/trips"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdHistory className="text-4xl text-primary mb-2" />
              <h3 className="card-title text-base">Trip History</h3>
              <p className="text-sm text-base-content/60">View past trips & earnings</p>
            </div>
          </Link>
          
          {/* My Ratings - DRIVER SEES RATINGS FROM PASSENGERS */}
          <Link
            href="/driver/ratings"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdRateReview className="text-4xl text-warning mb-2" />
              <h3 className="card-title text-base">My Ratings</h3>
              <p className="text-sm text-base-content/60">See what passengers say</p>
            </div>
          </Link>
          
          {/* Reports & Analytics - NEW */}
          <Link
            href="/driver/analytics"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdTrendingUp className="text-4xl text-info mb-2" />
              <h3 className="card-title text-base">Reports & Analytics</h3>
              <p className="text-sm text-base-content/60">Performance & export data</p>
            </div>
          </Link>
          
          <Link
            href="/driver/profile"
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <MdLocationOn className="text-4xl text-success mb-2" />
              <h3 className="card-title text-base">Profile</h3>
              <p className="text-sm text-base-content/60">Edit your driver profile</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}