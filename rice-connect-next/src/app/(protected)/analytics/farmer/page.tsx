'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

type AnalyticsData = {
  totalHarvests: number
  totalWeight: number
  soldCount: number
  totalRevenue: number
  walletBalance: number
  byVariety: Record<string, number>
  recentPrices: Array<{ riceVariety: string; pricePerKg: number; priceDate: string }>
}

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#ca8a04', '#be185d']

export default function FarmerAnalyticsPage() {
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

  const statusData = Object.entries(data.byVariety).map(([name, value]) => ({ name, value }))

  // Price trend by variety
  const priceByVariety: Record<string, Array<{ date: string; price: number }>> = {}
  for (const p of data.recentPrices) {
    if (!priceByVariety[p.riceVariety]) priceByVariety[p.riceVariety] = []
    priceByVariety[p.riceVariety].push({ date: p.priceDate.split('T')[0], price: Number(p.pricePerKg) })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Farmer Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your farming operations</p>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Harvests</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalHarvests}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Weight</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalWeight.toLocaleString()} kg</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Sold</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{data.soldCount}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Harvest Status Distribution */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Harvest Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No data yet</p>
          )}
        </div>

        {/* Wallet Balance */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Wallet</h2>
          <div className="text-center">
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="mt-2 text-4xl font-bold text-green-600">{formatCurrency(Number(data.walletBalance))}</p>
          </div>
        </div>
      </div>

      {/* Market Price Trends */}
      {Object.keys(priceByVariety).length > 0 && (
        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Market Price Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(priceByVariety).map(([variety, prices]) => ({
              variety,
              latestPrice: prices[prices.length - 1]?.price || 0,
              avgPrice: prices.reduce((s, p) => s + p.price, 0) / prices.length,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="variety" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₱${v}`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="latestPrice" fill="#2563eb" name="Latest Price" />
              <Bar dataKey="avgPrice" fill="#93c5fd" name="Avg Price" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
