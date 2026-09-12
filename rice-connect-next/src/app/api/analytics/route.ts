import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role

  try {
    if (role === 'FARMER') {
      const farmerId = user.id

      const harvests = await prisma.harvestBatch.findMany({
        where: { userId: farmerId },
        select: { status: true, totalWeight: true, pricePerKg: true, finalPricePerKg: true, actualWeightKg: true },
      })

      const totalHarvests = harvests.length
      const totalWeight = harvests.reduce((sum, h) => sum + Number(h.totalWeight), 0)
      const soldBatches = harvests.filter((h) => ['sold', 'received', 'completed'].includes(h.status))
      const totalRevenue = harvests
        .filter((h) => h.finalPricePerKg && h.actualWeightKg)
        .reduce((sum, h) => sum + Number(h.actualWeightKg) * Number(h.finalPricePerKg), 0)

      const wallet = await prisma.wallet.findUnique({ where: { userId: farmerId } })

      // Harvest by variety
      const byVariety = harvests.reduce((acc, h) => {
        acc[h.status] = (acc[h.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Recent market prices
      const prices = await prisma.marketPrice.findMany({
        orderBy: { priceDate: 'desc' },
        take: 20,
        select: { riceVariety: true, pricePerKg: true, priceDate: true },
      })

      return NextResponse.json({
        totalHarvests,
        totalWeight,
        soldCount: soldBatches.length,
        totalRevenue,
        walletBalance: wallet?.balance || 0,
        byVariety,
        recentPrices: prices,
      })
    }

    if (role === 'MILLER') {
      const millerId = user.id

      const purchases = await prisma.harvestBatch.findMany({
        where: { buyerId: millerId },
        select: { status: true, totalWeight: true, actualWeightKg: true, finalPricePerKg: true },
      })

      const stocks = await prisma.finishedRiceStock.findMany({
        where: { millerId: millerId },
        select: { riceVariety: true, totalSacks: true, unpackedWeightKg: true, pricePerSack: true },
      })

      const wallet = await prisma.wallet.findUnique({ where: { userId: millerId } })

      const totalPurchases = purchases.length
      const totalWeight = purchases.reduce((sum, p) => sum + Number(p.totalWeight), 0)
      const totalSpent = purchases
        .filter((p) => p.finalPricePerKg && p.actualWeightKg)
        .reduce((sum, p) => sum + Number(p.actualWeightKg) * Number(p.finalPricePerKg), 0)

      const totalRiceSacks = stocks.reduce((sum, s) => sum + s.totalSacks, 0)
      const totalRiceValue = stocks
        .filter((s) => s.pricePerSack)
        .reduce((sum, s) => sum + s.totalSacks * Number(s.pricePerSack), 0)

      // Processing efficiency
      const processedCount = purchases.filter((p) => ['milled', 'processed'].includes(p.status)).length

      return NextResponse.json({
        totalPurchases,
        totalWeight,
        totalSpent,
        walletBalance: wallet?.balance || 0,
        stocks,
        totalRiceSacks,
        totalRiceValue,
        processedCount,
        pendingCount: purchases.filter((p) => ['received', 'processing'].includes(p.status)).length,
      })
    }

    if (role === 'ADMIN') {
      const totalFarmers = await prisma.user.count({ where: { role: 'FARMER' } })
      const totalMillers = await prisma.user.count({ where: { role: 'MILLER' } })
      const totalDrivers = await prisma.user.count({ where: { role: 'DRIVER' } })
      const totalRetailers = await prisma.user.count({ where: { role: 'RETAILER' } })

      const totalHarvests = await prisma.harvestBatch.count()
      const totalVolume = await prisma.harvestBatch.aggregate({ _sum: { totalWeight: true } })
      const totalTransactions = await prisma.ledgerEntry.count()

      const recentPrices = await prisma.marketPrice.findMany({
        orderBy: { priceDate: 'desc' },
        take: 30,
        select: { riceVariety: true, pricePerKg: true, priceDate: true },
      })

      const totalRevenue = await prisma.ledgerEntry.aggregate({
        where: { type: 'credit' },
        _sum: { amount: true },
      })

      return NextResponse.json({
        totalFarmers,
        totalMillers,
        totalDrivers,
        totalRetailers,
        totalHarvests,
        totalVolume: totalVolume._sum.totalWeight || 0,
        totalTransactions,
        totalRevenue: totalRevenue._sum.amount || 0,
        recentPrices,
      })
    }

    return NextResponse.json({ error: 'Unknown role' }, { status: 400 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
