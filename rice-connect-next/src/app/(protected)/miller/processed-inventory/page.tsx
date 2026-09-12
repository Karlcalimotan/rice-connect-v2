'use client'

import { useEffect, useState } from 'react'
// Supabase kept for setPrice mutation (finished_rice_stocks) — no API route for this yet
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/hooks/useUser'
import { formatCurrency } from '@/lib/utils'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type RiceStock = {
  id: number
  rice_variety: string
  total_sacks: number
  unpacked_weight_kg: number | null
  price_per_kg: number | null
  created_at: string
}

export default function MillerProcessedInventoryPage() {
  const { user } = useUser()
  const [stocks, setStocks] = useState<RiceStock[]>([])
  const [loading, setLoading] = useState(true)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [selectedStock, setSelectedStock] = useState<RiceStock | null>(null)
  const [price, setPrice] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchStocks = async () => {
      const res = await fetch('/api/miller/processed')
      if (res.ok) {
        const { stocks } = await res.json()
        const mapped = stocks.map((s: Record<string, unknown>) => ({
          id: s.id,
          rice_variety: s.riceVariety,
          total_sacks: s.totalSacks,
          unpacked_weight_kg: s.unpackedWeightKg,
          price_per_kg: s.pricePerKg,
          created_at: s.createdAt,
        }))
        setStocks(mapped as unknown as RiceStock[])
      }
      setLoading(false)
    }

    fetchStocks()
  }, [user])

  const handleSetPrice = async () => {
    if (!selectedStock || !price) return

    const supabase = createClient()
    await supabase
      .from('finished_rice_stocks')
      .update({ price_per_kg: parseFloat(price) })
      .eq('id', selectedStock.id)

    setStocks((prev) =>
      prev.map((s) =>
        s.id === selectedStock.id ? { ...s, price_per_kg: parseFloat(price) } : s
      )
    )

    setShowPriceModal(false)
    setSelectedStock(null)
    setPrice('')
  }

  const totalValue = stocks.reduce((sum, s) => {
    if (s.price_per_kg) return sum + s.total_sacks * 50 * Number(s.price_per_kg)
    return sum
  }, 0)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rice Stock</h1>
          <p className="mt-1 text-sm text-gray-500">
            Finished rice ready for sale • Total value: {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : stocks.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No rice stock yet. Mill some palay first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stocks.map((stock) => (
              <div key={stock.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{stock.rice_variety}</h3>
                    <p className="text-sm text-gray-500">{stock.total_sacks} sacks</p>
                    {stock.unpacked_weight_kg && (
                      <p className="text-xs text-gray-400">
                        Leftover: {stock.unpacked_weight_kg} kg
                      </p>
                    )}
                    {stock.price_per_kg && (
                      <p className="mt-1 text-sm font-semibold text-green-600">
                        {formatCurrency(Number(stock.price_per_kg))}/kg
                      </p>
                    )}
                  </div>
                  <PrimaryButton
                    onClick={() => {
                      setSelectedStock(stock)
                      setPrice(stock.price_per_kg?.toString() || '')
                      setShowPriceModal(true)
                    }}
                  >
                    {stock.price_per_kg ? 'Update Price' : 'Set Price'}
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPriceModal && selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Set Price - {selectedStock.rice_variety}</h2>
            <div className="mt-4">
              <InputLabel value="Price per kg" />
              <TextInput
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <PrimaryButton onClick={handleSetPrice}>Save</PrimaryButton>
              <button onClick={() => setShowPriceModal(false)} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
