// src/app/api/ratings/[rideId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rideId: string }> }  // ← Add Promise<>
) {
  try {
    const { rideId } = await params  // ← Add await

    // Check if rating exists for this ride
    // const existingRating = await db.ratings.findFirst({
    //   where: { rideId }
    // })

    return NextResponse.json({
      exists: false,
      rating: null
    })
  } catch (error) {
    console.error('Failed to fetch rating:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    )
  }
}