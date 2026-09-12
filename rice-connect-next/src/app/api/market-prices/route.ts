import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const variety = searchParams.get('variety')

  try {
    const where: Record<string, unknown> = {}
    if (variety) {
      where.riceVariety = variety
    }

    const prices = await prisma.marketPrice.findMany({
      where,
      orderBy: { priceDate: 'desc' },
      take: 30,
    })

    return NextResponse.json({ prices })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
