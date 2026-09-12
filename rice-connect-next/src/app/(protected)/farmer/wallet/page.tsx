'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'

type Wallet = {
  balance: number
}

type LedgerEntry = {
  id: number
  amount: number
  type: string
  description: string
  created_at: string
}

export default function FarmerWalletPage() {
  const { user } = useUser()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const res = await fetch('/api/wallet')
      if (res.ok) {
        const { balance, ledgerEntries } = await res.json()
        setWallet({ balance })
        setEntries(ledgerEntries.map((e: Record<string, unknown>) => ({
          id: e.id,
          amount: e.amount,
          type: e.type,
          description: e.description,
          created_at: e.createdAt,
        })))
      }
      setLoading(false)
    }

    fetchData()
  }, [user])

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>

      <div className="mt-6 rounded-lg bg-gray-900 p-6 text-white">
        <p className="text-sm text-gray-300">Available Balance</p>
        <p className="mt-1 text-4xl font-bold">{formatCurrency(wallet?.balance || 0)}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        {entries.length === 0 ? (
          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="mt-4 divide-y rounded-lg border bg-white">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-gray-900">{entry.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
                </div>
                <span
                  className={`text-lg font-semibold ${
                    entry.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.type === 'credit' ? '+' : '-'}
                  {formatCurrency(entry.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
