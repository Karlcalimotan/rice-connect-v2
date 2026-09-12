import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// All 11 pilot notification types
export const NotificationTypes = {
  NEW_HARVEST: 'NewHarvestPosted',
  INTEREST_RECEIVED: 'InterestReceived',
  DRIVER_ASSIGNED: 'DriverAssigned',
  PICKUP_SCHEDULED: 'PickupScheduled',
  PAYMENT_PAID: 'PaymentPaid',
  WEIGHT_LOGGED: 'WeightLogged',
  LOW_STOCK: 'LowStock',
  BOOKING_ASSIGNED: 'BookingAssigned',
  RICE_READY: 'RiceReadyForPickup',
  RELEASE_REQUESTED: 'ReleaseRequested',
  DELIVERY_SCHEDULED: 'DeliveryScheduled',
  DELIVERY_RECEIVED: 'delivery.received',
  DELIVERY_IN_TRANSIT: 'delivery.in_transit',
} as const

export type NotificationType = (typeof NotificationTypes)[keyof typeof NotificationTypes]

export async function createNotification(
  userId: string,
  type: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        type,
        notifiableType: 'App\\Models\\User',
        notifiableId: userId,
        data: data as unknown as Prisma.JsonObject,
        notificationStatus: 'unread',
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function notifyAllMillers(
  type: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const millers = await prisma.user.findMany({
      where: { role: 'MILLER' },
      select: { id: true },
    })

    if (millers.length === 0) return

    await prisma.notification.createMany({
      data: millers.map((miller) => ({
        type,
        notifiableType: 'App\\Models\\User',
        notifiableId: miller.id,
        data: data as unknown as Prisma.JsonObject,
        notificationStatus: 'unread',
      })),
    })
  } catch (error) {
    console.error('Failed to notify millers:', error)
  }
}

export async function notifyAllFarmers(
  type: string,
  data: Record<string, unknown>
): Promise<void> {
  const farmers = await prisma.user.findMany({
    where: { role: 'FARMER' },
    select: { id: true },
  })

  if (farmers.length === 0) return

  await prisma.notification.createMany({
    data: farmers.map((farmer) => ({
      type,
      notifiableType: 'User',
      notifiableId: farmer.id,
      data: data as unknown as Prisma.JsonObject,
      notificationStatus: 'unread',
    })),
  })
}

// Helper: notify all drivers
export async function notifyAllDrivers(
  type: string,
  data: Record<string, unknown>
): Promise<void> {
  const drivers = await prisma.user.findMany({
    where: { role: 'DRIVER' },
    select: { id: true },
  })

  if (drivers.length === 0) return

  await prisma.notification.createMany({
    data: drivers.map((driver) => ({
      type,
      notifiableType: 'User',
      notifiableId: driver.id,
      data: data as unknown as Prisma.JsonObject,
      notificationStatus: 'unread',
    })),
  })
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<void> {
  await prisma.notification.update({
    where: { id: notificationId },
    data: {
      notificationStatus: 'read',
      readAt: new Date(),
    },
  })
}
