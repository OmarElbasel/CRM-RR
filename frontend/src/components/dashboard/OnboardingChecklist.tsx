'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Sparkles, Code2, ShoppingBag } from 'lucide-react'

interface OnboardingState {
  generate: boolean
  embed: boolean
  install: boolean
}

const STEPS = [
  {
    key: 'generate' as const,
    label: 'Generate your first product',
    href: '/dashboard/generate',
    icon: Sparkles,
  },
  {
    key: 'embed' as const,
    label: 'Copy your embed code',
    href: '/dashboard/embed',
    icon: Code2,
  },
  {
    key: 'install' as const,
    label: 'Install on your store',
    href: '/dashboard/embed',
    icon: ShoppingBag,
  },
]

export function OnboardingChecklist() {
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

  // Don't render during SSR or if state hasn't loaded yet
  if (!state) return null

  // Don't render if all steps are done
  const allDone = state.generate && state.embed && state.install
  if (allDone) return null

  const completedCount = [state.generate, state.embed, state.install].filter(Boolean).length

  return (
    <Card className="rounded-xl shadow-sm border-indigo-200 bg-indigo-50/30 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Get Started</h3>
          <span className="text-xs text-gray-500">{completedCount} of 3 complete</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-5">
          <div
            className="h-1.5 bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {STEPS.map((step) => {
            const done = state[step.key]
            const Icon = step.icon
            return (
              <Link
                key={step.key}
                href={step.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  done
                    ? 'bg-green-50/50'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <Icon className={`w-4 h-4 flex-shrink-0 ${done ? 'text-green-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                  {step.label}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
