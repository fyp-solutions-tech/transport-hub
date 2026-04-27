// src/app/api/analytics/export/route.ts
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { session } = await requireRole('DRIVER')
    
    const allRides = await prisma.rides.findMany({
      where: { driverId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Create CSV header
    const headers = [
      'Ride ID',
      'Pickup',
      'Dropoff',
      'Fare (PKR)',
      'Distance (km)',
      'Duration (min)',
      'Vehicle Type',
      'Status',
      'Rating',
      'Date',
      'Payment Method',
    ]

    // Create CSV rows
    const rows = allRides.map((r: any) => [
      r.id,
      `"${(r.pickup || r.pickupAddress || '').replace(/"/g, '""')}"`,
      `"${(r.dropoff || r.dropoffAddress || '').replace(/"/g, '""')}"`,
      r.fare || 0,
      r.distanceKm || 0,
      r.durationMin || 0,
      r.vehicleType || 'car',
      r.status || 'COMPLETED',
      r.rating || 'N/A',
      new Date(r.createdAt).toISOString().split('T')[0],
      r.paymentMethod || 'cash',
    ])

    // Combine into CSV string
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ride-report-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}