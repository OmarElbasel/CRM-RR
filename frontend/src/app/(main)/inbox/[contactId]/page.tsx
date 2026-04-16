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
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Thread Header */}
        <header className="flex justify-between items-center px-6 h-16 bg-white border-b border-outline-variant shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/inbox')}
              className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  alt={contact?.name} 
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZcqh2pHEfMqH-Up-E1YvQEYZI7sUCXAVysr4ErqntObbj6-6xZnIIHMaAsZ-pOANMEOFAG1BG6ZVx_JUl_M2DetKMzLVdSzeyufYyXXNe2yNaDZCe8DlUpXTHmnFmg2mq7saokTkghV_WhC0nXNFYxP1sdGxIt_xJkK79sIQCABENNkiCzr-iaIUZlTLP8mCvO5MzpC3zolF_7KP1EoNQPgZ26Q-pZ6uqqPH_oKXG0fDUegcPpkNLD4b8-7RCqDf1WJ8Lwuyb4nNO"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-md font-bold text-on-surface leading-tight">{contact?.name || 'Loading...'}</h2>
                  {contact && contact.ai_score > 70 && (
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold tracking-tight">READY_TO_BUY</span>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[14px]">smartphone</span> 
                  via {contact?.platform} Business
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-primary-container/20 px-3 py-1.5 rounded-lg mr-2">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="text-[11px] font-bold text-primary">AI Copilot Active</span>
            </div>
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-on-surface-variant/70">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 hover:bg-surface-container-low rounded-lg transition-colors text-on-surface-variant/70">
              <span className="material-symbols-outlined">help</span>
            </button>
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
