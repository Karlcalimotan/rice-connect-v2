'use client'

import { useEffect, useState } from 'react'

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications)
          setUnreadCount(data.notifications.filter((n: any) => n.notificationStatus === 'unread').length)
        }
      } catch {
        // error fetching notifications
      }
    }

    fetchNotifications()
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId,
        status: 'read',
        readAt: new Date().toISOString(),
      }),
    })

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ?           { ...n, notificationStatus: 'read', readAt: new Date().toISOString() }
          : n
      )
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  return { notifications, unreadCount, markAsRead }
}
