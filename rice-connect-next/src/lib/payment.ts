import { prisma } from '@/lib/prisma'
import Decimal from 'decimal.js'

type TransferOptions = {
  checkBalance?: boolean
}

export async function transfer(
  fromUserId: string,
  toUserId: string,
  amount: number | Decimal,
  debitDescription: string,
  creditDescription: string,
  referenceType?: string,
  referenceId?: number,
  options: TransferOptions = {}
): Promise<boolean> {
  const amt = new Decimal(amount)
  if (amt.lte(0)) throw new Error('Payment amount must be greater than zero.')
  if (fromUserId === toUserId)
    throw new Error('Cannot transfer money to the same user.')

  return prisma.$transaction(async (tx) => {
    // Idempotency check
    if (referenceType && referenceId) {
      const existing = await tx.ledgerEntry.findFirst({
        where: {
          userId: fromUserId,
          type: 'debit',
          referenceType,
          referenceId,
        },
      })
      if (existing) return false
    }

    // Ensure wallets exist
    await tx.wallet.upsert({
      where: { userId: fromUserId },
      create: { userId: fromUserId, balance: 0 },
      update: {},
    })
    await tx.wallet.upsert({
      where: { userId: toUserId },
      create: { userId: toUserId, balance: 0 },
      update: {},
    })

    // Check balance if required
    if (options.checkBalance) {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: fromUserId },
      })
      if (senderWallet && new Decimal(senderWallet.balance.toString()).lt(amt)) {
        throw new Error('Insufficient funds.')
      }
    }

    // Atomic debit + credit
    await tx.wallet.update({
      where: { userId: fromUserId },
      data: { balance: { decrement: amt.toNumber() } },
    })
    await tx.wallet.update({
      where: { userId: toUserId },
      data: { balance: { increment: amt.toNumber() } },
    })

    // Write ledger entries
    await tx.ledgerEntry.createMany({
      data: [
        {
          userId: fromUserId,
          amount: amt.toNumber(),
          type: 'debit',
          referenceType: referenceType || null,
          referenceId: referenceId || null,
          description: debitDescription,
        },
        {
          userId: toUserId,
          amount: amt.toNumber(),
          type: 'credit',
          referenceType: referenceType || null,
          referenceId: referenceId || null,
          description: creditDescription,
        },
      ],
    })

    return true
  })
}

export async function credit(
  userId: string,
  amount: number | Decimal,
  description: string,
  referenceType?: string,
  referenceId?: number
): Promise<boolean> {
  const amt = new Decimal(amount)
  if (amt.lte(0)) throw new Error('Amount must be greater than zero.')

  return prisma.$transaction(async (tx) => {
    if (referenceType && referenceId) {
      const existing = await tx.ledgerEntry.findFirst({
        where: {
          userId,
          type: 'credit',
          referenceType,
          referenceId,
        },
      })
      if (existing) return false
    }

    await tx.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    })

    await tx.wallet.update({
      where: { userId },
      data: { balance: { increment: amt.toNumber() } },
    })

    await tx.ledgerEntry.create({
      data: {
        userId,
        amount: amt.toNumber(),
        type: 'credit',
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        description,
      },
    })

    return true
  })
}

export async function debit(
  userId: string,
  amount: number | Decimal,
  description: string,
  referenceType?: string,
  referenceId?: number,
  checkBalance = false
): Promise<boolean> {
  const amt = new Decimal(amount)
  if (amt.lte(0)) throw new Error('Amount must be greater than zero.')

  return prisma.$transaction(async (tx) => {
    if (referenceType && referenceId) {
      const existing = await tx.ledgerEntry.findFirst({
        where: {
          userId,
          type: 'debit',
          referenceType,
          referenceId,
        },
      })
      if (existing) return false
    }

    await tx.wallet.upsert({
      where: { userId },
      create: { userId, balance: 0 },
      update: {},
    })

    if (checkBalance) {
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      })
      if (wallet && new Decimal(wallet.balance.toString()).lt(amt)) {
        throw new Error('Insufficient funds.')
      }
    }

    await tx.wallet.update({
      where: { userId },
      data: { balance: { decrement: amt.toNumber() } },
    })

    await tx.ledgerEntry.create({
      data: {
        userId,
        amount: amt.toNumber(),
        type: 'debit',
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        description,
      },
    })

    return true
  })
}
