'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { InboxList, InboxStats } from '@/components/inbox'
import { isEnabled } from '@/lib/flags'
import posthog from 'posthog-js'

export default function InboxPage() {
  const [filters, setFilters] = useState<{
    platform?: string
    intent?: string
    unread?: boolean
  }>({})

  useEffect(() => {
    posthog.capture('inbox_opened')
  }, [])

  if (!isEnabled('INBOX')) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface font-headline">Inbox</h2>
        <p className="text-on-surface-variant text-sm">All customer conversations across connected channels.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider px-1">Platform</label>
            <select 
              className="bg-surface text-sm border-outline-variant rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary focus:border-primary"
              value={filters.platform || ''}
              onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value || undefined }))}
            >
              <option value="">All Platforms</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="TELEGRAM">Telegram</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider px-1">AI Intent</label>
            <select 
              className="bg-surface text-sm border-outline-variant rounded-lg py-1.5 pl-3 pr-8 focus:ring-primary focus:border-primary"
              value={filters.intent || ''}
              onChange={(e) => setFilters((f) => ({ ...f, intent: e.target.value || undefined }))}
            >
              <option value="">All Intents</option>
              <option value="READY_TO_BUY">Ready to Buy</option>
              <option value="PRICE_INQUIRY">Price Inquiry</option>
              <option value="CUSTOMER_SUPPORT">Customer Support</option>
              <option value="SPAM">Spam/Irrelevant</option>
            </select>
          </div>
          <div className="h-10 w-px bg-outline-variant/30 self-end mx-2"></div>
          <label className="flex items-center gap-2 cursor-pointer self-end pb-1.5 group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-primary focus:ring-primary-container border-outline-variant cursor-pointer"
              checked={filters.unread || false}
              onChange={(e) => setFilters((f) => ({ ...f, unread: e.target.checked || undefined }))}
            />
            <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Unread only</span>
          </label>
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors">
            <span className="material-symbols-outlined text-lg">refresh</span>
            Sync
          </button>
          <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary-dim transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">add_comment</span>
            New Chat
          </button>
        </div>
      </div>

      <InboxList filters={filters} />
      
      <InboxStats />
    </div>
  )
}
