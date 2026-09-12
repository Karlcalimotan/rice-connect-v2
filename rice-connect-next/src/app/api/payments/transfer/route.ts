import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'MILLER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { fromUserId, toUserId, amount, debitDescription, creditDescription, referenceType, referenceId } = await request.json()

    if (!fromUserId || !toUserId || !amount || !debitDescription || !creditDescription) {
      return NextResponse.json(
        { error: 'fromUserId, toUserId, amount, debitDescription, and creditDescription are required' },
        { status: 400 }
      )
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    if (fromUserId === toUserId) {
      return NextResponse.json({ error: 'Cannot transfer to the same user' }, { status: 400 })
    }

    if (referenceType && referenceId) {
      const existingEntry = await prisma.ledgerEntry.findFirst({
        where: {
          userId: fromUserId,
          type: 'debit',
          referenceType,
          referenceId,
        },
      })

      if (existingEntry) {
        return NextResponse.json({ error: 'Transfer already processed for this reference' }, { status: 409 })
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: fromUserId },
      })

      if (!senderWallet) {
        throw new Error('Sender wallet not found')
      }

      if (Number(senderWallet.balance) < amount) {
        throw new Error('Insufficient balance')
      }

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: toUserId },
      })

      if (!receiverWallet) {
        throw new Error('Receiver wallet not found')
      }

      await tx.wallet.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      })

      await tx.wallet.update({
        where: { userId: toUserId },
        data: { balance: { increment: amount } },
      })

      const debitEntry = await tx.ledgerEntry.create({
        data: {
          userId: fromUserId,
          amount: -amount,
          type: 'debit',
          description: debitDescription,
          referenceType: referenceType ?? null,
          referenceId: referenceId ?? null,
        },
      })

      const creditEntry = await tx.ledgerEntry.create({
        data: {
          userId: toUserId,
          amount,
          type: 'credit',
          description: creditDescription,
          referenceType: referenceType ?? null,
          referenceId: referenceId ?? null,
        },
      })

      return { debitEntry, creditEntry }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
