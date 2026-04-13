'use client'
// Hero section — premium dark design
// Background: dark mesh gradient (from-slate-900 via-indigo-950 to-slate-900)
// Two large blurred orbs for depth
// Eyebrow badge with Sparkles icon
// Large display headline with gradient text on "Gulf Commerce"
// Sub-headline in gray-300
// Two CTA buttons: primary white + ghost outline
// Social proof stat row (3 stats) below CTAs

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Orb 1 */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      {/* Orb 2 */}
      <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 lg:py-36 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered for Gulf Commerce</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-bold text-5xl lg:text-7xl text-white leading-tight tracking-tight mb-6">
          AI Product Descriptions
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            for Gulf Commerce
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Generate compelling product titles and descriptions in Arabic and English.
          Built for Shopify, Salla, and Zid merchants across the Gulf region.
        </p>

        {/* CTA group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 transition-colors duration-150 rounded-xl px-8 py-4 text-base font-semibold cursor-pointer"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 transition-colors duration-150 rounded-xl px-8 py-4 text-base font-medium cursor-pointer"
          >
            View pricing
          </Link>
        </div>

        {/* Stat row */}
        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10 max-w-2xl mx-auto">
          <div>
            <p className="text-3xl font-display font-bold text-white">500+</p>
            <p className="text-gray-400 text-sm mt-1">Merchants</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-white">3</p>
            <p className="text-gray-400 text-sm mt-1">Languages</p>
          </div>
          <div>
            <p className="text-3xl font-display font-bold text-white">1-Line</p>
            <p className="text-gray-400 text-sm mt-1">Install</p>
          </div>
        </div>
      </div>
    </section>
  )
}
