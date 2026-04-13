'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { MessageSquare, Camera, MessagesSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { IntentBadge } from '@/components/ui/IntentBadge'
import { useInboxStream } from '@/hooks/useInboxStream'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Intent = 'READY_TO_BUY' | 'PRICE_INQUIRY' | 'INFO_REQUEST' | 'COMPLAINT' | 'BROWSING'

interface LatestMessage {
  id: number
  content: string
  intent: Intent | null
  sent_at: string | null
  direction: string
}

interface ContactSummary {
  id: number
  name: string
  platform: string
  ai_score: number
  unread_count: number
  latest_message: LatestMessage | null
}

interface InboxListProps {
  filters: {
    platform?: string
    intent?: string
    unread?: boolean
  }
}

const PLATFORM_ICON: Record<string, React.ElementType> = {
  INSTAGRAM: Camera,
  WHATSAPP: MessageSquare,
  FACEBOOK: MessagesSquare,
}

export function InboxList({ filters }: InboxListProps) {
  const { getToken } = useAuth()
  const [contacts, setContacts] = useState<ContactSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInbox = useCallback(async () => {
    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (filters.platform) params.set('platform', filters.platform)
      if (filters.intent) params.set('intent', filters.intent)
      if (filters.unread) params.set('unread', 'true')

      const res = await fetch(`${API_URL}/api/inbox/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setContacts(data.results || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [getToken, filters])

  useEffect(() => {
    fetchInbox()
  }, [fetchInbox])

  useInboxStream({
    onNewMessage: () => {
      fetchInbox()
    },
    onMessageUpdated: () => {
      fetchInbox()
    },
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No conversations yet. Messages will appear here once your channels receive them.
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
      {contacts.map((contact) => {
        const Icon = PLATFORM_ICON[contact.platform] || MessageSquare
        return (
          <Link
            key={contact.id}
            href={`/inbox/${contact.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {contact.name || contact.platform}
                </span>
                {contact.latest_message?.intent && (
                  <IntentBadge intent={contact.latest_message.intent} />
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {contact.latest_message?.content || 'No messages'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {contact.unread_count > 0 && (
                <Badge className="bg-indigo-600 text-white text-[10px] min-w-[20px] h-5 flex items-center justify-center">
                  {contact.unread_count}
                </Badge>
              )}
              <span className="text-[10px] text-gray-400">
                Score: {contact.ai_score}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
