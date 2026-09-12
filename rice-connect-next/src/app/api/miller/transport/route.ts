import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get('driverId')

    let bookings

    if (driverId) {
      // Driver view: show bookings assigned to this driver
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      })

      if (profile?.role !== 'DRIVER' && profile?.role !== 'MILLER') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      bookings = await prisma.booking.findMany({
        where: { driverId },
        include: {
          harvestBatch: {
            select: {
              id: true,
              riceVariety: true,
              totalWeight: true,
            },
          },
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              vehicleType: true,
              licenseNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      // Miller view: show bookings tied to harvest batches owned by this miller
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true },
      })

      if (profile?.role !== 'MILLER') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      bookings = await prisma.booking.findMany({
        where: {
          harvestBatch: {
            OR: [
              { userId: user.id },
              { buyerId: user.id },
            ],
          },
        },
        include: {
          harvestBatch: {
            select: {
              id: true,
              riceVariety: true,
              totalWeight: true,
            },
          },
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              vehicleType: true,
              licenseNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Error fetching transport bookings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
