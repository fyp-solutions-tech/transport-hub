// src/app/(user)/dashboard/page.tsx
import { requireRole } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function UserDashboardPage() {
  const { session } = await requireRole("USER")
  const firstName = session.user.name.split(" ")[0]

  let totalRides = 0
  let totalSpent = 0
  
  try {
    const rides = await prisma.rides.findMany({
      where: { passengerId: session.user.id },
    })

    totalRides = rides.length
    totalSpent = rides
      .filter((r: any) => r.status === 'COMPLETED')
      .reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {firstName} 🎉</h1>
        <p className="text-base-content/60 mt-1">Ready for your next ride?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <span className="text-2xl">🏍️</span>
            </div>
            <p className="text-2xl font-bold">{totalRides}</p>
            <p className="text-sm text-base-content/60">Total Rides</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center mb-3">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-2xl font-bold">৳{totalSpent}</p>
            <p className="text-sm text-base-content/60">Total Spent</p>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="card-body p-5">
            <div className="w-11 h-11 rounded-xl bg-info/10 flex items-center justify-center mb-3">
              <span className="text-2xl">📍</span>
            </div>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-base-content/60">Saved Places</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Changed: passenger specific actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/book" 
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl mb-2">🏍️</span>
              <h3 className="card-title text-base">Book a Ride</h3>
              <p className="text-sm text-base-content/60">Select pickup & drop</p>
            </div>
          </Link>

          <Link 
            href="/rides" 
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl mb-2">📋</span>
              <h3 className="card-title text-base">Ride History</h3>
              <p className="text-sm text-base-content/60">View past rides & rate drivers</p>
            </div>
          </Link>

          <Link 
            href="/payments" 
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl mb-2">💳</span>
              <h3 className="card-title text-base">Payments</h3>
              <p className="text-sm text-base-content/60">Manage payment methods</p>
            </div>
          </Link>

          <Link 
            href="/profile" 
            className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className="card-body items-center text-center p-6">
              <span className="text-4xl mb-2">👤</span>
              <h3 className="card-title text-base">My Profile</h3>
              <p className="text-sm text-base-content/60">Edit your account</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Rides - only show if there are rides */}
      {totalRides > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Rides</h2>
          <Link href="/rides" className="btn btn-outline btn-block">
            View All Rides
          </Link>
        </div>
      )}
    </div>
  )
}