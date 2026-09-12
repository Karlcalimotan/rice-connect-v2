'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import PrimaryButton from '@/components/ui/PrimaryButton'
import TextInput from '@/components/ui/TextInput'
import InputLabel from '@/components/ui/InputLabel'
import InputError from '@/components/ui/InputError'
import ApplicationLogo from '@/components/ui/ApplicationLogo'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <ApplicationLogo className="h-12 w-12" />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {success ? (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
            We&apos;ve sent a password reset link to your email. Check your inbox.
          </div>
        ) : (
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
                autoFocus
              />
            </div>

            <InputError message={error} />

            <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </PrimaryButton>
          </form>
        )}

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
