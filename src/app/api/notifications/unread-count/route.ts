import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TEMP_USER_ID = 'user-1'

export async function GET() {
  try {
    const count = await prisma.notification.count({
      where: { userId: TEMP_USER_ID, read: false },
    })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to fetch unread count:', error)
    return NextResponse.json({ count: 0 })
  }
}
