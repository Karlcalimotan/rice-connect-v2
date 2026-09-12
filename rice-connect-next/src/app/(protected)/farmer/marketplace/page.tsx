'use client'

import { useEffect, useState } from 'react'

import { formatCurrency, formatDate } from '@/lib/utils'
import TextInput from '@/components/ui/TextInput'

type HarvestBatch = {
  id: number
  rice_variety: string
  total_weight: number
  price_per_kg: number | null
  status: string
  harvest_date: string
  number_of_bags: number
  user_id: string
  users: { first_name: string; last_name: string; municipality: string } | null
}

export default function FarmerMarketplacePage() {
  const [harvests, setHarvests] = useState<HarvestBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchHarvests = async () => {
      const res = await fetch('/api/marketplace?status=unsold')
      if (res.ok) {
        const data = await res.json()
        setHarvests(data)
      }
      setLoading(false)
    }

    fetchHarvests()
  }, [])

  const filtered = harvests.filter(
    (h) =>
      h.rice_variety.toLowerCase().includes(search.toLowerCase()) ||
      h.users?.municipality?.toLowerCase().includes(search.toLowerCase())
  )

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
            {filtered.map((harvest) => (
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
                    {formatCurrency(harvest.price_per_kg)}/kg
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
