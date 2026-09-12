'use client'

import { useEffect, useState } from 'react'
// Supabase kept for mutations (harvest_batches, finished_rice_stocks) — no API routes for these yet
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type HarvestBatch = {
  id: number
  rice_variety: string
  total_weight: number
  actual_weight_kg: number | null
  unpacked_weight_kg: number | null
  number_of_bags: number
  status: string
  delivery_status: string
  drying_status: string | null
  condition: string
  users: { first_name: string; last_name: string } | null
}

type VarietyGroup = {
  variety: string
  totalWeight: number
  totalBags: number
  batches: HarvestBatch[]
}

export default function MillerInventoryPage() {
  const { user } = useUser()
  const [batches, setBatches] = useState<HarvestBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [showMillModal, setShowMillModal] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null)
  const [millData, setMillData] = useState({ sacks: '', leftoverKg: '' })

  useEffect(() => {
    if (!user) return

    const fetchBatches = async () => {
      const res = await fetch('/api/miller/inventory')
      if (res.ok) {
        const { batches } = await res.json()
        const mapped = batches.map((b: Record<string, unknown>) => ({
          id: b.id,
          rice_variety: b.riceVariety,
          total_weight: b.totalWeight,
          actual_weight_kg: b.actualWeightKg,
          unpacked_weight_kg: b.unpackedWeightKg,
          number_of_bags: b.numberOfBags,
          status: b.status,
          delivery_status: b.deliveryStatus,
          drying_status: b.dryingStatus,
          condition: b.condition,
          users: b.farmer,
        }))
        setBatches(mapped as unknown as HarvestBatch[])
      }
      setLoading(false)
    }

    fetchBatches()
  }, [user])

  // Group by variety
  const groups: VarietyGroup[] = batches.reduce((acc, batch) => {
    const existing = acc.find((g) => g.variety === batch.rice_variety)
    if (existing) {
      existing.totalWeight += Number(batch.total_weight)
      existing.totalBags += batch.number_of_bags
      existing.batches.push(batch)
    } else {
      acc.push({
        variety: batch.rice_variety,
        totalWeight: Number(batch.total_weight),
        totalBags: batch.number_of_bags,
        batches: [batch],
      })
    }
    return acc
  }, [] as VarietyGroup[])

  const updateBatch = async (id: number, updates: Record<string, unknown>) => {
    const supabase = createClient()
    await supabase.from('harvest_batches').update(updates).eq('id', id)
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    )
  }

  const handleMillToRice = async () => {
    if (!selectedBatch || !user) return

    const sacks = parseInt(millData.sacks)
    const leftoverKg = parseFloat(millData.leftoverKg)

    if (isNaN(sacks) || isNaN(leftoverKg)) return

    const supabase = createClient()

    // Update batch status
    await supabase
      .from('harvest_batches')
      .update({ status: 'milled' })
      .eq('id', selectedBatch.id)

    // Create or increment FinishedRiceStock
    const { data: existing } = await supabase
      .from('finished_rice_stocks')
      .select('id, total_sacks, unpacked_weight_kg')
      .eq('miller_id', user.id)
      .eq('rice_variety', selectedBatch.rice_variety)
      .single()

    if (existing) {
      await supabase
        .from('finished_rice_stocks')
        .update({
          total_sacks: existing.total_sacks + sacks,
          unpacked_weight_kg: Number(existing.unpacked_weight_kg) + leftoverKg,
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('finished_rice_stocks').insert({
        miller_id: user.id,
        rice_variety: selectedBatch.rice_variety,
        total_sacks: sacks,
        unpacked_weight_kg: leftoverKg,
      })
    }

    setShowMillModal(false)
    setSelectedBatch(null)
    setMillData({ sacks: '', leftoverKg: '' })

    // Check for low stock and notify
    const newTotal = existing ? existing.total_sacks + sacks : sacks
    const LOW_STOCK_THRESHOLD = 50
    if (newTotal <= LOW_STOCK_THRESHOLD) {
      const { createNotification } = await import('@/lib/notifications')
      await createNotification(user.id, 'LowStock', {
        message: `Low stock alert: ${selectedBatch.rice_variety} has only ${newTotal} sacks remaining`,
        variety: selectedBatch.rice_variety,
        remainingSacks: newTotal,
        threshold: LOW_STOCK_THRESHOLD,
      })
    }

    setBatches((prev) =>
      prev.map((b) => (b.id === selectedBatch!.id ? { ...b, status: 'milled' } : b))
    )
  }

  const getWorkflowActions = (batch: HarvestBatch) => {
    const actions: Array<{ label: string; action: () => void; color: string }> = []

    if (batch.status === 'received' && batch.drying_status === 'received') {
      if (batch.condition === 'fresh') {
        actions.push({
          label: 'Start Drying',
          action: () => updateBatch(batch.id, { drying_status: 'drying' }),
          color: 'bg-yellow-600 hover:bg-yellow-500',
        })
      } else {
        actions.push({
          label: 'Ready to Process',
          action: () => updateBatch(batch.id, { drying_status: 'ready_to_process' }),
          color: 'bg-blue-600 hover:bg-blue-500',
        })
      }
    }

    if (batch.drying_status === 'drying') {
      actions.push({
        label: 'Mark Dry',
        action: () => updateBatch(batch.id, { drying_status: 'ready_to_process' }),
        color: 'bg-blue-600 hover:bg-blue-500',
      })
    }

    if (batch.drying_status === 'ready_to_process' && batch.status === 'received') {
      actions.push({
        label: 'Start Processing',
        action: () => updateBatch(batch.id, { status: 'processing' }),
        color: 'bg-indigo-600 hover:bg-indigo-500',
      })
    }

    if (batch.status === 'processing') {
      actions.push({
        label: 'Mill to Rice',
        action: () => {
          setSelectedBatch(batch)
          setShowMillModal(true)
        },
        color: 'bg-green-600 hover:bg-green-500',
      })
    }

    return actions
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      <p className="mt-2 text-gray-600">Manage your palay processing workflow</p>

      {loading ? (
        <div className="mt-6 text-center text-gray-500">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No inventory to process</p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <div key={group.variety} className="rounded-lg border bg-white shadow-sm">
              <div className="border-b bg-gray-50 p-4">
                <h2 className="text-lg font-semibold text-gray-900">{group.variety}</h2>
                <p className="text-sm text-gray-500">
                  {group.totalBags} bags • {group.totalWeight.toFixed(2)} kg total
                </p>
              </div>
              <div className="divide-y">
                {group.batches.map((batch) => {
                  const actions = getWorkflowActions(batch)
                  return (
                    <div key={batch.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Batch #{batch.id} • {batch.number_of_bags} bags • {batch.total_weight} kg
                          </p>
                          <p className="text-xs text-gray-400">
                            Condition: {batch.condition}
                            {batch.drying_status && ` • Drying: ${batch.drying_status}`}
                          </p>
                          {batch.users && (
                            <p className="text-xs text-gray-500">
                              From: {batch.users.first_name} {batch.users.last_name}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {batch.status}
                          </span>
                          {batch.drying_status && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              {batch.drying_status}
                            </span>
                          )}
                        </div>
                      </div>
                      {actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {actions.map((action) => (
                            <button
                              key={action.label}
                              onClick={action.action}
                              className={`rounded-md px-3 py-1.5 text-xs font-semibold text-white ${action.color}`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mill to Rice Modal */}
      {showMillModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Mill to Rice</h2>
            <p className="mt-2 text-sm text-gray-600">
              {selectedBatch.rice_variety} • {selectedBatch.number_of_bags} bags
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <InputLabel value="Output Sacks" />
                <TextInput
                  type="number"
                  min="0"
                  value={millData.sacks}
                  onChange={(e) => setMillData({ ...millData, sacks: e.target.value })}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <InputLabel value="Leftover Weight (kg)" />
                <TextInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={millData.leftoverKg}
                  onChange={(e) => setMillData({ ...millData, leftoverKg: e.target.value })}
                  className="mt-1 w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleMillToRice}>Complete Milling</PrimaryButton>
              <button onClick={() => setShowMillModal(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
