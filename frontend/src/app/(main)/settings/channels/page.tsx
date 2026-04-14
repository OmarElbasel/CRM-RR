'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { PageHeader } from '@/components/ui/PageHeader'
import { ChannelSettingsCard, type Channel } from '@/components/inbox/ChannelSettingsCard'
import { isEnabled } from '@/lib/flags'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const ALL_PLATFORMS = ['INSTAGRAM', 'WHATSAPP', 'FACEBOOK'] as const
const TIKTOK_PLATFORM = 'TIKTOK' as const

export default function ChannelsPage() {
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const connected = searchParams.get('connected')

  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  const fetchChannels = async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/channels/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setChannels(await res.json())
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (connected) {
      setToast(`${connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully!`)
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [connected])

  const handleDisconnect = async (platform: string) => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/channels/disconnect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ platform }),
      })
      if (res.ok) {
        setToast('Channel disconnected.')
        setTimeout(() => setToast(null), 4000)
        fetchChannels()
      }
    } catch {
      // silently fail
    }
  }

  return (
    <>
      <PageHeader
        title="Channels"
        subtitle="Connect your social media accounts to receive messages in the unified inbox."
      />

      {toast && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          {toast}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ALL_PLATFORMS.map((platform) => {
            const channel = channels.find((c) => c.platform === platform)
            return (
              <ChannelSettingsCard
                key={platform}
                platform={platform}
                channel={channel}
                apiUrl={API_URL}
                onDisconnect={handleDisconnect}
              />
            )
          })}
          {isEnabled('TIKTOK_INBOX') && (() => {
            const channel = channels.find((c) => c.platform === TIKTOK_PLATFORM)
            return (
              <ChannelSettingsCard
                key={TIKTOK_PLATFORM}
                platform={TIKTOK_PLATFORM}
                channel={channel}
                apiUrl={API_URL}
                onDisconnect={handleDisconnect}
              />
            )
          })()}
        </div>
      )}
    </>
  )
}
