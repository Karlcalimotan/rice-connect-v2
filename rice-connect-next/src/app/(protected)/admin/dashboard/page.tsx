'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'

type Stats = {
  totalFarmers: number
  totalMillers: number
  totalHarvests: number
  totalTransactions: number
  totalVolume: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalFarmers: 0,
    totalMillers: 0,
    totalHarvests: 0,
    totalTransactions: 0,
    totalVolume: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics')
        const data = await res.json()

        if (data) {
          setStats({
            totalFarmers: data.totalFarmers ?? 0,
            totalMillers: data.totalMillers ?? 0,
            totalHarvests: data.totalHarvests ?? 0,
            totalTransactions: data.totalTransactions ?? 0,
            totalVolume: data.totalVolume ?? 0,
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Farmers', value: stats.totalFarmers, icon: '👨‍🌾' },
    { label: 'Total Millers', value: stats.totalMillers, icon: '🏭' },
    { label: 'Harvest Listings', value: stats.totalHarvests, icon: '🌾' },
    { label: 'Transactions', value: stats.totalTransactions, icon: '💰' },
    { label: 'Total Volume', value: formatCurrency(stats.totalVolume), icon: '📈' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Overview of RiceConnect activity</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center">
              <span className="text-3xl">{card.icon}</span>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
