'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'
import TextInput from '@/components/ui/TextInput'
import PrimaryButton from '@/components/ui/PrimaryButton'
import InputLabel from '@/components/ui/InputLabel'

type HarvestBatch = {
  id: number
  rice_variety: string
  total_weight: number
  price_per_kg: number | null
  status: string
  harvest_date: string
  number_of_bags: number
  user_id: string
  location: string | null
  users: { first_name: string; last_name: string; municipality: string } | null
  harvest_interests: Array<{ miller_id: string }> | null
}

export default function MillerMarketplacePage() {
  const { user } = useUser()
  const [harvests, setHarvests] = useState<HarvestBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [selectedHarvest, setSelectedHarvest] = useState<HarvestBatch | null>(null)
  const [interestLoading, setInterestLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchHarvests = async () => {
      const res = await fetch('/api/marketplace')
      if (res.ok) {
        const { batches } = await res.json()
        const mapped = batches.map((b: Record<string, unknown>) => ({
          id: b.id,
          rice_variety: b.riceVariety,
          total_weight: b.totalWeight,
          price_per_kg: b.pricePerKg,
          status: b.status,
          harvest_date: b.harvestDate,
          number_of_bags: b.numberOfBags,
          user_id: b.userId,
          location: b.location,
          users: b.farmer,
          harvest_interests: (b.interests as Array<Record<string, unknown>> | undefined)?.map((i) => ({ miller_id: i.millerId })) || [],
        }))
        setHarvests(mapped as unknown as HarvestBatch[])
      }
      setLoading(false)
    }

    fetchHarvests()
  }, [user])

  const filtered = harvests.filter(
    (h) =>
      h.rice_variety.toLowerCase().includes(search.toLowerCase()) ||
      h.users?.municipality?.toLowerCase().includes(search.toLowerCase())
  )

  const hasAlreadyExpressedInterest = (harvest: HarvestBatch) =>
    harvest.harvest_interests?.some((i) => i.miller_id === user?.id) || false

  const handleExpressInterest = async () => {
    if (!selectedHarvest || !user) return
    setInterestLoading(true)

    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ harvestId: selectedHarvest.id }),
    })

    if (!res.ok) {
      console.error('Interest failed:', await res.json())
      setInterestLoading(false)
      return
    }

    // Notify farmer
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(selectedHarvest.user_id, 'interest.received', {
      message: `${user.firstName} ${user.lastName} is interested in your ${selectedHarvest.rice_variety} harvest`,
      batchId: selectedHarvest.id,
      millerName: `${user.firstName} ${user.lastName}`,
    })

    setShowInterestModal(false)
    setSelectedHarvest(null)
    setInterestLoading(false)

    // Refresh list
    setHarvests((prev) =>
      prev.map((h) =>
        h.id === selectedHarvest!.id
          ? { ...h, status: 'expressed_interest' }
          : h
      )
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
      <p className="mt-2 text-gray-600">Browse available harvests from farmers</p>

      <div className="mt-4">
        <TextInput
          placeholder="Search by variety or municipality..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No harvests available</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((harvest) => {
              const alreadyInterested = hasAlreadyExpressedInterest(harvest)
              return (
                <div
                  key={harvest.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900">{harvest.rice_variety}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {harvest.number_of_bags} bags • {harvest.total_weight} kg
                  </p>
                  {harvest.price_per_kg && (
                    <p className="mt-1 text-lg font-bold text-green-600">
                      {formatCurrency(Number(harvest.price_per_kg))}/kg
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Harvested {formatDate(harvest.harvest_date)}
                  </p>
                  {harvest.users && (
                    <p className="mt-1 text-xs text-gray-500">
                      {harvest.users.first_name} {harvest.users.last_name} • {harvest.users.municipality}
                    </p>
                  )}
                  {harvest.location && (
                    <p className="mt-1 text-xs text-gray-400">📍 {harvest.location}</p>
                  )}
                  {alreadyInterested ? (
                    <div className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-700">
                      Interest Sent
                    </div>
                  ) : (
                    <PrimaryButton
                      onClick={() => {
                        setSelectedHarvest(harvest)
                        setShowInterestModal(true)
                      }}
                      className="mt-3 w-full justify-center"
                    >
                      Express Interest
                    </PrimaryButton>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Interest Modal */}
      {showInterestModal && selectedHarvest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Express Interest</h2>
            <p className="mt-2 text-sm text-gray-600">
              {selectedHarvest.rice_variety} • {selectedHarvest.total_weight} kg
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Farmer: {selectedHarvest.users?.first_name} {selectedHarvest.users?.last_name}
            </p>
            <p className="mt-4 text-sm text-gray-600">
              The farmer will be notified of your interest. Once they accept, you can proceed with pickup and payment.
            </p>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleExpressInterest} disabled={interestLoading}>
                {interestLoading ? 'Sending...' : 'Send Interest'}
              </PrimaryButton>
              <button
                onClick={() => {
                  setShowInterestModal(false)
                  setSelectedHarvest(null)
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
