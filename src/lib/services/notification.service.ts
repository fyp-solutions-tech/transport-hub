// src/lib/services/notification.service.ts
import { prisma } from '@/lib/prisma'  // Import your existing prisma instance

export type NotificationType = 'RIDE_ACCEPTED' | 'RIDE_STARTED' | 'RIDE_COMPLETED' | 'SYSTEM'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
}

export class NotificationService {
  private static model() {
    return (prisma as any).notification ?? (prisma as any).notifications;
  }

  static async create(params: CreateNotificationParams) {
    try {
      const notification = await this.model().create({
        data: {
          userId: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          data: params.data || {},
        },
      })
      return notification
    } catch (error) {
      console.error('Failed to create notification:', error)
      throw error
    }
  }

  static async getUnread(userId: string, limit = 10) {
    return this.model().findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  static async getAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const model = this.model();
    
    const [notifications, total] = await Promise.all([
      model.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      model.count({ where: { userId } }),
    ])

    return { notifications, total, hasMore: skip + limit < total }
  }

  static async markAsRead(notificationId: string, userId: string) {
    return this.model().updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    })
  }

  static async markAllAsRead(userId: string) {
    return this.model().updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  static async getUnreadCount(userId: string) {
    return this.model().count({
      where: { userId, read: false },
    })
  }
}