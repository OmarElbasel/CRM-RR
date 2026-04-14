'use client'

import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { InboxList } from '@/components/inbox/InboxList'
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
    <>
      <PageHeader
        title="Inbox"
        subtitle="All customer conversations across connected channels."
      />

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white"
          value={filters.platform || ''}
          onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value || undefined }))}
        >
          <option value="">All Platforms</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="FACEBOOK">Facebook</option>
        </select>
        <select
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white"
          value={filters.intent || ''}
          onChange={(e) => setFilters((f) => ({ ...f, intent: e.target.value || undefined }))}
        >
          <option value="">All Intents</option>
          <option value="READY_TO_BUY">Ready to Buy</option>
          <option value="PRICE_INQUIRY">Price Inquiry</option>
          <option value="INFO_REQUEST">Info Request</option>
          <option value="COMPLAINT">Complaint</option>
          <option value="BROWSING">Browsing</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300"
            checked={filters.unread || false}
            onChange={(e) => setFilters((f) => ({ ...f, unread: e.target.checked || undefined }))}
          />
          Unread only
        </label>
      </div>

      <InboxList filters={filters} />
    </>
  )
}
