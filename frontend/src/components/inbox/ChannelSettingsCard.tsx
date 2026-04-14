'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Camera, MessagesSquare, Music2 } from 'lucide-react'

export interface Channel {
  id: number
  platform: 'INSTAGRAM' | 'WHATSAPP' | 'FACEBOOK' | 'TIKTOK'
  is_active: boolean
  connected_at: string | null
  token_expires_at: string | null
  page_id: string | null
  phone_number_id: string | null
}

interface ChannelSettingsCardProps {
  platform: 'INSTAGRAM' | 'WHATSAPP' | 'FACEBOOK' | 'TIKTOK'
  channel?: Channel
  apiUrl: string
  onDisconnect?: (platform: string) => void
}

const PLATFORM_CONFIG: Record<string, { label: string; icon: React.ElementType; connectSlug: string }> = {
  INSTAGRAM: { label: 'Instagram', icon: Camera, connectSlug: 'instagram' },
  WHATSAPP: { label: 'WhatsApp Business', icon: MessageSquare, connectSlug: 'whatsapp' },
  FACEBOOK: { label: 'Facebook Messenger', icon: MessagesSquare, connectSlug: 'facebook' },
  TIKTOK: { label: 'TikTok', icon: Music2, connectSlug: 'tiktok' },
}

export function ChannelSettingsCard({ platform, channel, apiUrl, onDisconnect }: ChannelSettingsCardProps) {
  const config = PLATFORM_CONFIG[platform]
  const Icon = config.icon
  const isConnected = channel?.is_active ?? false

  const handleConnect = () => {
    window.location.href = `${apiUrl}/api/channels/connect/${config.connectSlug}/`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <CardTitle>{config.label}</CardTitle>
              {isConnected && channel?.connected_at && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Connected {new Date(channel.connected_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <Badge
            variant={isConnected ? 'default' : 'outline'}
            className={isConnected ? 'bg-green-50 text-green-700 border-green-200' : ''}
          >
            {isConnected ? 'Connected' : 'Not connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              {channel?.page_id && (
                <p className="text-xs text-muted-foreground flex-1">
                  Page ID: {channel.page_id}
                </p>
              )}
              {channel?.phone_number_id && (
                <p className="text-xs text-muted-foreground flex-1">
                  Phone: {channel.phone_number_id}
                </p>
              )}
              {onDisconnect && (
                <button
                  onClick={() => onDisconnect(platform)}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Disconnect
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleConnect}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Connect {config.label}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
