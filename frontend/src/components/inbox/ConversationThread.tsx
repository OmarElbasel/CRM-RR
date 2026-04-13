'use client'

import { IntentBadge } from '@/components/ui/IntentBadge'

type Intent = 'READY_TO_BUY' | 'PRICE_INQUIRY' | 'INFO_REQUEST' | 'COMPLAINT' | 'BROWSING'

export interface ThreadMessage {
  id: number
  direction: 'INBOUND' | 'OUTBOUND'
  content: string
  content_ar: string
  intent: Intent | null
  ai_draft: string
  ai_draft_ar: string
  read: boolean
  sent_at: string | null
}

interface ConversationThreadProps {
  messages: ThreadMessage[]
  channelDisconnected?: boolean
}

export function ConversationThread({ messages, channelDisconnected }: ConversationThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No messages in this conversation yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      {channelDisconnected && (
        <div className="text-center py-2 px-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          Channel disconnected — historical messages are preserved but new messages will not be received.
        </div>
      )}
      {messages.map((msg) => {
        const isInbound = msg.direction === 'INBOUND'
        return (
          <div
            key={msg.id}
            className={`flex ${isInbound ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                isInbound
                  ? 'bg-gray-100 text-gray-900 rounded-bl-md'
                  : 'bg-indigo-600 text-white rounded-br-md'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.content_ar && (
                <p className="text-sm whitespace-pre-wrap mt-1 opacity-80" dir="rtl">
                  {msg.content_ar}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {msg.intent && <IntentBadge intent={msg.intent} />}
                {msg.sent_at && (
                  <span className={`text-[10px] ${isInbound ? 'text-gray-400' : 'text-indigo-200'}`}>
                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
