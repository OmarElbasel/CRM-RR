'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Circle, Sparkles, Code2, ShoppingBag } from 'lucide-react'

interface OnboardingState {
  generate: boolean
  embed: boolean
  install: boolean
}

export function OnboardingChecklist() {
  const t = useTranslations('onboarding')
  const [state, setState] = useState<OnboardingState | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('rawaj_onboarding')
      const parsed = raw ? JSON.parse(raw) : { generate: false, embed: false, install: false }
      setState(parsed)
    } catch {
      setState({ generate: false, embed: false, install: false })
    }
  }, [])

  const STEPS = [
    {
      key: 'generate' as const,
      label: t('generate_first_product'),
      href: '/dashboard/generate',
      icon: Sparkles,
    },
    {
      key: 'embed' as const,
      label: t('copy_embed_code'),
      href: '/dashboard/embed',
      icon: Code2,
    },
    {
      key: 'install' as const,
      label: t('install_on_store'),
      href: '/dashboard/embed',
      icon: ShoppingBag,
    },
  ]

  // Don't render during SSR or if state hasn't loaded yet
  if (!state) return null

  // Don't render if all steps are done
  const allDone = state.generate && state.embed && state.install
  if (allDone) return null

  const completedCount = [state.generate, state.embed, state.install].filter(Boolean).length

  return (
    <div className="bg-white rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)] p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-ds-primary-soft flex items-center justify-center text-ds-primary">
            <CheckCircle2 />
          </div>
          <div>
            <h3 className="font-bold text-lg font-headline text-ds-text">{t('get_started')}</h3>
            <p className="text-sm text-ds-text-2">{t('of_complete', { count: completedCount, total: 3 })}</p>
          </div>
        </div>
        <div className="w-full sm:w-1/3">
          <div className="flex justify-between items-end mb-1 text-[10px] font-bold text-ds-text-2 uppercase tracking-tighter">
            <span>{t('progress')}</span>
            <span>{Math.round((completedCount / 3) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-paper-2 rounded-full overflow-hidden">
            <div className="h-full bg-ds-primary rounded-full transition-all duration-500" style={{ width: `${(completedCount / 3) * 100}%` }}></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {STEPS.map((step) => {
          const done = state[step.key]
          const Icon = step.icon
          return (
            <Link
              key={step.key}
              href={step.href}
              className={`flex items-center gap-3 p-3 rounded-[10px] transition-colors border ${
                done
                  ? 'bg-paper border-ds-line'
                  : 'bg-white border-dashed border-ds-primary/30 hover:bg-paper'
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-ds-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-ds-line-2 flex-shrink-0" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${done ? 'text-ds-primary' : 'text-ds-text-3'}`} />
              <span className={`text-sm ${done ? 'text-ds-text-3 line-through' : 'text-ds-text font-medium'}`}>
                {step.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
