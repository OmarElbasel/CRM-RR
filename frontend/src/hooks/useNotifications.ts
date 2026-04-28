'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'

interface NotificationData {
  id: number
  deal_id: number
  notification_type: string
  priority: string
  title: string
  body: string
  body_ar: string
  created_at: string
  read_at: string | null
}

interface NotificationState {
  unread_count: number
  results: NotificationData[]
  loading: boolean
  refresh: () => void
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const POLL_INTERVAL = 60_000 // 60 seconds

export function useNotifications(enabled: boolean): NotificationState {
  const { getToken } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [results, setResults] = useState<NotificationData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.unread_count || 0)
        setResults(data.results || [])
      }
    } catch {
      // Silently fail on poll errors
    } finally {
      setLoading(false)
    }
  }, [enabled, getToken])

  useEffect(() => {
    fetchNotifications()
    if (!enabled) return

    const interval = setInterval(fetchNotifications, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [enabled, fetchNotifications])

  return {
    unread_count: unreadCount,
    results,
    loading,
    refresh: fetchNotifications,
  }
}
