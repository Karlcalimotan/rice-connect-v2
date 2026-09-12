'use client'

import { useEffect, useState } from 'react'
// Supabase kept for mutations (harvest_batches, bookings) — no API routes for these yet
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type HarvestBatch = {
  id: number
  rice_variety: string
  total_weight: number
  actual_weight_kg: number | null
  suggested_price_per_kg: number | null
  final_price_per_kg: number | null
  price_per_kg: number | null
  status: string
  delivery_status: string
  drying_status: string | null
  harvest_date: string
  number_of_bags: number
  condition: string
  user_id: string
  users: { first_name: string; last_name: string; municipality: string } | null
}

export default function MillerIncomingPage() {
  const { user } = useUser()
  const [batches, setBatches] = useState<HarvestBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showFinalizeModal, setShowFinalizeModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null)
  const [confirmData, setConfirmData] = useState({ actualWeight: '', suggestedPrice: '' })
  const [finalizePrice, setFinalizePrice] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchBatches = async () => {
      const res = await fetch('/api/miller/incoming')
      if (res.ok) {
        const { batches } = await res.json()
        const mapped = batches.map((b: Record<string, unknown>) => ({
          id: b.id,
          rice_variety: b.riceVariety,
          total_weight: b.totalWeight,
          actual_weight_kg: b.actualWeightKg,
          suggested_price_per_kg: b.suggestedPricePerKg,
          final_price_per_kg: b.finalPricePerKg,
          price_per_kg: b.pricePerKg,
          status: b.status,
          delivery_status: b.deliveryStatus,
          drying_status: b.dryingStatus,
          harvest_date: b.harvestDate,
          number_of_bags: b.numberOfBags,
          condition: b.condition,
          user_id: b.userId,
          users: b.farmer,
        }))
        setBatches(mapped as unknown as HarvestBatch[])
      }
      setLoading(false)
    }

    fetchBatches()
  }, [user])

  const handleConfirmPickup = async () => {
    if (!selectedBatch || !user) return

    const supabase = createClient()
    await supabase
      .from('harvest_batches')
      .update({
        actual_weight_kg: parseFloat(confirmData.actualWeight),
        suggested_price_per_kg: parseFloat(confirmData.suggestedPrice),
        delivery_status: 'In Transit',
        status: 'in_transit',
      })
      .eq('id', selectedBatch.id)

    // Notify farmer of weight logged
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(selectedBatch.user_id, 'WeightLogged', {
      message: `Weight logged: ${confirmData.actualWeight} kg at ₱${confirmData.suggestedPrice}/kg for your ${selectedBatch.rice_variety} harvest`,
      batchId: selectedBatch.id,
      weightKg: confirmData.actualWeight,
      pricePerKg: confirmData.suggestedPrice,
    })

    setShowConfirmModal(false)
    setSelectedBatch(null)
    setConfirmData({ actualWeight: '', suggestedPrice: '' })

    setBatches((prev) =>
      prev.map((b) =>
        b.id === selectedBatch.id
          ? { ...b, actual_weight_kg: parseFloat(confirmData.actualWeight), suggested_price_per_kg: parseFloat(confirmData.suggestedPrice), delivery_status: 'In Transit', status: 'in_transit' }
          : b
      )
    )
  }

  const handleFinalize = async () => {
    if (!selectedBatch || !user || !finalizePrice) return

    const supabase = createClient()
    const finalPrice = parseFloat(finalizePrice)
    const actualWeight = Number(selectedBatch.actual_weight_kg || selectedBatch.total_weight)
    const totalPayment = actualWeight * finalPrice

    // Update batch
    await supabase
      .from('harvest_batches')
      .update({
        final_price_per_kg: finalPrice,
        price_per_kg: finalPrice,
        total_weight: actualWeight,
        delivery_status: 'Completed',
        status: 'received',
        drying_status: 'received',
      })
      .eq('id', selectedBatch.id)

    // Update booking
    await supabase
      .from('bookings')
      .update({ status: 'delivered' })
      .eq('harvest_batch_id', selectedBatch.id)

    // Transfer payment
    const { transfer } = await import('@/lib/payment')
    await transfer(
      user.id,
      selectedBatch.user_id || '',
      totalPayment,
      `Payment for Harvest Batch #${selectedBatch.id}`,
      `Payment received for Harvest Batch #${selectedBatch.id}`,
      'HarvestBatch',
      selectedBatch.id
    )

    // Notify farmer
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(
      selectedBatch.user_id || '',
      'payment.paid',
      { message: `Payment of ₱${totalPayment.toFixed(2)} credited to your wallet`, batchId: selectedBatch.id }
    )

    setShowFinalizeModal(false)
    setSelectedBatch(null)
    setFinalizePrice('')

    setBatches((prev) =>
      prev.map((b) =>
        b.id === selectedBatch.id
          ? { ...b, final_price_per_kg: finalPrice, delivery_status: 'Completed', status: 'received' }
          : b
      )
    )
  }

  const filtered = filter === 'all' ? batches : batches.filter((b) => b.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Incoming Palay</h1>
      <p className="mt-2 text-gray-600">Palay you&apos;ve purchased and are awaiting delivery</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {['all', 'accepted', 'in_transit', 'received'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No incoming palay</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((batch) => (
              <div key={batch.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{batch.rice_variety}</h3>
                    <p className="text-sm text-gray-500">
                      {batch.number_of_bags} bags • {batch.total_weight} kg
                    </p>
                    {batch.users && (
                      <p className="text-xs text-gray-500">
                        Farmer: {batch.users.first_name} {batch.users.last_name} • {batch.users.municipality}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">Harvested {formatDate(batch.harvest_date)}</p>
                    {batch.actual_weight_kg && (
                      <p className="text-xs text-green-600 mt-1">Actual weight: {batch.actual_weight_kg} kg</p>
                    )}
                    {batch.final_price_per_kg && (
                      <p className="text-xs text-green-600">Final price: {formatCurrency(Number(batch.final_price_per_kg))}/kg</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {batch.status.replace(/_/g, ' ')}
                    </span>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      {batch.delivery_status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {batch.delivery_status === 'Pending' && (
                    <PrimaryButton
                      onClick={() => {
                        setSelectedBatch(batch)
                        setShowConfirmModal(true)
                      }}
                    >
                      Confirm Pickup
                    </PrimaryButton>
                  )}
                  {(batch.delivery_status === 'In Transit' || batch.delivery_status === 'Received') && !batch.final_price_per_kg && (
                    <PrimaryButton
                      onClick={() => {
                        setSelectedBatch(batch)
                        setShowFinalizeModal(true)
                      }}
                    >
                      Finalize & Pay
                    </PrimaryButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Pickup Modal */}
      {showConfirmModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Confirm Pickup</h2>
            <div className="mt-4 space-y-4">
              <div>
                <InputLabel value="Actual Weight (kg)" />
                <TextInput
                  type="number"
                  step="0.01"
                  value={confirmData.actualWeight}
                  onChange={(e) => setConfirmData({ ...confirmData, actualWeight: e.target.value })}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <InputLabel value="Suggested Price per kg" />
                <TextInput
                  type="number"
                  step="0.01"
                  value={confirmData.suggestedPrice}
                  onChange={(e) => setConfirmData({ ...confirmData, suggestedPrice: e.target.value })}
                  className="mt-1 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleConfirmPickup}>Confirm</PrimaryButton>
              <button onClick={() => setShowConfirmModal(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Finalize Modal */}
      {showFinalizeModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Finalize Transaction</h2>
            <p className="mt-2 text-sm text-gray-600">
              Weight: {selectedBatch.actual_weight_kg || selectedBatch.total_weight} kg
            </p>
            <div className="mt-4">
              <InputLabel value="Final Price per kg" />
              <TextInput
                type="number"
                step="0.01"
                value={finalizePrice}
                onChange={(e) => setFinalizePrice(e.target.value)}
                className="mt-1 w-full"
              />
              {finalizePrice && (
                <p className="mt-2 text-sm font-semibold text-green-600">
                  Total: {formatCurrency(Number(selectedBatch.actual_weight_kg || selectedBatch.total_weight) * parseFloat(finalizePrice))}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleFinalize} disabled={!finalizePrice}>Finalize & Pay</PrimaryButton>
              <button onClick={() => setShowFinalizeModal(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
