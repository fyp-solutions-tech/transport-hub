import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function PUT() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationModel = (prisma as any).notification ?? (prisma as any).notifications;
    await notificationModel.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark all as read:', error)
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
  }
}
