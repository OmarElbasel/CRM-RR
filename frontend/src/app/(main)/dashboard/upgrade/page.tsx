'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Building2, CheckCircle2, Rocket, Zap } from 'lucide-react'
import Link from 'next/link'

export default function UpgradePage() {
  const t = useTranslations('upgrade')

  const PLANS = [
    {
      name: t('starter'),
      price: '$14',
      icon: <Zap className="w-6 h-6" />,
      description: t('starter_desc'),
      features: [
        '200 AI Generations',
        'Unified Inbox Access',
        'Basic Performance Stats',
        'WhatsApp Integration',
      ],
      buttonText: t('get_started'),
      highlight: false,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      name: 'Pro',
      price: '$41',
      icon: <Rocket className="w-6 h-6" />,
      description: t('pro_desc'),
      features: [
        '2,000 AI Generations',
        'Priority Unified Inbox',
        'Advanced Ads Dashboard',
        'TikTok & Meta Integration',
        'Custom Seasonal Templates',
        'Direct WhatsApp Composer',
      ],
      buttonText: t('upgrade_to_pro'),
      highlight: true,
      color: 'text-white',
      bg: 'bg-indigo-600',
    },
    {
      name: t('enterprise'),
      price: 'Custom',
      icon: <Building2 className="w-6 h-6" />,
      description: t('enterprise_desc'),
      features: [
        'Unlimited Generations',
        'Custom Arabic Dialect Fine-tuning',
        'Dedicated Channel Manager',
        'Full API & SDK Access',
        'White-label Reports',
      ],
      buttonText: t('contact_sales'),
      highlight: false,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col bg-background">
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 h-16 flex items-center justify-between font-headline">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
             <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </Link>
          <div className="h-4 w-px bg-slate-200"></div>
          <h2 className="text-lg font-black text-indigo-700 uppercase tracking-tight">{t('title')}</h2>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-xs font-bold text-slate-400">{t('current_plan_label')}: <span className="text-indigo-600">Free</span></span>
        </div>
      </header>

      <main className="p-12 max-w-7xl mx-auto w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl font-headline font-black text-slate-900 tracking-tight leading-tight">
             {t('hero_title')}
          </h1>
          <p className="text-slate-500 text-xl font-medium">
             {t('hero_subtitle')}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 rounded-3xl border flex flex-col h-full transition-all relative group overflow-hidden ${
                plan.highlight 
                  ? 'bg-slate-900 border-slate-800 text-white shadow-2xl shadow-indigo-200 scale-105 z-10' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-2'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 rtl:left-0 rtl:right-auto p-6">
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                     {t('recommendation')}
                  </span>
                </div>
              )}

              <div className="mb-8 relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.highlight ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-headline font-black mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black tabular-nums">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-sm font-bold opacity-60">{t('per_month')}</span>}
                </div>
                <p className={`text-sm font-medium leading-relaxed ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-1 relative z-10">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-sm font-semibold">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-black text-center transition-all shadow-lg active:scale-95 relative z-10 ${
                plan.highlight 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/40' 
                  : 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
              }`}>
                {plan.buttonText}
              </button>

              {/* Background Decorative Gradient for Pro Card */}
              {plan.highlight && (
                <div className="absolute -bottom-20 -right-20 rtl:-left-20 rtl:right-auto w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Section */}
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
              <h3 className="font-headline font-black text-2xl text-slate-900">{t('why_pro')}</h3>
              <p className="text-slate-500 font-medium">{t('why_pro_subtitle')}</p>
           </div>
           
           <div className="p-8 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                 <thead>
                    <tr className="border-b border-slate-100">
                       <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">{t('feature')}</th>
                       <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">{t('free')}</th>
                       <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-900 text-center bg-indigo-50/50">{t('pro')}</th>
                       <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">{t('enterprise')}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {([
                      { label: t('ai_generations'), free: '20 / mo', pro: '2,000 / mo', enterprise: 'Unlimited' },
                      { label: t('gulf_dialect'), free: 'Basic', pro: 'Advanced', enterprise: 'Custom Trained' },
                      { label: t('platform_integrations'), free: '1', pro: 'All Available', enterprise: 'Priority/Alpha' },
                      { label: t('support'), free: 'Email', pro: 'Priority 24/7', enterprise: 'Dedicated Manager' },
                    ]).map((row, idx) => (
                    <tr key={idx}>
                        <td className="py-6 font-bold text-slate-900">{row.label}</td>
                        <td className="py-6 text-center text-slate-500 font-medium">{row.free}</td>
                        <td className="py-6 text-center text-indigo-700 font-bold bg-indigo-50/50">{row.pro}</td>
                        <td className="py-6 text-center text-slate-500 font-medium">{row.enterprise}</td>
                    </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>
      </main>
    </div>
  )
}
