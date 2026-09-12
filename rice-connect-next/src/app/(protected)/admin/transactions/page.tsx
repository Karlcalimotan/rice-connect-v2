'use client'

import { useEffect, useState } from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

type LedgerEntry = {
  id: number
  amount: number
  type: string
  description: string
  created_at: string
  users: {
    first_name: string
    last_name: string
    role: string
  } | null
}

export default function AdminTransactionsPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/admin/transactions')
        const data = await res.json()

        const list = Array.isArray(data) ? data : (data?.entries ?? [])
        setEntries(list.slice(0, 100))
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      }
      setLoading(false)
    }

    fetchEntries()
  }, [filter])

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.type === filter)

  const totalCredits = entries
    .filter((e) => e.type === 'credit')
    .reduce((sum, e) => sum + e.amount, 0)
  const totalDebits = entries
    .filter((e) => e.type === 'debit')
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Credits</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-500">Total Debits</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {['all', 'credit', 'debit'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === type
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((entry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.users?.first_name} {entry.users?.last_name}
                      <span className="ml-2 text-xs text-gray-400">({entry.users?.role})</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          entry.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 font-semibold ${
                        entry.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {entry.type === 'credit' ? '+' : '-'}
                      {formatCurrency(entry.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {entry.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(entry.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
