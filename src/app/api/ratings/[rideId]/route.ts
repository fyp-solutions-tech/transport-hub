// src/app/api/ratings/[rideId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ rideId: string }> }
) {
  try {
    const { session } = await requireRole('DRIVER')
    const { rideId } = await params
    const ride = await prisma.ride.findUnique({ where: { id: rideId } })
    if (!ride || ride.driverId !== session.user.id) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    }

    return NextResponse.json({
      exists: ride.rating != null,
      rating: ride.rating
    })
  } catch (error) {
    console.error('Failed to fetch rating:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating' },
      { status: 500 }
    )
  }
}