'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface BroadcastFormProps {
  onSuccess: () => void
}

export function BroadcastForm({ onSuccess }: BroadcastFormProps) {
  const { getToken } = useAuth()
  const [templateName, setTemplateName] = useState('')
  const [messageAr, setMessageAr] = useState('')
  const [messageEn, setMessageEn] = useState('')
  const [recipientsRaw, setRecipientsRaw] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!templateName.trim() || !recipientsRaw.trim()) {
      setError('Name and recipients are required')
      return
    }

    const recipients = recipientsRaw
      .split(/[\n,]+/)
      .map((r) => r.trim())
      .filter(Boolean)

    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const body: Record<string, string | string[] | null> = {
        template_name: templateName,
        message_ar: messageAr,
        message_en: messageEn,
        recipients,
        scheduled_at: scheduledAt || null,
      }

      const res = await fetch(`${API_URL}/api/scheduler/broadcasts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || err.error || JSON.stringify(err))
      }
      const data = await res.json()
      const count = data.recipient_count || recipients.length
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Campaign Name</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="e.g. Ramadan Promo"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Arabic Message</label>
        <Textarea
          value={messageAr}
          onChange={(e) => setMessageAr(e.target.value)}
          dir="rtl"
          rows={3}
          placeholder="اكتب الرسالة بالعربية..."
        />
      </div>
      <div>
        <label className="text-sm font-medium">English Message</label>
        <Textarea
          value={messageEn}
          onChange={(e) => setMessageEn(e.target.value)}
          rows={3}
          placeholder="Write the message in English..."
        />
      </div>
      <div>
        <label className="text-sm font-medium">Recipients</label>
        <Textarea
          value={recipientsRaw}
          onChange={(e) => setRecipientsRaw(e.target.value)}
          rows={4}
          placeholder="+97412345678&#10;+966123456789&#10;+971123456789"
        />
        <p className="text-xs text-muted-foreground mt-1">One E.164 phone per line</p>
      </div>
      <div>
        <label className="text-sm font-medium">Schedule (optional)</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">Leave empty to send immediately</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Send Broadcast
      </Button>
    </form>
  )
}
