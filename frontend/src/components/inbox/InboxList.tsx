'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useInboxStream } from '@/hooks/useInboxStream'
import { formatDistanceToNow } from 'date-fns'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Intent = 'READY_TO_BUY' | 'PRICE_INQUIRY' | 'INFO_REQUEST' | 'COMPLAINT' | 'BROWSING' | 'CUSTOMER_SUPPORT' | 'SPAM'

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

const PLATFORM_CONFIG: Record<string, { icon: string; className: string; bg: string }> = {
  INSTAGRAM: { icon: 'alternate_email', className: 'text-pink-600', bg: 'bg-pink-50' },
  WHATSAPP: { icon: 'forum', className: 'text-green-600', bg: 'bg-green-50' },
  FACEBOOK: { icon: 'send', className: 'text-blue-600', bg: 'bg-blue-50' },
  TELEGRAM: { icon: 'chat', className: 'text-sky-500', bg: 'bg-sky-50' },
}

const INTENT_CONFIG: Record<string, { label: string, className: string }> = {
  READY_TO_BUY: { label: 'Ready to Buy', className: 'bg-secondary-container text-on-secondary-container border-secondary' },
  PRICE_INQUIRY: { label: 'Price Inquiry', className: 'bg-tertiary-container text-on-tertiary-container border-tertiary' },
  CUSTOMER_SUPPORT: { label: 'Support', className: 'bg-surface-container-high text-on-surface-variant border-outline-variant' },
  SPAM: { label: 'Irrelevant', className: 'bg-error-container text-on-error-container border-error' },
  INFO_REQUEST: { label: 'Inquiry', className: 'bg-primary-container text-on-primary-container border-primary' },
}

function CircularScore({ score }: { score: number }) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  
  // Dynamic color based on score
  const color = score > 80 ? '#00efce' : score > 50 ? '#594fbf' : '#ac3149'
  
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle 
          cx="20" cy="20" r={radius} 
          fill="transparent" 
          stroke="#eaedff" 
          strokeWidth="4" 
        />
        <circle 
          cx="20" cy="20" r={radius} 
          fill="transparent" 
          stroke={color} 
          strokeWidth="4" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-on-surface">{score}</span>
    </div>
  )
}

export function InboxList({ filters }: InboxListProps) {
  const { getToken } = useAuth()
  const [contacts, setContacts] = useState<ContactSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ count: 0, current: 1 })

  const fetchInbox = useCallback(async (page = 1) => {
    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (filters.platform) params.set('platform', filters.platform)
      if (filters.intent) params.set('intent', filters.intent)
      if (filters.unread) params.set('unread', 'true')
      params.set('page', page.toString())

      const res = await fetch(`${API_URL}/api/inbox/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setContacts(data.results || [])
        setPagination({ count: data.count || 0, current: page })
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
      fetchInbox(pagination.current)
    },
    onMessageUpdated: () => {
      fetchInbox(pagination.current)
    },
  })

  if (loading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm animate-pulse">
        <div className="h-12 bg-surface-container border-b border-outline-variant/30" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 border-b border-outline-variant/30 bg-surface/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
      {/* List Header */}
      <div className="grid grid-cols-[48px_1fr_120px_100px_80px_100px] gap-4 px-6 py-3 bg-surface-container text-[11px] font-bold text-outline uppercase tracking-wider">
        <div className="text-center">Src</div>
        <div>Customer</div>
        <div>AI Intent</div>
        <div className="text-center">Score</div>
        <div className="text-center">Status</div>
        <div className="text-right">Activity</div>
      </div>

      {/* Conversation Rows */}
      <div className="divide-y divide-outline-variant/30">
        {contacts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
             <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
             <p className="text-sm text-on-surface-variant max-w-xs mx-auto">No conversations matching your filters. New messages will appear here.</p>
          </div>
        ) : (
          contacts.map((contact) => {
            const config = PLATFORM_CONFIG[contact.platform] || { icon: 'forum', className: 'text-slate-500', bg: 'bg-slate-50' }
            const intent = contact.latest_message?.intent ? (INTENT_CONFIG[contact.latest_message.intent] || { label: contact.latest_message.intent, className: 'bg-surface-container text-on-surface-variant border-outline-variant' }) : null
            
            return (
              <Link
                key={contact.id}
                href={`/inbox/${contact.id}`}
                className={`grid grid-cols-[48px_1fr_120px_100px_80px_100px] gap-4 px-6 py-4 items-center hover:bg-surface-container-low transition-colors cursor-pointer group ${contact.unread_count > 0 ? 'bg-surface-container-lowest' : 'bg-surface/50'}`}
              >
                <div className="flex justify-center">
                  <span 
                    className={`material-symbols-outlined ${config.className} ${config.bg} p-1.5 rounded-lg text-xl`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {config.icon}
                  </span>
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface truncate">{contact.name || contact.platform}</span>
                    {contact.unread_count > 0 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary-container/20"></div>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant truncate">
                    {contact.latest_message?.content || 'No messages yet...'}
                  </p>
                </div>

                <div>
                  {intent && (
                    <span className={`px-2 py-1 rounded ${intent.className} text-[10px] font-black uppercase tracking-tighter border`}>
                      {intent.label}
                    </span>
                  )}
                </div>

                <div className="flex justify-center">
                  <CircularScore score={contact.ai_score} />
                </div>

                <div className="flex justify-center">
                  <span className={`material-symbols-outlined transition-colors ${contact.unread_count > 0 ? 'text-primary' : 'text-on-surface-variant/30'}`}>
                    {contact.unread_count > 0 ? 'mark_chat_unread' : 'check_circle'}
                  </span>
                </div>

                <div className="text-right text-xs font-medium text-on-surface-variant">
                   {contact.latest_message?.sent_at ? formatDistanceToNow(new Date(contact.latest_message.sent_at), { addSuffix: true }).replace('about ', '') : ''}
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* Footer / Pagination */}
      <div className="bg-surface-container-low px-6 py-3 flex items-center justify-between">
        <p className="text-xs font-medium text-on-surface-variant">
          Showing {contacts.length > 0 ? (pagination.current - 1) * 25 + 1 : 0}-{(pagination.current - 1) * 25 + contacts.length} of {pagination.count} conversations
        </p>
        <div className="flex items-center gap-1">
          <button 
            className="p-1 rounded hover:bg-white text-on-surface-variant disabled:opacity-30 transition-colors"
            disabled={pagination.current === 1}
            onClick={() => fetchInbox(pagination.current - 1)}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <span className="px-3 py-1 bg-primary text-white rounded text-xs font-bold shadow-sm">
            {pagination.current}
          </span>
          
          <button 
            className="p-1 rounded hover:bg-white text-on-surface-variant disabled:opacity-30 transition-colors"
            disabled={contacts.length < 25 || pagination.current * 25 >= pagination.count}
            onClick={() => fetchInbox(pagination.current + 1)}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}
