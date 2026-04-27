// src/app/api/ratings/pending/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'

export async function GET() {
  try {
    // Use your existing session check
    const { session } = await requireRole('DRIVER')
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Here you would fetch pending ratings from your database
    // Example:
    // const pendingRides = await prisma.ride.findMany({
    //   where: {
    //     driverId: session.user.id,
    //     status: 'COMPLETED',
    //     driverRating: null,
    //   },
    //   include: {
    //     rider: {
    //       select: {
    //         name: true,
    //       }
    //     }
    //   }
    // })
    
    // For now, return example data
    const pendingRides = [
      {
        id: 'ride_001',
        riderName: 'Ahmed Khan',
        date: '2026-04-25',
        fare: '৳450',
      },
      {
        id: 'ride_002',
        riderName: 'Sara Ali',
        date: '2026-04-24',
        fare: '৳850',
      }
    ]
    
    return NextResponse.json({ rides: pendingRides })
  } catch (error) {
    console.error('Failed to fetch pending ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending ratings' },
      { status: 500 }
    )
  }
}