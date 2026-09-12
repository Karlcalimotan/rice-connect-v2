import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const userId = searchParams.get('userId')

    let batches

    if (role === 'MILLER') {
      batches = await prisma.harvestBatch.findMany({
        where: {
          OR: [
            { status: 'available' },
            { buyerId: user.id },
          ],
          hiddenFromFarmer: false,
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // FARMER view (default)
      const filterUserId = role === 'FARMER' ? (userId || user.id) : user.id
      batches = await prisma.harvestBatch.findMany({
        where: {
          userId: filterUserId,
          hiddenFromFarmer: false,
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ batches })
  } catch (error) {
    console.error('Error fetching harvest batches:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
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

    if (!riceVariety || numberOfBags === undefined || !totalWeight || !harvestDate) {
      return NextResponse.json(
        { error: 'Missing required fields: riceVariety, numberOfBags, totalWeight, harvestDate' },
        { status: 400 }
      )
    }

    const batch = await prisma.harvestBatch.create({
      data: {
        userId: user.id,
        riceVariety,
        numberOfBags: Number(numberOfBags),
        totalWeight: Number(totalWeight),
        pricePerKg: pricePerKg ? Number(pricePerKg) : undefined,
        harvestDate: new Date(harvestDate),
        status: status || 'unsold',
        deliveryType: deliveryType || 'palay',
        deliveryMethod: deliveryMethod || undefined,
        location: location || undefined,
      },
    })

    return NextResponse.json({ batch }, { status: 201 })
  } catch (error) {
    console.error('Error creating harvest batch:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
