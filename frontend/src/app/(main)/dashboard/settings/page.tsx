'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams, useRouter } from 'next/navigation'
import { OrgSettings } from '@/components/settings/OrgSettings'
import { BillingSettings } from '@/components/settings/BillingSettings'
import { AccountSettings } from '@/components/settings/AccountSettings'
import { Loader2 } from 'lucide-react'

interface UsageData {
  plan: string
  generations_used: number
  generations_limit: number | null
  tokens_in: number
  tokens_out: number
  reset_date: string
}

export default function SettingsPage() {
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'general'

  const [loading, setLoading] = useState(true)
  const [orgName, setOrgName] = useState('')
  const [usage, setUsage] = useState<UsageData | null>(null)

  const fetchSettingsData = async () => {
    try {
      const token = await getToken()
      
      // Fetch Org Name
      const orgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (orgRes.ok) {
        const orgData = await orgRes.json()
        setOrgName(orgData.name)
      }

      // Fetch Usage & Plan
      const usageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/usage/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (usageRes.ok) {
        const usageData = await usageRes.json()
        setUsage(usageData)
      }
    } catch (err) {
      console.error('Failed to fetch settings data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettingsData()
  }, [])

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.replace(`?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-background">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 h-16 flex items-center justify-between font-headline">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black text-indigo-700 uppercase tracking-tight">Settings Hub</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-indigo-600 transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="hover:text-indigo-600 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Hub Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => handleTabChange('general')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'general' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            General
          </button>
          <button 
            onClick={() => handleTabChange('billing')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'billing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Plan & Billing
          </button>
          <button 
            onClick={() => handleTabChange('account')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'account' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Account
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {activeTab === 'general' && (
            <OrgSettings initialName={orgName} onUpdate={(name) => setOrgName(name)} />
          )}
          {activeTab === 'billing' && (
            <BillingSettings usage={usage} />
          )}
          {activeTab === 'account' && (
            <AccountSettings />
          )}
        </div>
      </main>
    </div>
  )
}
