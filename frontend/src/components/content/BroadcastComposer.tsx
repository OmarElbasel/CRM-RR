'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ContentLanguageToggle } from './ContentLanguageToggle'
import { SeasonalTemplateGallery } from './SeasonalTemplateGallery'
import { Loader2, Copy, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CAMPAIGN_OPTIONS = [
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'SEASONAL', label: 'Seasonal' },
  { value: 'RESTOCK', label: 'Restock' },
]

export function BroadcastComposer() {
  const { getToken } = useAuth()
  const [lang, setLang] = useState<'ar' | 'en'>('ar')
  const [campaignType, setCampaignType] = useState('PROMOTION')
  const [audienceDescription, setAudienceDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    message_ar: string; message_en: string;
  } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/content/whatsapp-broadcast/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ campaign_type: campaignType, audience_description: audienceDescription }),
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

  const handleTemplateSelect = (template: { body_ar: string; body_en: string }) => {
    setAudienceDescription(lang === 'ar' ? template.body_ar : template.body_en)
    setDialogOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Campaign Type</label>
            <select value={campaignType} onChange={(e) => setCampaignType(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
              {CAMPAIGN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" /> Load Seasonal Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Seasonal Templates</DialogTitle></DialogHeader>
                <SeasonalTemplateGallery onSelect={handleTemplateSelect} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Audience Description</label>
          <Textarea
            value={audienceDescription}
            onChange={(e) => setAudienceDescription(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Describe your target audience..."
          />
          <p className="text-xs text-muted-foreground mt-1">{audienceDescription.length}/300</p>
        </div>
        <Button type="submit" disabled={loading || !audienceDescription.trim()}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Broadcast
        </Button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4">
          <ContentLanguageToggle value={lang} onChange={setLang} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className={lang !== 'ar' ? 'hidden md:block' : ''}>
              <div dir="rtl" className="text-right rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{result.message_ar}</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => copyToClipboard(result.message_ar)}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
            <div className={lang !== 'en' ? 'hidden md:block' : ''}>
              <div className="rounded-lg border p-4 bg-gray-50 min-h-[100px]">
                <p className="whitespace-pre-wrap">{result.message_en}</p>
              </div>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => copyToClipboard(result.message_en)}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
