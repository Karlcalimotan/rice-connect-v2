'use client'

import { useEffect, useState } from 'react'

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'FARMER' | 'MILLER' | 'ADMIN' | 'RETAILER' | 'DRIVER'
  municipality: string | null
  province: string
  contact: string | null
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user')
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        }
      } catch {
        // user not authenticated or error
      }
      setLoading(false)
    }

    fetchUser()
  }, [])

  return { user, loading }
}
