import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createNotification } from '@/lib/notifications'

const validTransitions: Record<string, string> = {
  pending: 'assigned',
  assigned: 'at_pickup',
  at_pickup: 'in_transit',
  in_transit: 'delivered',
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status: newStatus } = await request.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { harvestBatch: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Validate transition
    if (validTransitions[booking.status] !== newStatus) {
      return NextResponse.json(
        { error: `Cannot transition from ${booking.status} to ${newStatus}` },
        { status: 400 }
      )
    }

    // Money-gate for palay: payment must be authorized before transit
    if (
      booking.harvestBatchId &&
      newStatus === 'in_transit' &&
      booking.harvestBatch?.deliveryStatus !== 'Payment Authorized'
    ) {
      return NextResponse.json(
        { error: 'Miller must authorize payment before transit' },
        { status: 400 }
      )
    }

    const deliveryStatusMap: Record<string, string> = {
      assigned: 'Pending',
      at_pickup: 'Pending',
      in_transit: 'In Transit',
      delivered: 'Received',
    }

    // Update booking + sync delivery status on parent entity
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: newStatus },
      })

      if (booking.harvestBatchId) {
        const update: Record<string, unknown> = {
          deliveryStatus: deliveryStatusMap[newStatus] || 'Pending',
        }
        if (newStatus === 'in_transit') update.status = 'in_transit'
        if (newStatus === 'delivered') {
          update.status = 'received'
          update.deliveryStatus = 'Received'
        }
        await tx.harvestBatch.update({
          where: { id: booking.harvestBatchId },
          data: update,
        })
      }
    })

    // Notify relevant parties
    if (booking.harvestBatchId) {
      const batch = booking.harvestBatch
      if (batch && newStatus === 'delivered' && batch.userId) {
        await createNotification(batch.userId, 'delivery.received', {
          message: `Your palay delivery has been received by the miller`,
          bookingId: booking.id,
          batchId: batch.id,
        })
      }
      if (batch && newStatus === 'in_transit' && batch.userId) {
        await createNotification(batch.userId, 'delivery.in_transit', {
          message: `Your palay is on its way to the miller`,
          bookingId: booking.id,
          batchId: batch.id,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    )
  }
}
