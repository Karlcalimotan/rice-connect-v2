import { formatCurrency } from '@/lib/utils'

export default function RetailerAnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Retailer Analytics</h1>
      <p className="mt-1 text-sm text-gray-500">Retailer module analytics (coming soon)</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="mt-1 text-3xl font-bold text-orange-600">{formatCurrency(0)}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Deliveries</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">0</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Wallet Balance</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{formatCurrency(0)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto mb-4 text-4xl">📊</div>
        <h2 className="text-lg font-semibold text-gray-900">Retailer Analytics Coming Soon</h2>
        <p className="mt-2 text-sm text-gray-500">
          The retailer module is deferred from v1. Once it&apos;s built, this dashboard will show
          stock turnover, demand patterns, and profit margins.
        </p>
      </div>
    </div>
  )
}
