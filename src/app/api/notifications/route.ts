import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const notificationModel = (prisma as any).notification ?? (prisma as any).notifications;
    const [notifications, total] = await Promise.all([
      notificationModel.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      notificationModel.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({ notifications, total, hasMore: skip + limit < total })
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json({ notifications: [], total: 0, hasMore: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationModel = (prisma as any).notification ?? (prisma as any).notifications;
    const body = await req.json()
    const notification = await notificationModel.create({
      data: {
        userId: session.user.id,
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
