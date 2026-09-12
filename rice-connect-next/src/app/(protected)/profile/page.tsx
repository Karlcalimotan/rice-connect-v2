'use client'

import { useEffect, useState } from 'react'

import { useUser } from '@/hooks/useUser'
import PrimaryButton from '@/components/ui/PrimaryButton'
import DangerButton from '@/components/ui/DangerButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

const municipalities = [
  'Ajuy', 'Alimodian', 'Anilao', 'Badiangan', 'Balasan', 'Banate',
  'Barotac Nuevo', 'Barotac Viejo', 'Batad', 'Bingawan', 'Cabatuan',
  'Calinog', 'Carles', 'Concepcion', 'Dingle', 'Dueñas', 'Dumangas',
  'Estancia', 'Guimbal', 'Igbaras', 'Iloilo City', 'Janiuay', 'Lambunao',
  'Leganes', 'Lemery', 'Maasin', 'Mina', 'Miagao', 'New Lucena',
  'Oton', 'Pavia', 'Passi City', 'Pototan', 'San Dionisio', 'San Enrique',
  'San Joaquin', 'San Miguel', 'San Rafael', 'Santa Barbara', 'Sara',
  'Tigbauan', 'Tubungan', 'Zarraga',
]

export default function ProfilePage() {
  const { user } = useUser()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contact: '',
    municipality: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        contact: user.contact || '',
        municipality: user.municipality || '',
      })
    }
  }, [user])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact: formData.contact,
        municipality: formData.municipality,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to update profile')
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setDeleteLoading(true)

    if (user) {
      await fetch('/api/profile', { method: 'DELETE' })
      await fetch('/api/auth/signout', { method: 'POST' })
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <p className="mt-2 text-gray-600">Update your account information</p>

      <form onSubmit={handleUpdate} className="mt-6 space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="firstName" value="First Name" />
            <TextInput
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="lastName" value="Last Name" />
            <TextInput
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>

        <div>
          <InputLabel htmlFor="contact" value="Contact Number" />
          <TextInput
            id="contact"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <InputLabel htmlFor="municipality" value="Municipality" />
          <select
            id="municipality"
            value={formData.municipality}
            onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select municipality</option>
            {municipalities.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <InputLabel value="Email" />
          <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
        </div>

        <div>
          <InputLabel value="Role" />
          <p className="mt-1 text-sm text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
        </div>

        <InputError message={error} />

        <div className="flex items-center gap-4">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </PrimaryButton>
          {success && <p className="text-sm font-medium text-green-600">Saved!</p>}
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        <p className="mt-2 text-sm text-gray-600">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        {!showDelete ? (
          <DangerButton onClick={() => setShowDelete(true)} className="mt-4">
            Delete Account
          </DangerButton>
        ) : (
          <div className="mt-4 flex items-center gap-4">
            <DangerButton onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
            </DangerButton>
            <button
              onClick={() => setShowDelete(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
