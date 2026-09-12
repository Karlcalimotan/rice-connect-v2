import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    const orders = await prisma.order.findMany({
      where: { millerId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const retailerIds = [...new Set(orders.map((o) => o.retailerId).filter(Boolean) as string[])]
    const stockIds = [...new Set(orders.map((o) => o.stockId).filter((id): id is number => id !== null))]
    const driverIds = [...new Set(orders.map((o) => o.driverId).filter(Boolean) as string[])]

    const [retailers, stocks, drivers] = await Promise.all([
      retailerIds.length
        ? prisma.user.findMany({
            where: { id: { in: retailerIds } },
            select: { id: true, firstName: true, lastName: true, contact: true, municipality: true },
          })
        : [],
      stockIds.length
        ? prisma.finishedRiceStock.findMany({
            where: { id: { in: stockIds } },
            select: { id: true, riceVariety: true, totalSacks: true, pricePerSack: true },
          })
        : [],
      driverIds.length
        ? prisma.user.findMany({
            where: { id: { in: driverIds } },
            select: { id: true, firstName: true, lastName: true, contact: true },
          })
        : [],
    ])

    const retailerMap = new Map(retailers.map((r) => [r.id, r]))
    const stockMap = new Map(stocks.map((s) => [s.id, s]))
    const driverMap = new Map(drivers.map((d) => [d.id, d]))

    const enriched = orders.map((order) => ({
      ...order,
      retailer: retailerMap.get(order.retailerId) ?? null,
      stock: order.stockId ? stockMap.get(order.stockId) ?? null : null,
      driver: order.driverId ? driverMap.get(order.driverId) ?? null : null,
    }))

    return NextResponse.json({ orders: enriched })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
