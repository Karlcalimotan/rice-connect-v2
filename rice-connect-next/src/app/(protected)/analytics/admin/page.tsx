'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts'

type AnalyticsData = {
  totalFarmers: number
  totalMillers: number
  totalDrivers: number
  totalRetailers: number
  totalHarvests: number
  totalVolume: number
  totalTransactions: number
  totalRevenue: number
  recentPrices: Array<{ riceVariety: string; pricePerKg: number; priceDate: string }>
}

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2']

export default function AdminAnalyticsPage() {
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

  // Price trend data
  const dates = [...new Set(data.recentPrices.map((p) => p.priceDate.split('T')[0]))].sort()
  const varieties = [...new Set(data.recentPrices.map((p) => p.riceVariety))]
  const priceChartData = dates.map((date) => {
    const entry: Record<string, string | number> = { date }
    const dayPrices = data.recentPrices.filter((p) => p.priceDate.startsWith(date))
    for (const p of dayPrices) {
      entry[p.riceVariety] = Number(p.pricePerKg)
    }
    return entry
  })

  const priceColors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#7c3aed', '#0891b2', '#ca8a04', '#be185d']

  // User distribution
  const userDistribution = [
    { name: 'Farmers', value: data.totalFarmers },
    { name: 'Millers', value: data.totalMillers },
    { name: 'Drivers', value: data.totalDrivers },
    { name: 'Retailers', value: data.totalRetailers },
  ].filter((d) => d.value > 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Supply chain overview and market intelligence</p>

      {/* Stats Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalFarmers + data.totalMillers + data.totalDrivers + data.totalRetailers}</p>
          <p className="text-xs text-gray-400">{data.totalFarmers} farmers · {data.totalMillers} millers · {data.totalDrivers} drivers</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Harvests</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalHarvests}</p>
          <p className="text-xs text-gray-400">{data.totalVolume.toLocaleString()} kg total volume</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalTransactions}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{formatCurrency(data.totalRevenue)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">User Distribution</h2>
          {userDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={userDistribution} cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                  {userDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">No users yet</p>
          )}
        </div>

        {/* Platform Volume */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Platform Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Harvest Batches</span>
              <span className="font-semibold text-gray-900">{data.totalHarvests}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Volume</span>
              <span className="font-semibold text-gray-900">{data.totalVolume.toLocaleString()} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ledger Entries</span>
              <span className="font-semibold text-gray-900">{data.totalTransactions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Revenue Circulated</span>
              <span className="font-semibold text-green-600">{formatCurrency(data.totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Price Trends */}
      {priceChartData.length > 1 && (
        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Market Price Trends</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={priceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₱${v}`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              {varieties.map((variety, i) => (
                <Line key={variety} type="monotone" dataKey={variety} stroke={priceColors[i % priceColors.length]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
