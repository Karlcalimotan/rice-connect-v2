'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

const riceVarieties = [
  'IR 64', 'NSIC Rc 222', 'NSIC Rc 160', 'PSB Rc 82',
  'IR 42', 'IR 72', 'IR 75260', 'Bigasan',
]

export default function EditHarvestPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()
  const batchId = params.id as string

  const [formData, setFormData] = useState({
    riceVariety: '',
    harvestDate: '',
    condition: 'fresh',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchBatch = async () => {
      const res = await fetch(`/api/harvest/${batchId}`)
      if (!res.ok) {
        setError('Harvest not found')
        setFetching(false)
        return
      }
      const data = await res.json()

      setFormData({
        riceVariety: data.rice_variety,
        harvestDate: data.harvest_date?.split('T')[0] || '',
        condition: data.condition || 'fresh',
      })
      setFetching(false)
    }

    fetchBatch()
  }, [user, batchId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch(`/api/harvest/${batchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rice_variety: formData.riceVariety,
        harvest_date: formData.harvestDate,
        condition: formData.condition,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      setError(err.message || 'Failed to save changes')
      setLoading(false)
      return
    }

    router.push('/farmer/harvest')
  }

  if (fetching) {
    return <div className="text-center text-gray-500">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Edit Harvest #{batchId}</h1>

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
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
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

        <div>
          <InputLabel htmlFor="condition" value="Condition" />
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="fresh">Fresh</option>
            <option value="ready">Ready</option>
          </select>
        </div>

        <InputError message={error} />

        <div className="flex gap-4">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
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
