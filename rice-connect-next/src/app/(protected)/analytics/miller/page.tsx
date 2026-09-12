'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type AnalyticsData = {
  totalPurchases: number
  totalWeight: number
  totalSpent: number
  walletBalance: number
  stocks: Array<{ riceVariety: string; totalSacks: number; unpackedWeightKg: number; pricePerSack: number | null }>
  totalRiceSacks: number
  totalRiceValue: number
  processedCount: number
  pendingCount: number
}

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#ca8a04', '#be185d']

export default function MillerAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-gray-500 py-12">Loading analytics...</div>
  if (!data) return <div className="text-center text-gray-500 py-12">Failed to load analytics</div>

  const stockByVariety = data.stocks.map((s) => ({
    name: s.riceVariety,
    sacks: s.totalSacks,
    value: s.totalSacks * (s.pricePerSack || 50 * 28),
  }))

  const processingData = [
    { name: 'Processed', value: data.processedCount },
    { name: 'Pending', value: data.pendingCount },
  ].filter((d) => d.value > 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Miller Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Processing efficiency and inventory overview</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalPurchases}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">{formatCurrency(data.totalSpent)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rice Stock</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{data.totalRiceSacks} sacks</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Rice Value</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{formatCurrency(data.totalRiceValue)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Stock by Variety */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Stock by Variety</h2>
          {stockByVariety.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockByVariety}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `${v} sacks`} />
                <Bar dataKey="sacks" fill="#16a34a" name="Sacks" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No rice stock yet</p>
          )}
        </div>

        {/* Processing Status */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Processing Status</h2>
          {processingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={processingData} cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {processingData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#16a34a' : '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No processing data</p>
          )}
        </div>
      </div>

      {/* Wallet */}
      <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Wallet</h2>
        <div className="text-center">
          <p className="text-sm text-gray-500">Current Balance</p>
          <p className="mt-2 text-4xl font-bold text-green-600">{formatCurrency(Number(data.walletBalance))}</p>
        </div>
      </div>
    </div>
  )
}
