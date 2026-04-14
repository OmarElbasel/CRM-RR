'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface PostFormProps {
  onSuccess: () => void
  initialValues?: {
    id?: number
    platform?: string
    content?: string
    media_url?: string
    scheduled_at?: string
  }
}

export function PostForm({ onSuccess, initialValues }: PostFormProps) {
  const { getToken } = useAuth()
  const [platform, setPlatform] = useState(initialValues?.platform || 'INSTAGRAM')
  const [content, setContent] = useState(initialValues?.content || '')
  const [mediaUrl, setMediaUrl] = useState(initialValues?.media_url || '')
  const [scheduledAt, setScheduledAt] = useState(initialValues?.scheduled_at || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!initialValues?.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt)
      if (scheduledDate <= new Date()) {
        setError('Scheduled time must be in the future')
        return
      }
    }

    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const url = isEditing
        ? `${API_URL}/api/scheduler/posts/${initialValues!.id}/`
        : `${API_URL}/api/scheduler/posts/`
      const method = isEditing ? 'PATCH' : 'POST'

      const body: Record<string, string> = { platform, content }
      if (mediaUrl) body.media_url = mediaUrl
      if (scheduledAt) body.scheduled_at = scheduledAt

      const res = await fetch(url, {
        method,
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
        <label className="text-sm font-medium">Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Write your post content..."
        />
      </div>
      <div>
        <label className="text-sm font-medium">Media URL (optional)</label>
        <input
          type="url"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </div>
      <div>
        <label className="text-sm font-medium">Schedule Date & Time</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'Update Post' : 'Schedule Post'}
      </Button>
    </form>
  )
}
