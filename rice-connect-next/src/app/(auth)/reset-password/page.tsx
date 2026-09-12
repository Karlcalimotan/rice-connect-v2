'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'
import ApplicationLogo from '@/components/ui/ApplicationLogo'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      const supabase = createClient()
      supabase.auth.exchangeCodeForSession(code)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const res = await fetch('/api/user')
        if (res.ok) {
          const { user: profile } = await res.json()
          const roleRoutes: Record<string, string> = {
            FARMER: '/farmer/harvest',
            MILLER: '/miller/marketplace',
            ADMIN: '/admin/dashboard',
          }
          setTimeout(() => router.push(roleRoutes[profile.role] || '/farmer/harvest'), 2000)
        }
      }
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <ApplicationLogo className="h-12 w-12" />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Reset Password
        </h2>

        {success ? (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            Password updated! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <InputLabel htmlFor="password" value="New Password" />
              <TextInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full"
                required
                autoFocus
              />
            </div>
            <div>
              <InputLabel htmlFor="confirmPassword" value="Confirm Password" />
              <TextInput
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full"
                required
              />
            </div>

            <InputError message={error} />

            <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Updating...' : 'Reset Password'}
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
