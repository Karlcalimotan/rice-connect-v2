import { prisma } from '@/lib/prisma'

type BookingResult = {
  id: number
  status: string
}

export async function broadcastPalayPickup(
  batchId: number
): Promise<BookingResult> {
  try {
    const batch = await prisma.harvestBatch.findUnique({
      where: { id: batchId },
      include: {
        farmer: true,
        acceptedMiller: true,
      },
    })

    if (!batch) throw new Error('Harvest batch not found')

    const farmer = batch.farmer
    const miller = batch.acceptedMiller

    const origin =
      batch.location ||
      (typeof farmer.municipality === 'string'
        ? farmer.municipality
        : 'Unknown')

    let destination = 'Unknown'
    if (miller) {
      destination =
        typeof miller.municipality === 'string'
          ? miller.municipality
          : 'Unknown'
    }

    const weight =
      batch.totalWeight && Number(batch.totalWeight) > 0
        ? Number(batch.totalWeight)
        : (batch.totalSacks || 0) * 50

    const sacks = batch.totalSacks || batch.numberOfBags || 0
    const driverId = batch.driverId
    const status = driverId ? 'Assigned' : 'Pending'

    // Update batch delivery status
    await prisma.harvestBatch.update({
      where: { id: batchId },
      data: { deliveryStatus: 'Pending' },
    })

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookableType: 'User',
        bookableId: 0,
        originAddress: origin,
        destinationAddress: destination,
        totalWeightKg: weight,
        estimatedSacks: sacks,
        driverId,
        status,
        harvestBatchId: batchId,
      },
    })

    return { id: booking.id, status: booking.status }
  } catch (error) {
    console.error('Failed to broadcast palay pickup:', error)
    throw error
  }
}
