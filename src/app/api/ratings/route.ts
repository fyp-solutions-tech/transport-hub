// src/app/api/ratings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const submitRatingSchema = z.object({
  rideId: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(500).optional(),
  type: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { session } = await requireRole('DRIVER')
    const parsed = submitRatingSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid rating payload' },
        { status: 400 }
      )
    }
    const { rideId, rating } = parsed.data

    const ride = await prisma.ride.findUnique({ where: { id: rideId } })
    if (!ride || ride.driverId !== session.user.id) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    }
    if (ride.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Only completed rides can be rated' }, { status: 400 })
    }

    await prisma.ride.update({
      where: { id: rideId },
      data: { rating },
    })

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
    const rides = await prisma.ride.findMany({
      where: { driverId: session.user.id, rating: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const userIds = [...new Set(rides.map((r: any) => r.passengerId))]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    })
    const userMap = new Map(users.map((u: any) => [u.id, u.name]))

    const ratings = rides.map((ride: any) => ({
      id: ride.id,
      rideId: ride.id,
      rating: ride.rating ?? 0,
      comment: '',
      categories: [],
      riderName: userMap.get(ride.passengerId) ?? 'Passenger',
      pickup: ride.pickupAddress,
      dropoff: ride.dropoffAddress,
      fare: `PKR ${Math.round(ride.fare ?? 0)}`,
      createdAt: ride.createdAt.toISOString(),
    }))

    return NextResponse.json({ ratings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    )
  }
}