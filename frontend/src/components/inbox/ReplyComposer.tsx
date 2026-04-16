'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Send, Languages } from 'lucide-react'
import type { ThreadMessage } from './ConversationThread'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ReplyComposerProps {
  messageId: number
  aiDraft?: string
  aiDraftAr?: string
  disabled?: boolean
  onReplySent?: (msg: ThreadMessage) => void
}

export function ReplyComposer({ messageId, aiDraft, aiDraftAr, disabled, onReplySent }: ReplyComposerProps) {
  const { getToken } = useAuth()
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!content.trim() || sending) return
    setSending(true)
    setError(null)

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/inbox/messages/${messageId}/reply/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (res.ok) {
        const data = await res.json()
        setContent('')
        onReplySent?.(data)
      } else {
        const err = await res.json().catch(() => null)
        setError(err?.error || 'Failed to send reply')
      }
    } catch {
      setError('Network error')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="bg-white border-t border-outline-variant p-6 z-40">
      <div className="max-w-4xl mx-auto">
        {/* Suggestions Header */}
        {(aiDraft || aiDraftAr) && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">magic_button</span>
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">AI Suggested Replies</h3>
            </div>
            <button className="text-[10px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 uppercase font-bold">
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Regenerate
            </button>
          </div>
        )}

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {aiDraftAr && (
            <button 
              onClick={() => setContent(aiDraftAr)}
              className="text-left p-4 border border-primary-fixed-dim bg-primary-container/10 rounded-xl hover:bg-primary-container/20 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-primary/20 text-primary text-[10px] font-bold rounded flex items-center justify-center">AR</span>
                  <span className="text-[10px] font-bold text-on-primary-container/60">Professional / Direct</span>
                </div>
                <p className="text-xs font-medium text-on-primary-container leading-relaxed" dir="rtl">{aiDraftAr}</p>
              </div>
              <div className="mt-3 flex items-center justify-end text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold mr-1">Insert</span>
                <span className="material-symbols-outlined text-sm">keyboard_return</span>
              </div>
            </button>
          )}

          {aiDraft && (
            <button 
              onClick={() => setContent(aiDraft)}
              className="text-left p-4 border border-tertiary-container/40 bg-tertiary-container/5 rounded-xl hover:bg-tertiary-container/15 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 bg-tertiary/20 text-tertiary text-[10px] font-bold rounded flex items-center justify-center">EN</span>
                  <span className="text-[10px] font-bold text-on-tertiary-container/60">Sales Conversion</span>
                </div>
                <p className="text-xs font-medium text-on-tertiary-container leading-relaxed">{aiDraft}</p>
              </div>
              <div className="mt-3 flex items-center justify-end text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold mr-1">Insert</span>
                <span className="material-symbols-outlined text-sm">keyboard_return</span>
              </div>
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="relative">
          {error && <p className="absolute -top-6 left-0 text-[10px] text-error font-bold">{error}</p>}
          <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-2xl p-2 pl-4 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={disabled || sending}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-outline" 
              placeholder="Type a bilingual reply..." 
              type="text"
            />
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <div className="w-px h-6 bg-outline-variant/30 mx-1"></div>
            <button 
              onClick={handleSend}
              disabled={!content.trim() || sending}
              className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary-dim transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
