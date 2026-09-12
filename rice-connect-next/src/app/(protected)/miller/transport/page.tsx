'use client'

import { useEffect, useState } from 'react'
// Supabase kept for driver list fetch and mutations (bookings) — no API routes for these yet
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { formatDate } from '@/lib/utils'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import FleetManagement from '@/components/modules/millers/FleetManagement'

type Delivery = {
  id: number
  origin_address: string
  destination_address: string
  total_weight_kg: number
  estimated_sacks: number
  status: string
  driver_name: string | null
  pickup_date: string | null
  notes: string | null
  harvest_batches: {
    id: number
    rice_variety: string
    user_id: string
    users: { first_name: string; last_name: string; municipality: string } | null
  } | null
}

type Driver = {
  id: string
  first_name: string
  last_name: string
  municipality: string
}

export default function MillerTransportPage() {
  const { user } = useUser()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [assignData, setAssignData] = useState({ driverId: '', pickupDate: '' })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [deliveriesRes, driversRes] = await Promise.all([
        fetch('/api/miller/transport'),
        fetch('/api/miller/transport', { headers: { 'x-fetch-drivers': 'true' } }),
      ])

      if (deliveriesRes.ok) {
        const { bookings } = await deliveriesRes.json()
        const mapped = bookings.map((b: Record<string, unknown>) => {
          const hb = b.harvestBatch as Record<string, unknown> | null
          const farmer = hb?.farmer as Record<string, unknown> | null
          return {
            id: b.id,
            origin_address: b.originAddress,
            destination_address: b.destinationAddress,
            total_weight_kg: b.totalWeightKg,
            estimated_sacks: b.estimatedSacks,
            status: b.status,
            driver_name: b.driverName,
            pickup_date: b.pickupDate,
            notes: b.notes,
            harvest_batches: hb ? {
              id: hb.id,
              rice_variety: hb.riceVariety,
              user_id: hb.userId,
              users: farmer,
            } : null,
          }
        })
        setDeliveries(mapped as unknown as Delivery[])
      }

      // Fetch drivers separately
      const supabase = createClient()
      const { data: driversData } = await supabase
        .from('users')
        .select('id, first_name, last_name, municipality')
        .eq('role', 'DRIVER')

      if (driversData) setDrivers(driversData)
      setLoading(false)
    }

    fetchData()
  }, [user])

  const handleAssignDriver = async () => {
    if (!selectedDelivery || !assignData.driverId) return

    const supabase = createClient()
    const driver = drivers.find((d) => d.id === assignData.driverId)

    await supabase
      .from('bookings')
      .update({
        driver_id: assignData.driverId,
        driver_name: driver ? `${driver.first_name} ${driver.last_name}` : 'Driver',
        pickup_date: assignData.pickupDate || null,
        status: 'Assigned',
      })
      .eq('id', selectedDelivery.id)

    // Notify driver
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(assignData.driverId, 'delivery.assigned', {
      message: `New delivery assigned: ${selectedDelivery.origin_address} → ${selectedDelivery.destination_address}`,
      bookingId: selectedDelivery.id,
    })

    // Notify farmer of pickup scheduled if date provided
    if (assignData.pickupDate && selectedDelivery.harvest_batches?.user_id) {
      await createNotification(selectedDelivery.harvest_batches.user_id, 'PickupScheduled', {
        message: `Pickup scheduled for ${assignData.pickupDate} — Driver: ${driver?.first_name} ${driver?.last_name}`,
        bookingId: selectedDelivery.id,
        pickupDate: assignData.pickupDate,
        driverName: driver ? `${driver.first_name} ${driver.last_name}` : 'Driver',
      })
    }

    setShowAssignModal(false)
    setSelectedDelivery(null)
    setAssignData({ driverId: '', pickupDate: '' })

    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === selectedDelivery.id
          ? { ...d, driver_id: assignData.driverId, status: 'Assigned' }
          : d
      )
    )
  }

  const updateDeliveryStatus = async (id: number, status: string) => {
    const supabase = createClient()
    await supabase.from('bookings').update({ status }).eq('id', id)

    if (status === 'In Transit') {
      const delivery = deliveries.find((d) => d.id === id)
      if (delivery?.harvest_batches?.user_id) {
        const { createNotification } = await import('@/lib/notifications')
        await createNotification(delivery.harvest_batches.user_id, 'delivery.in_transit', {
          message: `Your harvest is on its way to the miller`,
          bookingId: id,
        })
      }
    }

    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Transport</h1>
      <p className="mt-2 text-gray-600">Manage delivery pickups</p>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : deliveries.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No deliveries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Booking #{delivery.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {delivery.origin_address} → {delivery.destination_address}
                    </p>
                    <p className="text-xs text-gray-400">
                      {delivery.total_weight_kg} kg • {delivery.estimated_sacks} sacks
                    </p>
                    {delivery.harvest_batches && (
                      <p className="text-xs text-gray-500">
                        {delivery.harvest_batches.rice_variety}
                        {delivery.harvest_batches.users && (
                          <> from {delivery.harvest_batches.users.first_name} {delivery.harvest_batches.users.last_name}</>
                        )}
                      </p>
                    )}
                    {delivery.driver_name && (
                      <p className="text-xs text-blue-600">Driver: {delivery.driver_name}</p>
                    )}
                    {delivery.pickup_date && (
                      <p className="text-xs text-gray-400">Pickup: {formatDate(delivery.pickup_date)}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {delivery.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!delivery.driver_name && delivery.status === 'Pending' && (
                    <PrimaryButton
                      onClick={() => {
                        setSelectedDelivery(delivery)
                        setShowAssignModal(true)
                      }}
                    >
                      Assign Driver
                    </PrimaryButton>
                  )}
                  {delivery.status === 'Assigned' && (
                    <button
                      onClick={() => updateDeliveryStatus(delivery.id, 'In Transit')}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
                    >
                      Mark In Transit
                    </button>
                  )}
                  {delivery.status === 'In Transit' && (
                    <button
                      onClick={() => updateDeliveryStatus(delivery.id, 'Delivered')}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAssignModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Assign Driver</h2>
            <div className="mt-4 space-y-4">
              <div>
                <InputLabel value="Driver" />
                <select
                  value={assignData.driverId}
                  onChange={(e) => setAssignData({ ...assignData, driverId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select driver...</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.first_name} {driver.last_name} ({driver.municipality})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <InputLabel value="Pickup Date" />
                <TextInput
                  type="date"
                  value={assignData.pickupDate}
                  onChange={(e) => setAssignData({ ...assignData, pickupDate: e.target.value })}
                  className="mt-1 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleAssignDriver} disabled={!assignData.driverId}>Assign</PrimaryButton>
              <button onClick={() => setShowAssignModal(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 border-t pt-8">
        <FleetManagement />
      </div>
    </div>
  )
}
