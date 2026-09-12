import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const offers = await prisma.harvestBatch.findMany({
      where: {
        userId: user.id,
        interests: { some: {} },
      },
      include: {
        interests: {
          include: {
            miller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                municipality: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ offers })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (profile?.role !== 'MILLER') {
      return NextResponse.json({ error: 'Only millers can express interest' }, { status: 403 })
    }

    const { harvestId } = await request.json()

    if (!harvestId) {
      return NextResponse.json({ error: 'harvestId is required' }, { status: 400 })
    }

    const batch = await prisma.harvestBatch.findUnique({
      where: { id: harvestId },
    })

    if (!batch) {
      return NextResponse.json({ error: 'Harvest batch not found' }, { status: 404 })
    }

    const interest = await prisma.harvestInterest.create({
      data: {
        harvestId,
        millerId: user.id,
      },
    })

    await prisma.harvestBatch.update({
      where: { id: harvestId },
      data: { status: 'expressed_interest' },
    })

    return NextResponse.json({ success: true, interest }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
