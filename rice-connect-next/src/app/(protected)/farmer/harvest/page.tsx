'use client'

import { useEffect, useState } from 'react'

import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

type HarvestBatch = {
  id: number
  rice_variety: string
  total_weight: number
  price_per_kg: number | null
  final_price_per_kg: number | null
  actual_weight_kg: number | null
  status: string
  harvest_date: string
  delivery_status: string
  number_of_bags: number
  accepted_miller_id: string | null
}

export default function FarmerHarvestPage() {
  const { user } = useUser()
  const [harvests, setHarvests] = useState<HarvestBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return

    const fetchHarvests = async () => {
      const params = new URLSearchParams({ role: 'FARMER' })
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/harvest?${params}`)
      if (res.ok) {
        const data = await res.json()
        setHarvests(data)
      }
      setLoading(false)
    }

    fetchHarvests()
  }, [user, filter])

  const handleDelete = async (id: number) => {
    if (!confirm('Hide this harvest from your view?')) return

    await fetch(`/api/harvest/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hidden_from_farmer: true,
        hidden_at: new Date().toISOString(),
      }),
    })

    setHarvests((prev) => prev.filter((h) => h.id !== id))
  }

  const statusColors: Record<string, string> = {
    unsold: 'bg-yellow-100 text-yellow-800',
    available: 'bg-yellow-100 text-yellow-800',
    interest_received: 'bg-blue-100 text-blue-800',
    accepted: 'bg-purple-100 text-purple-800',
    sold: 'bg-green-100 text-green-800',
    in_transit: 'bg-orange-100 text-orange-800',
    received: 'bg-gray-100 text-gray-800',
    processing: 'bg-indigo-100 text-indigo-800',
    milled: 'bg-teal-100 text-teal-800',
    payment_pending: 'bg-amber-100 text-amber-800',
    payment_authorized: 'bg-lime-100 text-lime-800',
    completed: 'bg-green-100 text-green-800',
  }

  const canEdit = (status: string) =>
    ['unsold', 'available'].includes(status)

  const canDelete = (status: string) =>
    ['unsold', 'available', 'received', 'milled', 'processed'].includes(status)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Harvest</h1>
        <Link
          href="/farmer/harvest/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
        >
          + New Listing
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['all', 'unsold', 'available', 'interest_received', 'accepted', 'in_transit', 'received', 'processing', 'milled', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === status
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : harvests.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No harvest listings yet</p>
            <Link
              href="/farmer/harvest/new"
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create your first listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {harvests.map((harvest) => {
              const payout =
                harvest.actual_weight_kg && harvest.final_price_per_kg
                  ? Number(harvest.actual_weight_kg) * Number(harvest.final_price_per_kg)
                  : null

              return (
                <div
                  key={harvest.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{harvest.rice_variety}</h3>
                      <p className="text-sm text-gray-500">
                        {harvest.number_of_bags} bags • {harvest.total_weight} kg
                      </p>
                      {harvest.price_per_kg && (
                        <p className="text-sm text-gray-500">
                          {formatCurrency(Number(harvest.price_per_kg))}/kg
                        </p>
                      )}
                      {payout !== null && (
                        <p className="text-sm font-semibold text-green-600">
                          Payout: {formatCurrency(payout)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Harvested {formatDate(harvest.harvest_date)}
                      </p>
                      {harvest.accepted_miller_id && (
                        <p className="text-xs text-purple-600 mt-1">
                          Miller accepted
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          statusColors[harvest.status] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {harvest.status.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          harvest.delivery_status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : harvest.delivery_status === 'In Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {harvest.delivery_status}
                      </span>
                      <div className="flex gap-2 mt-2">
                        {canEdit(harvest.status) && (
                          <Link
                            href={`/farmer/harvest/${harvest.id}/edit`}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Edit
                          </Link>
                        )}
                        {canDelete(harvest.status) && (
                          <button
                            onClick={() => handleDelete(harvest.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-500"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
