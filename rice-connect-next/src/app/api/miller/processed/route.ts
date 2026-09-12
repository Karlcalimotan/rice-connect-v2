import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (profile?.role !== 'MILLER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const stocks = await prisma.finishedRiceStock.findMany({
      where: { millerId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ stocks })
  } catch (error) {
    console.error('Error fetching processed rice stocks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
