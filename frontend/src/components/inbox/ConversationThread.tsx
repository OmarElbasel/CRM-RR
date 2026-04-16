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
      <div className="text-center py-20 space-y-3">
        <span className="material-symbols-outlined text-4xl text-outline-variant">chat_bubble</span>
        <p className="text-sm text-on-surface-variant max-w-xs mx-auto">No messages in this conversation yet. Type a reply to get started.</p>
      </div>
    )
  }

  // Group by date logic (simple version for this demo)
  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const today = new Date()
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }

  return (
    <div className="flex flex-col gap-8">
      {channelDisconnected && (
        <div className="text-center py-2 px-4 bg-error-container/20 border border-error/20 rounded-lg text-[11px] font-bold text-error uppercase tracking-wider">
          Channel disconnected — historical messages are preserved
        </div>
      )}

      {/* Date Separator */}
      <div className="flex justify-center">
        <span className="px-4 py-1 bg-surface-container text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest">Today</span>
      </div>

      {messages.map((msg, idx) => {
        const isInbound = msg.direction === 'INBOUND'
        const time = msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
        
        return (
          <React.Fragment key={msg.id}>
            {/* AI Log entry if intent exists on inbound message */}
            {isInbound && msg.intent && (
              <div className="flex justify-center -my-2 opacity-0 animate-in fade-in slide-in-from-top-2 duration-700 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-container/30 border border-primary-fixed rounded-lg">
                  <span className="material-symbols-outlined text-primary text-[16px]">psychology</span>
                  <span className="text-[11px] font-medium text-primary">AI analyzed intent: <span className="font-bold">{msg.intent.replace(/_/g, ' ')}</span></span>
                </div>
              </div>
            )}

            <div className={`flex gap-4 items-start max-w-[85%] ${isInbound ? '' : 'ml-auto flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${isInbound ? 'bg-surface-container' : 'bg-primary'}`}>
                <span className={`material-symbols-outlined text-sm ${isInbound ? 'text-slate-500' : 'text-white'}`} style={!isInbound ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {isInbound ? 'person' : 'store'}
                </span>
              </div>
              
              <div className={`flex flex-col gap-1 ${isInbound ? 'items-start' : 'items-end'}`}>
                <div className={`p-4 shadow-sm border ${
                  isInbound 
                    ? 'bg-white border-outline-variant rounded-xl rounded-tl-none' 
                    : 'bg-primary border-primary text-white rounded-xl rounded-tr-none shadow-md'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.content_ar && (
                    <p className={`mt-2 text-xs italic opacity-80 ${isInbound ? 'text-on-surface-variant' : 'text-primary-container'}`} dir="rtl">
                      ({msg.content_ar})
                    </p>
                  )}
                </div>
                
                <span className={`text-[10px] text-on-surface-variant flex items-center gap-1 ${isInbound ? 'ml-1' : 'mr-1'}`}>
                  {time} • {isInbound ? 'WhatsApp' : 'Sent by AI Agent'}
                  {!isInbound && (
                    <span className="material-symbols-outlined text-[14px] text-blue-500">done_all</span>
                  )}
                </span>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
