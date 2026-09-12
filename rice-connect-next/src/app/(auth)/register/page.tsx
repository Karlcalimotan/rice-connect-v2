'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

const iloiloMunicipalities = [
  'Ajuy', 'Alimodian', 'Anilao', 'Badiangan', 'Balasan',
  'Banate', 'Barotac Nuevo', 'Barotac Viejo', 'Batad', 'Bingawan',
  'Cabatuan', 'Calinog', 'Carles', 'Concepcion', 'Dueñas',
  'Dumangas', 'Dingle', 'Estancia', 'Guimbal', 'Igbaras',
  'Iloilo City', 'Janiuay', 'Lambunao', 'Leganes', 'Leon',
  'Maasin', 'Miagao', 'Mina', 'New Lucena', 'Oton',
  'Passi City', 'Pavia', 'Pototan', 'San Dionisio', 'San Enrique',
  'San Joaquin', 'San Miguel', 'San Rafael', 'Santa Barbara',
  'Sara', 'Tigbauan', 'Tubungan', 'Zarraga',
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    municipality: '',
    role: 'FARMER',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        contact: formData.contact,
        municipality: formData.municipality,
        role: formData.role,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create account')
      setLoading(false)
      return
    }

    router.push('/login')
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Create account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputLabel htmlFor="firstName" value="First name" />
            <TextInput
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="lastName" value="Last name" />
            <TextInput
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full"
              required
            />
          </div>
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="contact" value="Contact number" />
          <TextInput
            id="contact"
            name="contact"
            type="tel"
            value={formData.contact}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="municipality" value="Municipality" />
          <select
            id="municipality"
            name="municipality"
            value={formData.municipality}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select municipality</option>
            {iloiloMunicipalities.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <InputLabel htmlFor="role" value="I am a..." />
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="FARMER">Farmer</option>
            <option value="MILLER">Miller</option>
          </select>
        </div>

        <div>
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="confirmPassword" value="Confirm password" />
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full"
            required
          />
        </div>

        <InputError message={error} />

        <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Creating account...' : 'Create account'}
        </PrimaryButton>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </a>
      </p>
    </div>
  )
}
