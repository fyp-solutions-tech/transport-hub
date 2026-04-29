// src/app/api/ratings/pending/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

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
    
    const pendingRidesRaw = await prisma.ride.findMany({
      where: {
        driverId: session.user.id,
        status: 'COMPLETED',
        rating: null,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    const userIds = [...new Set(pendingRidesRaw.map((r) => r.passengerId))]
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    })
    const userMap = new Map(users.map((u) => [u.id, u.name]))

    const pendingRides = pendingRidesRaw.map((ride) => ({
      id: ride.id,
      riderName: userMap.get(ride.passengerId) ?? 'Passenger',
      date: ride.createdAt.toISOString().split('T')[0],
      fare: `৳${ride.fare ?? 0}`,
    }))
    
    return NextResponse.json({ rides: pendingRides })
  } catch (error) {
    console.error('Failed to fetch pending ratings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending ratings' },
      { status: 500 }
    )
  }
}