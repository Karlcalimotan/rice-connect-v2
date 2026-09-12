'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type MarketPrice = {
  id: number
  riceVariety: string
  pricePerKg: number
  marketRegion: string
  priceDate: string
  createdAt: string
}

const riceVarieties = [
  'IR 64', 'NSIC Rc 222', 'NSIC Rc 160', 'PSB Rc 82',
  'IR 42', 'IR 72', 'IR 75260', 'Bigasan',
]

export default function AdminMarketPricesPage() {
  const { user } = useUser()
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    riceVariety: '',
    pricePerKg: '',
    marketRegion: 'Iloilo',
    priceDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/admin/market-prices')
      const data = await res.json()

      const list = Array.isArray(data) ? data : (data?.prices ?? [])
      setPrices(list)
    } catch (error) {
      console.error('Failed to fetch market prices:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const payload = {
      rice_variety: form.riceVariety,
      price_per_kg: parseFloat(form.pricePerKg),
      market_region: form.marketRegion,
      price_date: form.priceDate,
    }

    try {
      if (editingId) {
        await fetch('/api/admin/market-prices', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
      } else {
        await fetch('/api/admin/market-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
    } catch (error) {
      console.error('Failed to save market price:', error)
    }

    setShowForm(false)
    setEditingId(null)
    setForm({ riceVariety: '', pricePerKg: '', marketRegion: 'Iloilo', priceDate: new Date().toISOString().split('T')[0] })
    fetchPrices()
  }

  const handleEdit = (price: MarketPrice) => {
    setForm({
      riceVariety: price.riceVariety,
      pricePerKg: price.pricePerKg.toString(),
      marketRegion: price.marketRegion,
      priceDate: price.priceDate.split('T')[0],
    })
    setEditingId(price.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this price entry?')) return
    try {
      await fetch('/api/admin/market-prices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error('Failed to delete market price:', error)
    }
    fetchPrices()
  }

  // Group by variety for display
  const latestByVariety = prices.reduce((acc, price) => {
    if (!acc[price.riceVariety]) acc[price.riceVariety] = price
    return acc
  }, {} as Record<string, MarketPrice>)

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
        <PrimaryButton
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ riceVariety: '', pricePerKg: '', marketRegion: 'Iloilo', priceDate: new Date().toISOString().split('T')[0] })
          }}
        >
          + Add Price
        </PrimaryButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Price' : 'New Price Entry'}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <InputLabel value="Rice Variety" />
              <select
                value={form.riceVariety}
                onChange={(e) => setForm({ ...form, riceVariety: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="">Select variety</option>
                {riceVarieties.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <InputLabel value="Price per kg (₱)" />
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={form.pricePerKg}
                onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <InputLabel value="Market Region" />
              <TextInput
                value={form.marketRegion}
                onChange={(e) => setForm({ ...form, marketRegion: e.target.value })}
                className="mt-1 w-full"
              />
            </div>
            <div>
              <InputLabel value="Date" />
              <TextInput
                type="date"
                value={form.priceDate}
                onChange={(e) => setForm({ ...form, priceDate: e.target.value })}
                className="mt-1 w-full"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <PrimaryButton type="submit">{editingId ? 'Update' : 'Add'}</PrimaryButton>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : prices.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No market prices yet</p>
          </div>
        ) : (
          <>
            <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase">Latest by Variety</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.values(latestByVariety).map((price) => (
                <div key={price.id} className="rounded-lg border bg-white p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900">{price.riceVariety}</h4>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    {formatCurrency(price.pricePerKg)}/kg
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(price.priceDate)}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-6 mb-3 text-sm font-semibold text-gray-500 uppercase">History</h3>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variety</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price/kg</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {prices.map((price) => (
                    <tr key={price.id} className="bg-white">
                      <td className="px-4 py-2 font-medium text-gray-900">{price.riceVariety}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">{formatCurrency(price.pricePerKg)}</td>
                      <td className="px-4 py-2 text-gray-500">{price.marketRegion}</td>
                      <td className="px-4 py-2 text-gray-400">{formatDate(price.priceDate)}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => handleEdit(price)} className="mr-2 text-xs font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
                        <button onClick={() => handleDelete(price.id)} className="text-xs font-medium text-red-600 hover:text-red-500">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
