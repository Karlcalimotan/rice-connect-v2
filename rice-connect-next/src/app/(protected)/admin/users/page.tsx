'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  municipality: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params = new URLSearchParams()
        if (filter !== 'all') params.set('role', filter.toUpperCase())

        const url = `/api/admin/users${params.toString() ? `?${params}` : ''}`
        const res = await fetch(url)
        const data = await res.json()

        if (Array.isArray(data)) {
          setUsers(data)
        } else if (data && Array.isArray(data.users)) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [filter])

  const roleColors: Record<string, string> = {
    FARMER: 'bg-green-100 text-green-800',
    MILLER: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    RETAILER: 'bg-orange-100 text-orange-800',
    DRIVER: 'bg-gray-100 text-gray-800',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      <div className="mt-4 flex gap-2">
        {['all', 'farmer', 'miller', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              filter === role
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Municipality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                          roleColors[user.role] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {user.municipality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(user.created_at)}
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
