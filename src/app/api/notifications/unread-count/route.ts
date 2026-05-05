import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationModel = (prisma as any).notification ?? (prisma as any).notifications;
    const count = await notificationModel.count({
      where: { userId: session.user.id, read: false },
    })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
    return NextResponse.json({ count: 0 })
  }
}
