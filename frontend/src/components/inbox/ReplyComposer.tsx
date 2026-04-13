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
  const [content, setContent] = useState(aiDraft || '')
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'ar' : 'en'
    setLang(newLang)
    if (newLang === 'ar' && aiDraftAr) {
      setContent(aiDraftAr)
    } else if (newLang === 'en' && aiDraft) {
      setContent(aiDraft)
    }
  }

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
    <div className="border-t border-gray-200 bg-white p-4">
      {error && (
        <div className="mb-2 text-xs text-red-600">{error}</div>
      )}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === 'ar' ? 'اكتب ردك...' : 'Type your reply...'}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
            disabled={disabled || sending}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:opacity-50 disabled:bg-gray-50"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          {(aiDraft || aiDraftAr) && (
            <button
              onClick={toggleLang}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Languages className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!content.trim() || disabled || sending}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
