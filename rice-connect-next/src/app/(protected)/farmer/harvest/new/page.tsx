'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

const riceVarieties = [
  'IR 64', 'NSIC Rc 222', 'NSIC Rc 160', 'PSB Rc 82',
  'IR 42', 'IR 72', 'IR 75260', 'Bigasan',
]

export default function NewHarvestPage() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState({
    riceVariety: '',
    numberOfBags: '',
    totalWeight: '',
    pricePerKg: '',
    harvestDate: new Date().toISOString().split('T')[0],
    notifyMillers: true,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    const res = await fetch('/api/harvest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        rice_variety: formData.riceVariety,
        number_of_bags: parseInt(formData.numberOfBags),
        total_weight: parseFloat(formData.totalWeight),
        price_per_kg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : null,
        harvest_date: formData.harvestDate,
        status: 'available',
        delivery_status: 'Pending',
        delivery_type: 'palay',
        hidden_from_farmer: false,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      setError(err.message || 'Failed to create listing')
      setLoading(false)
      return
    }

    const newBatch = await res.json()

    // Notify all millers if opted in
    if (formData.notifyMillers && newBatch) {
      const { notifyAllMillers } = await import('@/lib/notifications')
      await notifyAllMillers('harvest.new', {
        message: `New ${formData.riceVariety} harvest available (${formData.totalWeight} kg)`,
        batchId: newBatch.id,
        farmerName: `${user.firstName} ${user.lastName}`,
        variety: formData.riceVariety,
        weight: formData.totalWeight,
      })
    }

    router.push('/farmer/harvest')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">New Harvest Listing</h1>
      <p className="mt-2 text-gray-600">List your harvest for millers to browse</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="riceVariety" value="Rice Variety" />
          <select
            id="riceVariety"
            name="riceVariety"
            value={formData.riceVariety}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select variety</option>
            {riceVarieties.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="numberOfBags" value="Number of bags" />
            <TextInput
              id="numberOfBags"
              name="numberOfBags"
              type="number"
              min="1"
              value={formData.numberOfBags}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="totalWeight" value="Total weight (kg)" />
            <TextInput
              id="totalWeight"
              name="totalWeight"
              type="number"
              step="0.01"
              min="0"
              value={formData.totalWeight}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>

        <div>
          <InputLabel htmlFor="pricePerKg" value="Price per kg (optional)" />
          <TextInput
            id="pricePerKg"
            name="pricePerKg"
            type="number"
            step="0.01"
            min="0"
            value={formData.pricePerKg}
            onChange={handleChange}
            className="mt-1 block w-full"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave blank if you want millers to make offers
          </p>
        </div>

        <div>
          <InputLabel htmlFor="harvestDate" value="Harvest date" />
          <TextInput
            id="harvestDate"
            name="harvestDate"
            type="date"
            value={formData.harvestDate}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notifyMillers"
            name="notifyMillers"
            checked={formData.notifyMillers}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          <InputLabel htmlFor="notifyMillers" value="Notify all millers in Iloilo" />
        </div>

        <InputError message={error} />

        <div className="flex gap-4">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </PrimaryButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
