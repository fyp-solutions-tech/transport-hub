import { requireRole } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { DashboardContent } from "./DashboardContent"
import { MdErrorOutline } from "react-icons/md"

export default async function UserDashboardPage() {
  let rides: any[] = []
  let error: string | null = null
  let firstName: string = ""

  try {
    const { session } = await requireRole("USER")
    firstName = session.user.name.split(" ")[0]

    rides = await prisma.ride.findMany({
      where: { passengerId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fare: true,
        rating: true,
        status: true,
        vehicleType: true,
        pickupAddress: true,
        dropoffAddress: true,
        createdAt: true,
      },
    })
  } catch (err) {
    console.error('Failed to load dashboard:', err)
    error = "Failed to load your dashboard. Please try again later."
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
          <MdErrorOutline className="text-error text-4xl" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-base-content">Oops! Something went wrong</h2>
          <p className="text-base-content/60">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary gap-2"
        >
          Try Again
        </button>
      </div>
    )
  }

  return <DashboardContent firstName={firstName} initialRides={rides} />
}
