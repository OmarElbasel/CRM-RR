'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ContentLanguageToggle } from './ContentLanguageToggle'
import { Loader2, Copy } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TONE_OPTIONS = [
  { value: 'CASUAL', label: 'Casual' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'EXCITING', label: 'Exciting' },
  { value: 'INFORMATIVE', label: 'Informative' },
]

const PLATFORM_OPTIONS = [
  { value: 'META', label: 'Meta (Facebook/Instagram)' },
  { value: 'TIKTOK', label: 'TikTok' },
]

export function AdCopyWriter() {
  const { getToken } = useAuth()
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const [productDescription, setProductDescription] = useState('')
  const [tone, setTone] = useState('CASUAL')
  const [platform, setPlatform] = useState('META')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    headline_ar: string; headline_en: string;
    body_ar: string; body_en: string;
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/content/ad-copy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_description: productDescription, tone, platform }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || err.error || 'Generation failed')
      }
      setResult(await res.json())
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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <Button type="submit" disabled={loading || !productDescription.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Ad Copy
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4">
          <ContentLanguageToggle value={lang} onChange={setLang} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className={lang !== 'ar' ? 'hidden md:block' : ''}>
              <div dir="rtl" className="text-right rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <h4 className="font-semibold text-lg mb-2">{result.headline_ar}</h4>
                <p className="whitespace-pre-wrap">{result.body_ar}</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => copyToClipboard(result.headline_ar + '\n' + result.body_ar)}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
            <div className={lang !== 'en' ? 'hidden md:block' : ''}>
              <div className="rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <h4 className="font-semibold text-lg mb-2">{result.headline_en}</h4>
                <p className="whitespace-pre-wrap">{result.body_en}</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => copyToClipboard(result.headline_en + '\n' + result.body_en)}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
