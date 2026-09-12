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

export async function GET() {
  try {
    const municipalities = await prisma.municipality.findMany({
      orderBy: { distanceIndex: 'asc' },
    })

    return NextResponse.json({ municipalities })
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
    const { name, distanceIndex } = body

    const municipality = await prisma.municipality.create({
      data: { name, distanceIndex },
    })

    return NextResponse.json({ municipality }, { status: 201 })
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
    const { id, name, distanceIndex } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const municipality = await prisma.municipality.update({
      where: { id },
      data: { name, distanceIndex },
    })

    return NextResponse.json({ municipality })
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
    await prisma.municipality.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
