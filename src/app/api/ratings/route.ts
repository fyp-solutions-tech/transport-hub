// src/app/api/ratings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const { session } = await requireRole('DRIVER')
    const body = await request.json()
    const { rideId, rating, comment, type = 'RIDER' } = body

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!rideId) {
      return NextResponse.json(
        { error: 'Ride ID is required' },
        { status: 400 }
      )
    }

    // Save to database
    // await prisma.rating.create({
    //   data: {
    //     rideId,
    //     rating,
    //     comment: comment || '',
    //     ratedBy: session.user.id,
    //     type,
    //     createdAt: new Date(),
    //   }
    // })

    // Update ride status
    // await prisma.ride.update({
    //   where: { id: rideId },
    //   data: {
    //     driverRating: rating,
    //     driverComment: comment,
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully'
    })
  } catch (error) {
    console.error('Failed to submit rating:', error)
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { session } = await requireRole('DRIVER')
    
    // Fetch ratings for this driver
    // const ratings = await prisma.rating.findMany({
    //   where: {
    //     ride: {
    //       driverId: session.user.id,
    //     },
    //     type: 'DRIVER',
    //   },
    //   include: {
    //     ride: {
    //       include: {
    //         rider: true,
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
        comment: 'Excellent rider, very polite!',
        categories: ['communication', 'punctuality'],
        riderName: 'Ahmed Khan',
        pickup: 'Central Station',
        dropoff: 'Algora Mall',
        fare: '৳450',
        createdAt: new Date().toISOString(),
      }
    ]

    return NextResponse.json({ ratings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}