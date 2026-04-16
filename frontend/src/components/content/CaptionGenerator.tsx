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
    <div className="grid grid-cols-12 gap-8 py-8">
      {/* Left Column: Input Panel */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-lg">Caption Parameters</h3>
            <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/30">
              <button 
                onClick={() => setLang('en')}
                className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${lang === 'en' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang('ar')}
                className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${lang === 'ar' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              >
                AR
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Product Description</label>
              <textarea 
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full h-32 bg-surface-container-lowest border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-body"
                placeholder="Describe your product or service here... (e.g. Handmade organic coffee scrub with vanilla scent)"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Voice Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'EXCITING', label: 'Exciting', icon: 'rocket_launch' },
                  { value: 'ELEGANT', label: 'Elegant', icon: 'auto_awesome' },
                  { value: 'FRIENDLY', label: 'Friendly', icon: 'sentiment_satisfied' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTone(opt.value)}
                    className={`flex flex-col items-center justify-center py-3 border-2 rounded-xl transition-all ${
                      tone === opt.value 
                        ? 'border-primary bg-primary/5 text-primary scale-[1.02]' 
                        : 'border-slate-100 bg-white text-on-surface-variant hover:border-primary/40'
                    }`}
                  >
                    <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: tone === opt.value ? "'FILL' 1" : undefined }}>
                      {opt.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !productDescription.trim()}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold headline flex items-center justify-center gap-2 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'magic_button'}
              </span>
              {loading ? 'Generating...' : 'Generate Captions'}
            </button>
          </form>
        </div>

        {/* Small Tip Card */}
        <div className="bg-secondary-container/10 border border-secondary/20 p-5 rounded-xl flex gap-4 transition-all hover:bg-secondary-container/20 cursor-default">
          <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary">lightbulb</span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-secondary-container">Pro Tip</p>
            <p className="text-xs text-on-secondary-container/80 leading-relaxed font-body">Add specific keywords like &quot;limited edition&quot; or &quot;free delivery&quot; to increase conversion by 24%.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Result Panel */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 uppercase tracking-widest leading-none">
            <span className="text-[10px] font-black text-slate-400">AI Generated Output</span>
            <div className="flex gap-2">
              <button 
                 onClick={handleSubmit} 
                 disabled={loading || !productDescription.trim()}
                 className="text-[10px] font-black text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> Try Again
              </button>
            </div>
          </div>
          
          <div className="p-8 space-y-8 flex-1">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12">
                 <span className="material-symbols-outlined text-6xl mb-4 opacity-20">contract_edit</span>
                 <p className="font-bold text-sm">Output will appear here</p>
              </div>
            )}

            {loading && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-100 rounded w-5/6"></div>
               </div>
            )}

            {result && (
              <>
                <div className="relative group">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
                  <p className={`text-lg text-on-surface leading-relaxed font-body ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? result.caption_ar : result.caption_en}
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block">Recommended Hashtags</span>
                  <div className={`flex flex-wrap gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    {(lang === 'ar' ? result.hashtags_ar : result.hashtags_en).map((tag, i) => (
                      <button 
                        key={i} 
                        onClick={() => copyToClipboard(tag)}
                        className="bg-surface-container px-3 py-1.5 rounded-full text-[10px] font-bold text-on-surface-variant border border-outline-variant hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1.5 group"
                      >
                        {tag} <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">content_copy</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto border-t border-slate-100 p-6 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4">
              <button 
                onClick={() => result && copyToClipboard(lang === 'ar' ? result.caption_ar : result.caption_en)}
                disabled={!result}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-primary border border-indigo-200 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span> Copy All
              </button>
              <button 
                disabled={!result}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">share</span> Post Directly
              </button>
            </div>
            {result && (
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Generated in 1.4s
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
