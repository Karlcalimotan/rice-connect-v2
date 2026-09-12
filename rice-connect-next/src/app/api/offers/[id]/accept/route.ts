import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { batchId } = await request.json()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const interest = await prisma.harvestInterest.findUnique({
      where: { id: Number(id) },
      include: { harvest: true },
    })

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 })
    }

    if (interest.harvest.userId !== user.id) {
      return NextResponse.json({ error: 'Not your harvest batch' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.harvestBatch.update({
        where: { id: batchId },
        data: {
          buyerId: interest.millerId,
          acceptedMillerId: interest.millerId,
          status: 'accepted',
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
