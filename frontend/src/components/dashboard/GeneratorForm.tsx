'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check, RefreshCw, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type FormStep = 'input' | 'generating' | 'result'

interface GenerateResult {
  title: string
  short_description: string
  long_description: string
  keywords: string[]
  seo_meta: string
  session_id: string
  tokens_in?: number
  tokens_out?: number
  cost_usd?: number
}

export function GeneratorForm() {
  const { getToken } = useAuth()
  const [step, setStep] = useState<FormStep>('input')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limitExceeded, setLimitExceeded] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [streamedText, setStreamedText] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  // Form state
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('fashion')
  const [price, setPrice] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [tone, setTone] = useState('professional')
  const [language, setLanguage] = useState('ar')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLimitExceeded(false)
    setStreamedText('')
    setResult(null)
    setStep('generating')
    setLoading(true)

    try {
      const token = await getToken()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate/product-content/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          category,
          price: price || undefined,
          target_audience: targetAudience || undefined,
          tone,
          language,
        }),
      })

      if (res.status === 429) {
        setLimitExceeded(true)
        setStep('input')
        setLoading(false)
        return
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        setError(errData?.error || `Request failed (${res.status})`)
        setStep('input')
        setLoading(false)
        return
      }

      const data: GenerateResult = await res.json()
      setResult(data)

      // Start SSE streaming
      const es = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate/stream/?session_id=${data.session_id}`
      )

      es.onmessage = (event) => {
        if (event.data === '[DONE]') {
          es.close()
          setStep('result')
          setLoading(false)

          // Mark onboarding step as complete
          try {
            const state = JSON.parse(localStorage.getItem('rawaj_onboarding') ?? '{}')
            state.generate = true
            localStorage.setItem('rawaj_onboarding', JSON.stringify(state))
          } catch {}
          return
        }
        try {
          const parsed = JSON.parse(event.data)
          setStreamedText((prev) => prev + (parsed.token || event.data))
        } catch {
          setStreamedText((prev) => prev + event.data)
        }
      }

      es.onerror = () => {
        es.close()
        setStep('result')
        setLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setStep('input')
      setLoading(false)
    }
  }

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleRegenerate() {
    setStep('input')
    setResult(null)
    setStreamedText('')
  }

  return (
    <div className="max-w-2xl">
      {/* Limit exceeded warning */}
      {limitExceeded && (
        <Card className="rounded-xl border-amber-200 bg-amber-50 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Monthly limit exceeded</p>
              <p className="text-sm text-amber-600 mt-1">
                You've reached your monthly generation limit.{' '}
                <Link href="/dashboard/upgrade" className="underline font-medium">
                  Upgrade your plan
                </Link>{' '}
                to continue generating.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Card className="rounded-xl border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Input form */}
      {step === 'input' && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleGenerate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Silk Abaya"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 199.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience (optional)</Label>
                <Input
                  id="target-audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Young professional women in Qatar"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={(v) => v && setTone(v)}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bilingual">Bilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!productName.trim() || loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Generate
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Streaming / Result */}
      {(step === 'generating' || step === 'result') && (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            {/* Streaming indicator */}
            {step === 'generating' && (
              <div className="flex items-center gap-2 text-sm text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </div>
            )}

            {/* Streamed text */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] whitespace-pre-wrap text-sm text-gray-900">
              {streamedText || (result?.long_description ?? 'Waiting for response...')}
            </div>

            {/* Result details */}
            {step === 'result' && result && (
              <>
                {result.title && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Title</div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 flex-1">{result.title}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyText(result.title, 'title')}
                        className="text-xs"
                      >
                        {copied === 'title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                )}

                {result.short_description && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 uppercase">Short Description</div>
                    <p className="text-sm text-gray-900">{result.short_description}</p>
                  </div>
                )}

                {/* Token stats */}
                {(result.tokens_in || result.tokens_out || result.cost_usd) && (
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
                    {result.tokens_in && <span>Tokens in: {result.tokens_in.toLocaleString()}</span>}
                    {result.tokens_out && <span>Tokens out: {result.tokens_out.toLocaleString()}</span>}
                    {result.cost_usd !== undefined && <span>Cost: ${result.cost_usd.toFixed(4)}</span>}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyText(
                      `${result.title}\n\n${result.short_description}\n\n${result.long_description}`,
                      'all'
                    )}
                    className="rounded-lg"
                  >
                    {copied === 'all' ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                    Copy All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    className="rounded-lg"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Regenerate
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
