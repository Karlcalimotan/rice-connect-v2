import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const variety = searchParams.get('variety')

  try {
    const where: Record<string, unknown> = {
      status: { in: ['available', 'unsold', 'expressed_interest'] },
      hiddenFromFarmer: false,
    }

    if (variety) {
      where.riceVariety = variety
    }

    const batches = await prisma.harvestBatch.findMany({
      where,
      include: {
        farmer: {
          select: {
            firstName: true,
            lastName: true,
            municipality: true,
          },
        },
        interests: {
          select: {
            millerId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ batches })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
