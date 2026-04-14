'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ContentLanguageToggle } from './ContentLanguageToggle'
import { Loader2, Copy } from 'lucide-react'
import posthog from 'posthog-js'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TONE_OPTIONS = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'EXCITING', label: 'Exciting' },
  { value: 'INFORMATIVE', label: 'Informative' },
]

export function CaptionGenerator() {
  const { getToken } = useAuth()
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const [productDescription, setProductDescription] = useState('')
  const [tone, setTone] = useState('CASUAL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    caption_ar: string; caption_en: string;
    hashtags_ar: string[]; hashtags_en: string[];
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/content/caption/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_description: productDescription, tone }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || err.error || 'Generation failed')
      }
      setResult(await res.json())
      posthog.capture('content_generated', { language: lang })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Product Description</label>
          <Textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Describe your product..."
          />
          <p className="text-xs text-muted-foreground mt-1">{productDescription.length}/500</p>
        </div>
        <div>
          <label className="text-sm font-medium">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            {TONE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <Button type="submit" disabled={loading || !productDescription.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Caption
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4">
          <ContentLanguageToggle value={lang} onChange={setLang} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className={lang !== 'ar' ? 'hidden md:block' : ''}>
              <div dir="rtl" className="text-right rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{result.caption_ar}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {result.hashtags_ar.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(result.caption_ar + '\n' + result.hashtags_ar.join(' '))}
              >
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
            <div className={lang !== 'en' ? 'hidden md:block' : ''}>
              <div className="rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{result.caption_en}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {result.hashtags_en.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => copyToClipboard(result.caption_en + '\n' + result.hashtags_en.join(' '))}
              >
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
