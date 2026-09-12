'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Fetch user profile to determine role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      setError('Failed to load user profile')
      setLoading(false)
      return
    }

    // Redirect based on role
    const roleRoutes: Record<string, string> = {
      FARMER: '/farmer/harvest',
      MILLER: '/miller/marketplace',
      ADMIN: '/admin/dashboard',
    }

    router.push(roleRoutes[profile.role] || '/farmer/harvest')
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign in</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <InputLabel htmlFor="email" value="Email" />
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full"
            required
          />
        </div>

        <div>
          <InputLabel htmlFor="password" value="Password" />
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full"
            required
          />
        </div>

        <InputError message={error} />

        <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Signing in...' : 'Sign in'}
        </PrimaryButton>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register here
        </a>
      </p>
    </div>
  )
}
