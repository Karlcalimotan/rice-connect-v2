import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DEFAULTS = {
  baseDeliveryFee: 150,
  extraFeePerMunicipality: 50,
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
  if (!dbUser || dbUser.role !== 'MILLER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const setting = await prisma.millerDeliverySetting.findUnique({
      where: { millerId: user.id },
    })

    return NextResponse.json({
      settings: setting ?? { ...DEFAULTS, millerId: user.id },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { role: true } })
  if (!dbUser || dbUser.role !== 'MILLER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { baseDeliveryFee, extraFeePerMunicipality, municipalityId } = body

    const data: Record<string, unknown> = {}
    if (baseDeliveryFee !== undefined) data.baseDeliveryFee = Number(baseDeliveryFee)
    if (extraFeePerMunicipality !== undefined) data.extraFeePerMunicipality = Number(extraFeePerMunicipality)
    if (municipalityId !== undefined) data.municipalityId = municipalityId ? Number(municipalityId) : null

    const setting = await prisma.millerDeliverySetting.upsert({
      where: { millerId: user.id },
      create: { millerId: user.id, ...data },
      update: data,
    })

    return NextResponse.json({ settings: setting })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
