// src/app/api/analytics/overview/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { session } = await requireRole('DRIVER') // Or allow both roles
    
    const driverId = session.user.id
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch all rides for this driver
    const allRides = await prisma.ride.findMany({
      where: { 
        driverId,
        status: 'COMPLETED' 
      },
      orderBy: { createdAt: 'desc' },
    })

    // Today's stats
    const todayRides = allRides.filter(r => new Date(r.createdAt) >= startOfDay)
    const todayRevenue = todayRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
    const todayTrips = todayRides.length

    // Weekly stats
    const weekRides = allRides.filter(r => new Date(r.createdAt) >= startOfWeek)
    const weekRevenue = weekRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
    const weekTrips = weekRides.length

    // Monthly stats
    const monthRides = allRides.filter(r => new Date(r.createdAt) >= startOfMonth)
    const monthRevenue = monthRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
    const monthTrips = monthRides.length

    // Total stats
    const totalRevenue = allRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0)
    const totalTrips = allRides.length

    // Average rating
    const ratedRides = allRides.filter((r: any) => r.rating)
    const avgRating = ratedRides.length > 0
      ? ratedRides.reduce((sum: number, r: any) => sum + r.rating, 0) / ratedRides.length
      : 0

    // Delay count (rides that took longer than estimated)
    const delayedRides = allRides.filter((r: any) => {
      if (!r.durationMin || !r.actualDuration) return false
      return r.actualDuration > r.durationMin * 1.2 // 20% more than estimated
    })

    // Peak hours analysis
    const hourlyDistribution = Array(24).fill(0)
    allRides.forEach((r: any) => {
      const hour = new Date(r.createdAt).getHours()
      hourlyDistribution[hour]++
    })

    // Vehicle type distribution
    const vehicleDistribution: Record<string, number> = {}
    allRides.forEach((r: any) => {
      const type = r.vehicleType || 'car'
      vehicleDistribution[type] = (vehicleDistribution[type] || 0) + 1
    })

    return NextResponse.json({
      overview: {
        today: { trips: todayTrips, revenue: todayRevenue },
        week: { trips: weekTrips, revenue: weekRevenue },
        month: { trips: monthTrips, revenue: monthRevenue },
        total: { trips: totalTrips, revenue: totalRevenue },
        avgRating: Math.round(avgRating * 10) / 10,
        delayedTrips: delayedRides.length,
        delayedPercentage: totalTrips > 0 ? Math.round((delayedRides.length / totalTrips) * 100) : 0,
      },
      charts: {
        hourlyDistribution,
        vehicleDistribution,
        weeklyRevenue: Array(7).fill(0).map((_, i) => {
          const day = new Date(startOfWeek)
          day.setDate(day.getDate() + i)
          const dayRides = weekRides.filter(r => 
            new Date(r.createdAt).toDateString() === day.toDateString()
          )
          return {
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
            revenue: dayRides.reduce((sum: number, r: any) => sum + (r.fare || 0), 0),
            trips: dayRides.length,
          }
        }),
      },
      recentRides: allRides.slice(0, 10).map((r: any) => ({
        id: r.id,
        pickup: r.pickup || r.pickupAddress,
        dropoff: r.dropoff || r.dropoffAddress,
        fare: r.fare,
        rating: r.rating,
        vehicleType: r.vehicleType,
        duration: r.durationMin,
        actualDuration: r.actualDuration,
        isDelayed: r.actualDuration && r.durationMin ? r.actualDuration > r.durationMin * 1.2 : false,
        date: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
