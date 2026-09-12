import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const batch = await prisma.harvestBatch.findUnique({
      where: { id: Number(id) },
    })

    if (!batch) {
      return NextResponse.json({ error: 'Harvest batch not found' }, { status: 404 })
    }

    return NextResponse.json({ batch })
  } catch (error) {
    console.error('Error fetching harvest batch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const batch = await prisma.harvestBatch.findUnique({
      where: { id: Number(id) },
    })

    if (!batch) {
      return NextResponse.json({ error: 'Harvest batch not found' }, { status: 404 })
    }

    // Farmers can edit their own batches; millers can only update certain fields
    const isFarmer = batch.userId === user.id
    const isMiller = batch.buyerId === user.id

    if (!isFarmer && !isMiller) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    let data: Record<string, unknown>

    if (isMiller) {
      // Miller can only update price and status fields
      const { pricePerKg, finalPricePerKg, status, deliveryStatus } = body
      data = {}
      if (pricePerKg !== undefined) data.pricePerKg = Number(pricePerKg)
      if (finalPricePerKg !== undefined) data.finalPricePerKg = Number(finalPricePerKg)
      if (status !== undefined) data.status = status
      if (deliveryStatus !== undefined) data.deliveryStatus = deliveryStatus
    } else {
      // Farmer can edit their own batch fully
      const {
        riceVariety,
        numberOfBags,
        totalWeight,
        pricePerKg,
        harvestDate,
        status,
        deliveryType,
        deliveryMethod,
        location,
      } = body

      data = {}
      if (riceVariety !== undefined) data.riceVariety = riceVariety
      if (numberOfBags !== undefined) data.numberOfBags = Number(numberOfBags)
      if (totalWeight !== undefined) data.totalWeight = Number(totalWeight)
      if (pricePerKg !== undefined) data.pricePerKg = Number(pricePerKg)
      if (harvestDate !== undefined) data.harvestDate = new Date(harvestDate)
      if (status !== undefined) data.status = status
      if (deliveryType !== undefined) data.deliveryType = deliveryType
      if (deliveryMethod !== undefined) data.deliveryMethod = deliveryMethod
      if (location !== undefined) data.location = location
    }

    const updated = await prisma.harvestBatch.update({
      where: { id: Number(id) },
      data,
    })

    return NextResponse.json({ batch: updated })
  } catch (error) {
    console.error('Error updating harvest batch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const batch = await prisma.harvestBatch.findUnique({
      where: { id: Number(id) },
    })

    if (!batch) {
      return NextResponse.json({ error: 'Harvest batch not found' }, { status: 404 })
    }

    if (batch.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updated = await prisma.harvestBatch.update({
      where: { id: Number(id) },
      data: {
        hiddenFromFarmer: true,
        hiddenAt: new Date(),
      },
    })

    return NextResponse.json({ batch: updated })
  } catch (error) {
    console.error('Error deleting harvest batch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
