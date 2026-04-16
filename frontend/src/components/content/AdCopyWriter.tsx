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
    <div className="grid grid-cols-12 gap-8 py-8">
      {/* Left Column: Input Panel */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-lg">Ad Copy Parameters</h3>
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
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Offer/Product Description</label>
              <textarea 
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full h-32 bg-surface-container-lowest border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-body"
                placeholder="Describe your offer... (e.g. 20% off for first-time customers on our organic coffee)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Platform</label>
                  <select 
                    value={platform} 
                    onChange={(e) => setPlatform(e.target.value)} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {PLATFORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Tone</label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {TONE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !productDescription.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold headline flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'ads_click'}
              </span>
              {loading ? 'Writing Copy...' : 'Generate Ad Copy'}
            </button>
          </form>
        </div>

        {/* Small Tip Card */}
        <div className="bg-secondary-container/10 border border-secondary/20 p-5 rounded-xl flex gap-4 transition-all hover:bg-secondary-container/20 cursor-default">
          <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-secondary">insights</span>
          </div>
          <div>
            <p className="text-sm font-bold text-on-secondary-container">Performance Note</p>
            <p className="text-xs text-on-secondary-container/80 leading-relaxed font-body">Direct-response copies with price transparency usually perform 18% better on {platform === 'META' ? 'Instagram' : 'TikTok'}.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Result Panel */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 uppercase tracking-widest leading-none">
            <span className="text-[10px] font-black text-slate-400">Preview Layout</span>
            <div className="flex gap-2">
              <button 
                 onClick={handleSubmit} 
                 disabled={loading || !productDescription.trim()}
                 className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> Regenerate
              </button>
            </div>
          </div>
          
          <div className="p-8 space-y-8 flex-1">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12">
                 <span className="material-symbols-outlined text-6xl mb-4 opacity-20">ad_group</span>
                 <p className="font-bold text-sm">Ad Copy will appear here</p>
              </div>
            )}

            {loading && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-6 bg-slate-100 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-100 rounded w-5/6"></div>
               </div>
            )}

            {result && (
              <>
                <div className="relative group p-6 bg-surface-container rounded-xl border border-slate-100 shadow-inner">
                  <div className="absolute -left-4 top-4 bottom-4 w-1 bg-indigo-600 rounded-full"></div>
                  <h4 className={`text-xl font-headline font-black text-slate-900 mb-4 ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? result.headline_ar : result.headline_en}
                  </h4>
                  <p className={`text-base text-slate-600 leading-relaxed font-body ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? result.body_ar : result.body_en}
                  </p>
                </div>

                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                   <div className="flex items-center gap-2 text-indigo-700 font-bold text-[10px] uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-sm">info</span>
                      Suggested Target Audience
                   </div>
                   <p className="text-xs text-indigo-600/80 font-medium">Coffee enthusiasts, organic lifestyle followers, ages 24-45, Middle East region.</p>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto border-t border-slate-100 p-6 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4">
              <button 
                onClick={() => result && copyToClipboard((lang === 'ar' ? result.headline_ar : result.headline_en) + '\n' + (lang === 'ar' ? result.body_ar : result.body_en))}
                disabled={!result}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span> Copy for {platform}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
