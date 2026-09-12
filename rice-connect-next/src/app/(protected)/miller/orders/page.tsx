'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { formatCurrency, formatDate } from '@/lib/utils'

type Order = {
  id: number
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  delivery_address: string | null
  created_at: string
  buyer: { first_name: string; last_name: string; municipality: string } | null
  order_items: Array<{
    id: number
    quantity_kg: number
    price_per_kg: number
    finished_rice_stocks: { rice_variety: string } | null
  }> | null
}

export default function MillerOrdersPage() {
  const { user } = useUser()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      const params = new URLSearchParams()
      if (filter !== 'all') params.set('status', filter)
      const res = await fetch(`/api/miller/orders?${params}`)
      if (res.ok) {
        const { orders } = await res.json()
        const mapped = orders.map((o: Record<string, unknown>) => ({
          id: o.id,
          order_number: o.orderNumber,
          total_amount: o.totalAmount,
          status: o.status,
          payment_status: o.paymentStatus,
          delivery_address: o.deliveryAddress,
          created_at: o.createdAt,
          buyer: o.retailer ? {
            first_name: (o.retailer as Record<string, unknown>).firstName,
            last_name: (o.retailer as Record<string, unknown>).lastName,
            municipality: (o.retailer as Record<string, unknown>).municipality,
          } : null,
          order_items: o.stock ? [{
            id: 1,
            quantity_kg: 0,
            price_per_kg: 0,
            finished_rice_stocks: { rice_variety: (o.stock as Record<string, unknown>).riceVariety },
          }] : null,
        }))
        setOrders(mapped as unknown as Order[])
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user, filter])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      <p className="mt-2 text-gray-600">Manage incoming rice orders</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {['all', 'pending', 'paid', 'shipped', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                    {order.buyer && (
                      <p className="text-sm text-gray-500">
                        {order.buyer.first_name} {order.buyer.last_name} • {order.buyer.municipality}
                      </p>
                    )}
                    {order.order_items?.map((item) => (
                      <p key={item.id} className="text-xs text-gray-400">
                        {item.finished_rice_stocks?.rice_variety} • {item.quantity_kg} kg @ {formatCurrency(item.price_per_kg)}/kg
                      </p>
                    ))}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {order.status}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
