import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (dbUser?.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { error: null }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const skip = (page - 1) * limit

  try {
    const [prices, total] = await Promise.all([
      prisma.marketPrice.findMany({
        orderBy: { priceDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.marketPrice.count(),
    ])

    return NextResponse.json({ prices, total, page, limit })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const { riceVariety, pricePerKg, priceDate, source } = body

    const price = await prisma.marketPrice.create({
      data: {
        riceVariety,
        pricePerKg,
        priceDate: new Date(priceDate),
        marketRegion: 'Iloilo',
      },
    })

    return NextResponse.json({ price }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    if (data.priceDate) {
      data.priceDate = new Date(data.priceDate)
    }

    const price = await prisma.marketPrice.update({
      where: { id },
      data,
    })

    return NextResponse.json({ price })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdmin()
  if (error) return error

  const { searchParams } = new URL(request.url)
  const idParam = searchParams.get('id')

  if (!idParam) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 })
  }

  const id = parseInt(idParam)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'id must be a number' }, { status: 400 })
  }

  try {
    await prisma.marketPrice.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
