'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { ChannelCard, type ChannelProps } from '@/components/channels/ChannelCard'
import { ShopifyConnectModal } from '@/components/channels/ShopifyConnectModal'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const INITIAL_CHANNELS: ChannelProps[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    platform: 'INSTAGRAM',
    description: 'Manage your posts and story interactions directly.',
    icon: 'camera_alt',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    status: 'disconnected',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    platform: 'WHATSAPP',
    description: 'Automate customer support and direct messaging.',
    icon: 'chat',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    status: 'disconnected',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    platform: 'FACEBOOK',
    description: 'Connect your business pages and community groups.',
    icon: 'groups',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    status: 'disconnected',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    platform: 'TIKTOK',
    description: 'Sync your short-form video content and analytics.',
    icon: 'music_note',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
    color: 'text-slate-900',
    bg: 'bg-slate-100',
    status: 'disconnected',
  },
  {
    id: 'shopify',
    name: 'Shopify Store',
    platform: 'SHOPIFY',
    description: 'Sync orders, customers, and inventory in real-time.',
    icon: 'shopping_cart',
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ58f__Hs5QwGWIEcsawDwW1o5IQzaYNPONhQ&s',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    status: 'disconnected',
  },
]

export default function ChannelsPage() {
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const [channels, setChannels] = useState<ChannelProps[]>(INITIAL_CHANNELS)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [shopifyModalOpen, setShopifyModalOpen] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const fetchStatuses = async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const connectedData = await res.json()
        const updated = INITIAL_CHANNELS.map((ch) => {
          const apiChannel = connectedData.find((c: any) => c.platform === ch.platform)
          if (apiChannel && apiChannel.is_active) {
            let syncInfo = 'Synced 5 mins ago'
            if (ch.platform === 'SHOPIFY' && apiChannel.page_id) {
              syncInfo = `Active • Connected @ ${apiChannel.page_id}`
            }
            return { ...ch, status: 'connected' as const, syncInfo }
          }
          return ch
        })
        setChannels(updated)
      }
    } catch (err) {
      console.error('Failed to fetch channel statuses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [])

  useEffect(() => {
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')
    const platform = searchParams.get('platform')
    if (connected) {
      const label = connected.charAt(0).toUpperCase() + connected.slice(1)
      showToast(`${label} connected successfully!`, 'success')
      fetchStatuses()
    } else if (error) {
      const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Channel'
      showToast(`Failed to connect ${label}. Please check your app credentials and try again.`, 'error')
    }
  }, [searchParams])

  const handleConnect = async (id: string) => {
    if (id === 'shopify') {
      setShopifyModalOpen(true)
      return
    }

    const slugMap: Record<string, string> = {
      instagram: 'instagram',
      facebook: 'facebook',
      whatsapp: 'whatsapp',
      tiktok: 'tiktok',
    }
    const slug = slugMap[id]
    if (!slug) return

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/channels/connect/${slug}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        window.location.href = data.url
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err.error || err.detail || 'Failed to initiate connection. Check app credentials.', 'error')
      }
    } catch {
      showToast('Failed to initiate connection. Please try again.', 'error')
    }
  }

  const handleShopifySubmit = async (payload: Record<string, string>) => {
    const token = await getToken()

    if (payload.method === 'oauth') {
      const res = await fetch(`${API_URL}/api/shopify/install/?shop=${payload.shop}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || err.error || 'Failed to initiate Shopify OAuth.')
      }
      const data = await res.json()
      window.location.href = data.url
      return
    }

    const body: Record<string, string> = { shop: payload.shop }
    if (payload.method === 'client_credentials') {
      body.client_id = payload.client_id
      body.client_secret = payload.client_secret
    } else {
      body.access_token = payload.access_token
    }

    const res = await fetch(`${API_URL}/api/shopify/connect-direct/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || err.error || 'Failed to connect Shopify.')
    }

    const label = payload.method === 'client_credentials' ? 'Shopify connected! Token auto-refreshes every 24h.' : 'Shopify connected successfully!'
    showToast(label, 'success')
    fetchStatuses()
  }

  const handleDisconnect = async (id: string) => {
    const channel = channels.find(c => c.id === id)
    if (!channel) return

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/channels/disconnect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform: channel.platform }),
      })
      if (res.ok) {
        showToast(`${channel.name} disconnected.`, 'success')
        fetchStatuses()
      } else {
        const err = await res.json().catch(() => ({}))
        showToast(err.error || err.detail || 'Failed to disconnect channel.', 'error')
      }
    } catch {
      showToast('Failed to disconnect channel. Please try again.', 'error')
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-background">
      <ShopifyConnectModal
        open={shopifyModalOpen}
        onOpenChange={setShopifyModalOpen}
        onSubmit={handleShopifySubmit}
      />
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 max-w-sm rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {toast.message}
        </div>
      )}
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 h-16 flex items-center justify-between font-headline">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black text-indigo-700 uppercase tracking-tight">Rawaj AI</h2>
          <div className="relative ml-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-sm">search</span>
            </span>
            <input 
              className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all" 
              placeholder="Search channels..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-indigo-600 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button className="hover:text-indigo-600 transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-headline font-black text-slate-900 tracking-tight">Channels</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            Connect and manage your social media integrations to streamline your workflow and AI growth engine.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <ChannelCard 
              key={channel.id} 
              channel={channel} 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>

        {/* Statistics & Security Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-headline font-black text-lg text-slate-900">Connection Statistics</h3>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:underline">
                  View Full Report
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
              <div className="p-10 grid grid-cols-3 gap-8 text-center items-center">
                <div className="space-y-1">
                  <div className="text-4xl font-headline font-black text-indigo-600 tracking-tight">99.9%</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Uptime</div>
                </div>
                <div className="h-12 w-px bg-slate-100 mx-auto"></div>
                <div className="space-y-1">
                  <div className="text-4xl font-headline font-black text-emerald-600 tracking-tight">12.4k</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Messages Synced</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-8 flex flex-col justify-center text-center relative overflow-hidden shadow-xl shadow-indigo-100">
            {/* Background Decorative Circles */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">lock</span>
              </div>
              <h4 className="font-headline font-black text-white text-xl mb-3">Secure Connections</h4>
              <p className="text-indigo-100/80 text-sm mb-6 leading-relaxed">
                Your data is encrypted using enterprise-grade security protocols during all channel transmissions.
              </p>
              <a className="text-white font-bold text-sm underline underline-offset-8 hover:text-indigo-200 transition-colors" href="#">
                Learn about our security
              </a>
            </div>
          </div>
        </div>

        {/* Custom Integration Callout */}
        <div className="relative rounded-3xl bg-slate-900 p-8 lg:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-headline font-black text-white mb-4 italic">Need a custom integration?</h2>
            <p className="text-slate-400 text-lg mb-8">
              Our SDK allows you to connect any platform to the Rawaj ecosystem. Check out our developer documentation or request a new channel.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/40 active:scale-95">
                <span className="material-symbols-outlined text-sm">description</span>
                API Docs
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-xl font-bold transition-all active:scale-95">
                Request Integration
              </button>
            </div>
          </div>
          {/* Background Highlight */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
          <div className="absolute right-12 bottom-0 w-64 h-64 bg-indigo-600/20 blur-[100px] pointer-events-none"></div>
        </div>
      </main>
    </div>
  )
}
