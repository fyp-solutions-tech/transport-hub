import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TEMP_USER_ID = 'user-1'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: TEMP_USER_ID },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId: TEMP_USER_ID } }),
    ])

    return NextResponse.json({ notifications, total, hasMore: skip + limit < total })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ notifications: [], total: 0, hasMore: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const notification = await prisma.notification.create({
      data: {
        userId: TEMP_USER_ID,
        type: body.type || 'SYSTEM',
        title: body.title,
        message: body.message,
        data: body.data || {},
      },
    })
    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
