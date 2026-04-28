'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { OrgSettings } from '@/components/settings/OrgSettings'
import { BillingSettings } from '@/components/settings/BillingSettings'
import { AccountSettings } from '@/components/settings/AccountSettings'

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'billing', label: 'Billing' },
  { id: 'api-keys', label: 'API Keys' },
  { id: 'embed', label: 'Embed' },
  { id: 'channels', label: 'Channels' },
  { id: 'team', label: 'Team' },
  { id: 'notifications', label: 'Notifications' },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'general')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && TABS.find((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ds-text font-headline">Settings</h1>
        <p className="text-ds-text-2 text-sm">Manage your workspace preferences and integrations.</p>
      </div>

      <div className="border-b border-ds-line">
        <nav className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              href={`/settings?tab=${tab.id}`}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-ds-primary text-ds-primary'
                  : 'border-transparent text-ds-text-2 hover:text-ds-text'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="py-2">
        {activeTab === 'general' && <OrgSettings />}
        {activeTab === 'billing' && <BillingSettings />}
        {activeTab === 'api-keys' && (
          <div className="text-ds-text-2 text-sm">API Keys settings coming soon.</div>
        )}
        {activeTab === 'embed' && (
          <div className="text-ds-text-2 text-sm">Embed settings coming soon.</div>
        )}
        {activeTab === 'channels' && (
          <div className="text-ds-text-2 text-sm">Channel settings coming soon.</div>
        )}
        {activeTab === 'team' && (
          <div className="text-ds-text-2 text-sm">Team settings coming soon.</div>
        )}
        {activeTab === 'notifications' && (
          <div className="text-ds-text-2 text-sm">Notification settings coming soon.</div>
        )}
      </div>
    </div>
  )
}
