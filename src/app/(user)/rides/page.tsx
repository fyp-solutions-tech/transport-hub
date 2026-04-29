// src/app/(user)/rides/page.tsx
import { requireRole } from "@/lib/session"
import { prisma } from "@/lib/prisma"  // ← Add this import!

export default async function RidesPage() {
  const { session } = await requireRole("USER")
  
  // Add error handling
  let rides: any[] = []
  
  try {
    rides = await prisma.ride.findMany({
      where: { passengerId: session.user.id },
      orderBy: { createdAt: "desc" },
      // Don't use select if you're not sure of field names
      // Let it return all fields first
    })
  } catch (error) {
    console.error('Failed to fetch rides:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Rides</h1>
        <p className="text-base-content/60 mt-1">View your ride history</p>
      </div>

      {rides.length === 0 ? (
        <div className="card bg-base-100 border border-base-200">
          <div className="card-body items-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-3">
              <span className="text-3xl">🏍️</span>
            </div>
            <p className="font-medium text-base-content/60">No rides yet</p>
            <p className="text-sm text-base-content/40 mt-1">
              Book your first ride to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {rides.map((ride: any) => (
            <div key={ride.id} className="card bg-base-100 border border-base-200 shadow-sm">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {ride.pickup || 'Location'} → {ride.dropoff || 'Destination'}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ৳{ride.fare || ride.price || 0}
                    </p>
                    <span className={`badge badge-sm ${
                      ride.status === 'COMPLETED' ? 'badge-success' :
                      ride.status === 'CANCELLED' ? 'badge-error' :
                      'badge-warning'
                    }`}>
                      {ride.status || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}