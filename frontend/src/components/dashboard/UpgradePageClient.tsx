'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { Check, Loader2 } from 'lucide-react'
import { PLANS } from '@/lib/plans'
import { formatPrice } from '@/lib/currency'

interface UpgradePageClientProps {
  currentPlan: string
}

export function UpgradePageClient({ currentPlan }: UpgradePageClientProps) {
  const { getToken } = useAuth()
  const [currency, setCurrency] = useState<'QAR' | 'SAR' | 'USD'>('QAR')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  async function handleUpgrade(planId: string) {
    setLoadingPlan(planId)
    try {
      const token = await getToken()
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/billing/create-checkout/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan: planId }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        window.location.href = data.checkout_url
      } else {
        alert('Failed to create checkout session. Please try again.')
      }
    } catch {
      alert('An error occurred. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Upgrade Plan"
        subtitle="Choose the best plan for your business"
        action={<CurrencyToggle value={currency} onChange={setCurrency} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isRecommended = plan.id === 'pro'
          return (
            <Card
              key={plan.id}
              className={`rounded-xl shadow-sm relative ${
                isRecommended
                  ? 'ring-2 ring-indigo-600 shadow-indigo-100'
                  : isCurrent
                  ? 'border-indigo-200 bg-indigo-50/30'
                  : 'border-gray-200'
              }`}
            >
              {isRecommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-3">
                  Recommended
                </Badge>
              )}
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(plan.priceUSD, currency)}
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled variant="outline" className="w-full rounded-lg">
                    Current plan
                  </Button>
                ) : plan.priceUSD === null ? (
                  <Button variant="outline" className="w-full rounded-lg" render={<a href="mailto:hello@rawaj.app" />}>
                    Contact us
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full rounded-lg ${
                      isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : ''
                    }`}
                    variant={isRecommended ? 'default' : 'outline'}
                  >
                    {loadingPlan === plan.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Upgrade'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
