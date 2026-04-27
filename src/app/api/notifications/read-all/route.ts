import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TEMP_USER_ID = 'user-1'

export async function PUT() {
  try {
    await prisma.notification.updateMany({
      where: { userId: TEMP_USER_ID, read: false },
      data: { read: true },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to mark all as read:', error)
    return NextResponse.json({ error: 'Failed to mark all as read' }, { status: 500 })
  }
}
