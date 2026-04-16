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
    <div className="grid grid-cols-12 gap-8 py-8">
      {/* Left Column: Input Panel */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline font-bold text-lg">Broadcast Parameters</h3>
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
              <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Target Audience / Offer</label>
              <textarea 
                value={audienceDescription}
                onChange={(e) => setAudienceDescription(e.target.value)}
                className="w-full h-32 bg-surface-container-lowest border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 font-body"
                placeholder="Describe your audience... (e.g. Existing customers who haven't ordered in 30 days)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-black text-on-surface-variant uppercase tracking-wider mb-2">Campaign Type</label>
                  <select 
                    value={campaignType} 
                    onChange={(e) => setCampaignType(e.target.value)} 
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    {CAMPAIGN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
               </div>
               <div className="flex items-end">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger render={<button type="button" className="w-full h-10 flex items-center justify-center gap-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all" />}>
                      <span className="material-symbols-outlined text-base">template_library</span>
                      Templates
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                          <h3 className="font-headline font-black text-xl text-slate-900">Seasonal Content Templates</h3>
                          <p className="text-sm text-slate-500 font-medium">Jumpstart your campaign with proven structures.</p>
                        </div>
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                          <SeasonalTemplateGallery onSelect={handleTemplateSelect} />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !audienceDescription.trim()}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold headline flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'send'}
              </span>
              {loading ? 'Composing...' : 'Generate Broadcast'}
            </button>
          </form>
        </div>

        {/* Small Tip Card */}
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-xl flex gap-4 transition-all hover:bg-primary/10 cursor-default">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">chat_bubble</span>
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">WhatsApp Strategy</p>
            <p className="text-xs text-indigo-700/80 leading-relaxed font-body">Personalized messages with first name placeholders increase open rates by 35% on WhatsApp.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Result Panel */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 uppercase tracking-widest leading-none">
            <span className="text-[10px] font-black text-slate-400">Message Preview</span>
            <div className="flex gap-2">
              <button 
                 onClick={handleSubmit} 
                 disabled={loading || !audienceDescription.trim()}
                 className="text-[10px] font-black text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> New Draft
              </button>
            </div>
          </div>
          
          <div className="p-8 space-y-8 flex-1">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 py-12">
                 <span className="material-symbols-outlined text-6xl mb-4 opacity-20">forum</span>
                 <p className="font-bold text-sm">Broadcast message will appear here</p>
              </div>
            )}

            {loading && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-slate-100 rounded w-full"></div>
                 <div className="h-4 bg-slate-100 rounded w-full"></div>
                 <div className="h-4 bg-slate-100 rounded w-2/3"></div>
               </div>
            )}

            {result && (
              <>
                <div className="relative group p-8 bg-[#E7FFDB] rounded-2xl border border-[#D1F0C0] shadow-sm max-w-[90%] self-start">
                   <div className="absolute -left-1.5 top-4 w-4 h-4 bg-[#E7FFDB] transform rotate-45 border-l border-b border-[#D1F0C0]"></div>
                   <p className={`text-base text-slate-800 leading-relaxed font-body whitespace-pre-wrap ${lang === 'ar' ? 'text-right' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? result.message_ar : result.message_en}
                   </p>
                   <div className="flex justify-end gap-1 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium">10:42 PM</span>
                      <span className="material-symbols-outlined text-blue-500 text-[14px]">done_all</span>
                   </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-sm">tips_and_updates</span>
                      Optimization Tips
                   </div>
                   <ul className="text-xs text-slate-500 space-y-1 font-medium list-disc list-inside">
                      <li>Include an Emoji at the start to grab attention 🚀</li>
                      <li>End with a clear, single Call-to-Action</li>
                      <li>Avoid uppercase strings (spam filters)</li>
                   </ul>
                </div>
              </>
            )}
          </div>

          <div className="mt-auto border-t border-slate-100 p-6 bg-slate-50/30">
            <button 
              onClick={() => result && copyToClipboard(lang === 'ar' ? result.message_ar : result.message_en)}
              disabled={!result}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold text-sm hover:bg-[#20bd5a] transition-all shadow-lg shadow-green-100 disabled:opacity-50 disabled:shadow-none"
            >
              <span className="material-symbols-outlined text-lg">content_copy</span> Copy to WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
