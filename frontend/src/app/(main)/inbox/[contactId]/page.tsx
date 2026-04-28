'use client'

import { useEffect, useState, useCallback } from 'react'
import Avatar from '@/components/inbox/Avatar'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ConversationThread, type ThreadMessage } from '@/components/inbox/ConversationThread'
import { ReplyComposer } from '@/components/inbox/ReplyComposer'
import { ContactSidebar } from '@/components/inbox/ContactSidebar'
import { useInboxStream } from '@/hooks/useInboxStream'
import { MessageSquare, MessageCircle, Music2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const PLATFORM_LOGO: Record<string, string> = {
  INSTAGRAM: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
  WHATSAPP: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
  FACEBOOK: 'https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg',
  TIKTOK: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg',
}

const Instagram = ({ className }: { className?: string }) => (
  <img src={PLATFORM_LOGO.INSTAGRAM} className={className} alt="Instagram" />
)

const Facebook = ({ className }: { className?: string }) => (
  <img src={PLATFORM_LOGO.FACEBOOK} className={className} alt="Facebook" />
)

const PLATFORM_ICON: Record<string, any> = {
  INSTAGRAM: Instagram,
  WHATSAPP: MessageCircle,
  FACEBOOK: Facebook,
  TIKTOK: Music2,
}

interface ContactInfo {
  id: number
  name: string
  avatar_url?: string
  platform: string
  ai_score: number
}

export default function ThreadPage() {
  const { contactId } = useParams<{ contactId: string }>()
  const { getToken } = useAuth()
  const router = useRouter()

  const [contact, setContact] = useState<ContactInfo | null>(null)
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchThread = useCallback(async () => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/inbox/${contactId}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setContact(data.contact)
        setMessages(data.messages)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [contactId, getToken])

  useEffect(() => {
    fetchThread()
  }, [fetchThread])

  useInboxStream({
    onNewMessage: (data) => {
      const msgContactId = (data as { contact_id?: number }).contact_id
      if (msgContactId?.toString() === contactId) {
        fetchThread()
      }
    },
    onMessageUpdated: (data) => {
      const msgContactId = (data as { contact_id?: number }).contact_id
      if (msgContactId?.toString() === contactId) {
        fetchThread()
      }
    },
  })

  const handleReplySent = (newMsg: ThreadMessage) => {
    setMessages((prev) => [...prev, newMsg])
  }

  const lastInboundMsg = [...messages].reverse().find((m) => m.direction === 'INBOUND')
  const Icon = contact ? PLATFORM_ICON[contact.platform] || MessageSquare : MessageSquare

  const displayName = contact?.name?.trim() || `User ${contact?.id ?? ''}`.trim()

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-6">
        <div className="h-8 w-48 bg-gray-100 rounded" />
        <div className="h-96 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thread Header */}
        <header className="flex justify-between items-center px-6 h-16 bg-white border-b border-outline-variant shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/inbox')}
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
              aria-label="Back to inbox"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <Avatar name={displayName} src={contact?.avatar_url} size={40} />
              <div>
                <h2 className="text-md font-bold text-on-surface leading-tight">{displayName}</h2>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium">
                  <Icon className="w-3 h-3" />
                  {contact?.platform}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FDFDFF]">
          <div className="max-w-4xl mx-auto">
            <ConversationThread messages={messages} />
          </div>
        </div>

        {/* Reply Area */}
        <div className="shrink-0 z-10">
          {lastInboundMsg && (
            <ReplyComposer
              messageId={lastInboundMsg.id}
              aiDraft={lastInboundMsg.ai_draft}
              aiDraftAr={lastInboundMsg.ai_draft_ar}
              onReplySent={handleReplySent}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <ContactSidebar contact={contact} />
    </div>
  )
}
