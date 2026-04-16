'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Copy, 
  Check, 
  RefreshCw, 
  Loader2, 
  AlertTriangle, 
  ChevronRight
} from 'lucide-react'
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

// Data from the provided design
const RECENT_GENERATIONS = [
  { 
    id: 1, 
    title: 'Luxury Abaya Set', 
    category: 'Fashion', 
    time: '2 mins ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaeH_UcVdhSFQP-WpaIfae-QZcAAC8cqYYn_wbJ3OxyNwWx0w-pN9Ki6-_-RgtlyubZgur3_WJIdGBrhine55jEplmCJtQom-WHAw-WOz_YhECikkcK6ARcA8saNEl_km20QYfw2A6FVY8STOhOq8HYc0hegHKDS2I7Hl_I8oLQam_7IPQbSPLdx-zPlqNvDVzHnGg7tyQqMligkLqic8tEmZLi0XfKtZQS-u5ooEVC_dqFD4P2wuF6TcY-B-7hLQTK8bQLcHfmXIb'
  },
  { 
    id: 2, 
    title: 'Organic Raw Honey', 
    category: 'Food', 
    time: '45 mins ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT2mP_9d5hR0xDgczZh7IoJQEwlKWIjvH3v3cx8KBkuu1-Tltn3v7fyfVQCSGukyKMn5cfD84P_RUnkzYmGyH2Lxm8LWH1QH_CoseFvjfaiBEeAeZz-7JmoFj9kn0RGRWgzRo4-51rour8escx6vWKz5KbKNiak62byU5mShg266bxhhK9jlVBZSy_tYi-MqcjjeQ7rpS-2GVVh1NaPKB7mzSUaLUQArsquBCOuLaGxjVWQ1hoI8sAbdJYE2yjZsnphQzISLUhQ5F2'
  },
  { 
    id: 3, 
    title: 'Classic Leather Watch', 
    category: 'Accessories', 
    time: '2 hours ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-6VikvFrTQjpaHPQ--LSZ1mrUnI0txI8ZOI3H4RTTRNAzIZOvrqxa6TFL8Y-Kt-nkEwXs5Tl5WTYctqZO1uH39z4gOAFDrnRzz63MqQ8bslErvXRK9APmTuA83ClZZepSJZHrpZYOMau0QWn7fIYxivIOp9tY4H-p7Mo_JdmLiCFvi4wuaWlHQ2bGEd-KghjxzE2trhPsWcm41YvvP2t4NTKKHUX45XoewTRHuNIm8I4pUE4PQ6rGYSt2JlU0eCwFqJQvyIRCU_xN'
  },
]

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
  const [category, setCategory] = useState('Fashion')
  const [price, setPrice] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [tone, setTone] = useState('Professional')
  const [language, setLanguage] = useState('Arabic')

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
      // Mapping display labels back to API values
      const apiLanguage = language === 'Arabic' ? 'ar' : language === 'English' ? 'en' : 'bilingual'
      const apiTone = tone.toLowerCase()
      const apiCategory = category.toLowerCase()

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate/product-content/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: productName,
          category: apiCategory,
          price: price || undefined,
          target_audience: targetAudience || undefined,
          tone: apiTone,
          language: apiLanguage,
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

      const es = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate/stream/?session_id=${data.session_id}`
      )

      es.onmessage = (event) => {
        if (event.data === '[DONE]') {
          es.close()
          setStep('result')
          setLoading(false)
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
    <div className="space-y-12">
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (lg:col-span-7) */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 relative overflow-hidden transition-all duration-500">
            {/* Decorative glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">Product Details</h2>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <Label className="block text-sm font-bold text-on-surface-variant mb-2">Product Name</Label>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Silk Abaya"
                    className="w-full h-12 px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block text-sm font-bold text-on-surface-variant mb-2">Category</Label>
                    <Select value={category} onValueChange={(val) => val && setCategory(val)}>
                      <SelectTrigger className="h-12 border-outline-variant bg-surface-bright rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fashion">Fashion</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Home">Home Decor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="block text-sm font-bold text-on-surface-variant mb-2">Price (QAR)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="h-12 border-outline-variant bg-surface-bright rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="block text-sm font-bold text-on-surface-variant mb-2">Target Audience</Label>
                  <Input
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Young professional women in Qatar"
                    className="h-12 border-outline-variant bg-surface-bright rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="block text-sm font-bold text-on-surface-variant mb-2">Tone</Label>
                    <Select value={tone} onValueChange={(val) => val && setTone(val)}>
                      <SelectTrigger className="h-12 border-outline-variant bg-surface-bright rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Witty">Witty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="block text-sm font-bold text-on-surface-variant mb-2">Language</Label>
                    <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                      <SelectTrigger className="h-12 border-outline-variant bg-surface-bright rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Bilingual">Bilingual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={!productName.trim() || loading}
                    className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined">auto_awesome</span>
                    )}
                    Generate Product Description
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Preview / Result (lg:col-span-5) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Main Content Area */}
          <div className={`rounded-xl border shadow-sm transition-all duration-500 min-h-[460px] flex flex-col ${result || step === 'generating' ? 'bg-surface-container-lowest border-outline-variant' : 'bg-surface-container border-dashed border-outline items-center justify-center text-center px-8'}`}>
            
            {step === 'input' && !result && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-outline-variant mb-6 mx-auto">
                  <span className="material-symbols-outlined text-4xl">description</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3 headline">No Description Generated</h3>
                <p className="text-on-surface-variant max-w-[260px] mx-auto text-sm leading-relaxed">
                  Fill in the details on the left and click "Generate" to see the magic happen.
                </p>
              </div>
            )}

            {(step === 'generating' || result) && (
              <div className="p-8 flex-1 flex flex-col animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-500" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">AI Output</span>
                  </div>
                  {step === 'generating' && (
                    <div className="flex items-center gap-2 text-primary font-bold text-xs animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5"></div>
                      Generating...
                    </div>
                  )}
                </div>

                <div className="flex-1 bg-surface-bright rounded-xl border border-outline-variant p-6 mb-6 whitespace-pre-wrap text-sm text-on-surface leading-relaxed overflow-y-auto max-h-[280px] font-body shadow-inner">
                  {streamedText || result?.long_description || 'Pre-generating...'}
                </div>

                {result && (
                  <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => copyText(`${result.title}\n\n${result.short_description}\n\n${result.long_description}`, 'all')}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-lg"
                      >
                        {copied === 'all' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleRegenerate}
                        className="h-11 border-outline-variant hover:bg-surface-container transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Simplified token info */}
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                      Cost: ${result.cost_usd?.toFixed(4)} • {result.tokens_out} tokens
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Generation Tips */}
          <div className="bg-gradient-to-br from-tertiary/10 to-primary/10 rounded-xl p-6 border border-tertiary-container/30 transition-all hover:shadow-md">
            <h4 className="text-sm font-extrabold text-tertiary mb-4 flex items-center gap-2 uppercase tracking-tight">
              <span className="material-symbols-outlined text-base">lightbulb</span>
              AI Generation Tips
            </h4>
            <ul className="text-sm space-y-4 text-on-surface-variant">
              {[
                "Be specific with your audience to get highly personalized hooks.",
                "Using 'Luxury' tone for premium products increases 'perceived value' vocabulary.",
                "Bilingual mode is perfect for local markets in the GCC."
              ].map((tip, idx) => (
                <li key={idx} className="flex gap-2 leading-relaxed">
                  <span className="text-tertiary font-bold text-lg leading-none">•</span>
                  <span className="font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Link Card */}
          <div className="relative rounded-xl overflow-hidden h-36 group cursor-pointer shadow-lg">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr3EDEK3kynzKQ4Y2pjREd0OXccqHdKnCCeLtr-FC0iHWrIQGM0tVRruglSsPXT5JzTkd3X68aB5iEnuQqBgthSkPEWQ5GuCXU6mbXvw0q0K08eGMDYOiCUH1whBTCjwxeCiApwsoNOrQIMkpZMTBbOIV-3cIv24p-0Tlm6hVeLTq7JuBMJWGPBPwgmPDBXdfb_N1lvPf0HZEwdkdNzarjbZBVEHfHdD52lI9Xw6Whc6ouHfI6Qm5FUc59xJrnP-svfv2TasmdDs-A" alt="Template Preview" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center opacity-90 group-hover:bg-black/40 transition-all">
              <span className="text-white font-extrabold text-sm tracking-widest uppercase">View Template Gallery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Generations */}
      <div className="pt-8 border-t border-outline-variant">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight text-on-surface">Recent Generations</h2>
          <Button variant="ghost" className="text-sm font-bold text-primary hover:bg-primary/5 px-4 h-10">
            View History <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECENT_GENERATIONS.map((gen) => (
            <div key={gen.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
              <div className="w-14 h-14 rounded-lg bg-surface-variant overflow-hidden flex-shrink-0 shadow-sm border border-outline-variant/30">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={gen.image} alt={gen.title} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-on-surface truncate group-hover:text-primary transition-colors">{gen.title}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-70">{gen.category} • {gen.time}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
