'use client'

import { useEffect, useState } from 'react'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'

type Municipality = {
  id: number
  name: string
  distance_index: number
  created_at: string
}

export default function AdminMunicipalitiesPage() {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', distanceIndex: '' })
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchMunicipalities()
  }, [])

  const fetchMunicipalities = async () => {
    try {
      const res = await fetch('/api/admin/municipalities')
      const data = await res.json()

      const list = Array.isArray(data) ? data : (data?.municipalities ?? [])
      setMunicipalities(list)
    } catch (error) {
      console.error('Failed to fetch municipalities:', error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name,
      distance_index: parseInt(form.distanceIndex) || 0,
    }

    try {
      if (editingId) {
        await fetch('/api/admin/municipalities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })
      } else {
        await fetch('/api/admin/municipalities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
    } catch (error) {
      console.error('Failed to save municipality:', error)
    }

    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', distanceIndex: '' })
    fetchMunicipalities()
  }

  const handleEdit = (m: Municipality) => {
    setForm({ name: m.name, distanceIndex: m.distance_index.toString() })
    setEditingId(m.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This may affect users assigned to this municipality.`)) return
    try {
      await fetch('/api/admin/municipalities', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.error('Failed to delete municipality:', error)
    }
    fetchMunicipalities()
  }

  const filtered = municipalities.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Municipalities</h1>
          <p className="mt-1 text-sm text-gray-500">{municipalities.length} municipalities in Iloilo</p>
        </div>
        <PrimaryButton
          onClick={() => {
            setShowForm(true)
            setEditingId(null)
            setForm({ name: '', distanceIndex: '' })
          }}
        >
          + Add Municipality
        </PrimaryButton>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Municipality' : 'New Municipality'}</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <InputLabel value="Name" />
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full"
                required
              />
            </div>
            <div>
              <InputLabel value="Distance Index" />
              <TextInput
                type="number"
                min="0"
                value={form.distanceIndex}
                onChange={(e) => setForm({ ...form, distanceIndex: e.target.value })}
                className="mt-1 w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <PrimaryButton type="submit">{editingId ? 'Update' : 'Add'}</PrimaryButton>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null) }}
              className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4">
        <TextInput
          placeholder="Search municipalities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Distance Index</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((m, i) => (
                  <tr key={m.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-900">{m.name}</td>
                    <td className="px-4 py-2 text-gray-500">{m.distance_index}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => handleEdit(m)} className="mr-2 text-xs font-medium text-indigo-600 hover:text-indigo-500">Edit</button>
                      <button onClick={() => handleDelete(m.id, m.name)} className="text-xs font-medium text-red-600 hover:text-red-500">Delete</button>
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
