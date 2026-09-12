'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

type MarketPrice = {
  id: number
  riceVariety: string
  pricePerKg: number
  marketRegion: string
  priceDate: string
}

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#ca8a04', '#be185d']

export default function MarketPricesPage() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVariety, setSelectedVariety] = useState('all')

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await fetch('/api/market-prices')
      const data = await res.json()

      if (data?.prices) setPrices(data.prices)
      setLoading(false)
    }

    fetchPrices()
  }, [])

  const varieties = [...new Set(prices.map((p) => p.riceVariety))]
  const filtered = selectedVariety === 'all'
    ? prices
    : prices.filter((p) => p.riceVariety === selectedVariety)

  // Group by date + variety for recharts
  const dates = [...new Set(filtered.map((p) => p.priceDate.split('T')[0]))].sort()
  const chartData = dates.map((date) => {
    const entry: Record<string, string | number> = { date }
    const dayPrices = filtered.filter((p) => p.priceDate.startsWith(date))
    for (const p of dayPrices) {
      entry[p.riceVariety] = p.pricePerKg
    }
    return entry
  })

  // Latest prices card
  const latestByVariety = varieties.reduce((acc, variety) => {
    const vp = prices.filter((p) => p.riceVariety === variety).sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())
    acc[variety] = { current: vp[0]?.pricePerKg || 0, previous: vp[1]?.pricePerKg || 0 }
    return acc
  }, {} as Record<string, { current: number; previous: number }>)

  const displayVarieties = selectedVariety === 'all' ? varieties : [selectedVariety]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Market Prices</h1>
      <p className="mt-2 text-gray-600">Current rice prices in Iloilo</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedVariety('all')}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            selectedVariety === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {varieties.map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVariety(v)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              selectedVariety === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {/* Price Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displayVarieties.map((variety) => {
              const item = latestByVariety[variety]
              if (!item) return null
              return (
                <div key={variety} className="rounded-lg border bg-white p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900">{variety}</h3>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {formatCurrency(item.current)}
                  </p>
                  <p className="text-sm text-gray-500">per kg</p>
                  {item.previous > 0 && (
                    <p className={`mt-2 text-sm font-medium ${item.current > item.previous ? 'text-green-600' : 'text-red-600'}`}>
                      {item.current > item.previous ? '↑' : '↓'}{' '}
                      {formatCurrency(Math.abs(item.current - item.previous))} from last
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-gray-900">Price Trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(val: string) => formatDate(val)}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(val: number) => `₱${val}`} />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                    labelFormatter={(label) => formatDate(String(label))}
                  />
                  <Legend />
                  {displayVarieties.map((variety, i) => (
                    <Line
                      key={variety}
                      type="monotone"
                      dataKey={variety}
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  )
}
