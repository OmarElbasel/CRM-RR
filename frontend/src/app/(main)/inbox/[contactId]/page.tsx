'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ArrowLeft, MessageSquare, Camera, MessagesSquare } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { ConversationThread, type ThreadMessage } from '@/components/inbox/ConversationThread'
import { ReplyComposer } from '@/components/inbox/ReplyComposer'
import { useInboxStream } from '@/hooks/useInboxStream'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const PLATFORM_ICON: Record<string, React.ElementType> = {
  INSTAGRAM: Camera,
  WHATSAPP: MessageSquare,
  FACEBOOK: MessagesSquare,
}

interface ContactInfo {
  id: number
  name: string
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

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded" />
        <div className="h-96 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push('/inbox')} className="p-1.5 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {contact?.name || 'Unknown'}
          </h2>
          <p className="text-xs text-gray-500">
            {contact?.platform} · Score: {contact?.ai_score}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <ConversationThread messages={messages} />
      </div>

      {lastInboundMsg && (
        <ReplyComposer
          messageId={lastInboundMsg.id}
          aiDraft={lastInboundMsg.ai_draft}
          aiDraftAr={lastInboundMsg.ai_draft_ar}
          onReplySent={handleReplySent}
        />
      )}
    </div>
  )
}
