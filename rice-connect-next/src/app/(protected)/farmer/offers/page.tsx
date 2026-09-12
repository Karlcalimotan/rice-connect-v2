'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'

type Offer = {
  id: number
  riceVariety: string
  totalWeight: number
  numberOfBags: number
  harvestDate: string
  status: string
  interests: Array<{
    id: number
    millerId: string
    miller: {
      firstName: string
      lastName: string
      municipality: string
    } | null
  }>
}

export default function FarmerOffersPage() {
  const { user } = useUser()
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchOffers = async () => {
      const res = await fetch('/api/offers')
      const data = await res.json()

      if (data?.offers) setOffers(data.offers as Offer[])
      setLoading(false)
    }

    fetchOffers()
  }, [user])

  const handleAccept = async (batchId: number, millerId: string) => {
    if (!user) return
    setAccepting(batchId)

    const res = await fetch(`/api/offers/${batchId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, millerId }),
    })

    if (!res.ok) {
      console.error('Accept failed')
      setAccepting(null)
      return
    }

    // Create booking
    const batch = offers.find((o) => o.id === batchId)
    if (batch) {
      const { broadcastPalayPickup } = await import('@/lib/booking')
      await broadcastPalayPickup(batchId)
    }

    // Notify miller
    const { createNotification } = await import('@/lib/notifications')
    await createNotification(millerId, 'handshake.accepted', {
      message: `${user.firstName} ${user.lastName} accepted your interest`,
      batchId,
    })

    // Remove from list
    setOffers((prev) => prev.filter((o) => o.id !== batchId))
    setAccepting(null)
  }

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Mill Handshake Offers</h1>
      <p className="mt-2 text-gray-600">Review and accept millers interested in your harvest</p>

      {offers.length === 0 ? (
        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No active offers. Waiting for millers...</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{offer.riceVariety}</h3>
                  <p className="text-sm text-gray-500">
                    {offer.numberOfBags} bags • {offer.totalWeight} kg
                  </p>
                  <p className="text-xs text-gray-400">
                    Harvested {formatDate(offer.harvestDate)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700">Interested Millers:</p>
                <div className="mt-2 space-y-3">
                  {offer.interests.map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {interest.miller?.firstName} {interest.miller?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {interest.miller?.municipality}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAccept(offer.id, interest.millerId)}
                        disabled={accepting === offer.id}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50"
                      >
                        {accepting === offer.id ? 'Accepting...' : 'Accept'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
