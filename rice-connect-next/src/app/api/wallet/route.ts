import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { balance: true },
    })

    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        referenceType: true,
        referenceId: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      balance: wallet?.balance ?? 0,
      ledgerEntries,
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
