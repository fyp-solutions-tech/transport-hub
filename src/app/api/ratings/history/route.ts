// src/app/api/ratings/history/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'

export async function GET() {
  try {
    const { session } = await requireRole('DRIVER')
    
    // Fetch rating history
    // const ratings = await prisma.rating.findMany({
    //   where: {
    //     OR: [
    //       { ratedBy: session.user.id },
    //       { ride: { driverId: session.user.id } }
    //     ]
    //   },
    //   include: {
    //     ride: {
    //       include: {
    //         rider: true,
    //         driver: true,
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // })

    const ratings = [
      {
        id: '1',
        rideId: 'ride_001',
        rating: 5,
        comment: 'Great experience!',
        categories: ['punctuality', 'cleanliness'],
        riderName: 'Ahmed Khan',
        driverName: 'Mohsin Raza',
        pickup: 'Central Station',
        dropoff: 'Algora Mall',
        fare: '৳450',
        createdAt: new Date().toISOString(),
      }
    ]

    return NextResponse.json({ ratings })
  } catch (error) {
    console.error('Failed to fetch rating history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating history' },
      { status: 500 }
    )
  }
}