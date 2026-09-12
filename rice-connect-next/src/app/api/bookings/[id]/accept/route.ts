import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { driverId } = await request.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: Number(id) },
      })

      if (!booking || booking.status !== 'pending') {
        throw new Error('Job taken or unavailable.')
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: { driverId, status: 'assigned' },
      })

      // Sync driver_id back to HarvestBatch
      if (booking.harvestBatchId) {
        await tx.harvestBatch.update({
          where: { id: booking.harvestBatchId },
          data: { driverId, deliveryStatus: 'Pending' },
        })
      }
    })

    // Notify farmer
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { harvestBatch: { select: { userId: true } } },
    })

    if (booking?.harvestBatch?.userId) {
      const driver = await prisma.user.findUnique({
        where: { id: driverId },
        select: { firstName: true, lastName: true },
      })

      await createNotification(booking.harvestBatch.userId, 'driver.assigned', {
        message: `${driver?.firstName} ${driver?.lastName} has been assigned to your delivery`,
        bookingId: booking.id,
        driverName: driver ? `${driver.firstName} ${driver.lastName}` : 'Driver',
      })
    }

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
