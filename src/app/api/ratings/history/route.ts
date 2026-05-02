// src/app/api/ratings/history/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { session } = await requireRole('DRIVER')
    const rides = await prisma.ride.findMany({
      where: { driverId: session.user.id, rating: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    const userIds = [...new Set(rides.map((r) => r.passengerId))]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u.name]))

    const ratings = rides.map((ride) => ({
      id: ride.id,
      rideId: ride.id,
      rating: ride.rating ?? 0,
      comment: '',
      categories: [],
      riderName: userMap.get(ride.passengerId) ?? 'Passenger',
      driverName: session.user.name,
      pickup: ride.pickupAddress,
      dropoff: ride.dropoffAddress,
      fare: `PKR ${Math.round(ride.fare ?? 0)}`,
      createdAt: ride.createdAt.toISOString(),
    }))

    return NextResponse.json({ ratings })
  } catch (error) {
    console.error('Failed to fetch rating history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rating history' },
      { status: 500 }
    )
  }
}