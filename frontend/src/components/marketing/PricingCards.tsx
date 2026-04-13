'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { PLANS } from '@/lib/plans'
import { formatPrice } from '@/lib/currency'

export function PricingCards() {
  const [currency, setCurrency] = useState<'QAR' | 'SAR' | 'USD'>('USD')

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Start free and scale as your store grows. No hidden fees.
          </p>
          <CurrencyToggle value={currency} onChange={setCurrency} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isRecommended = plan.id === 'pro'
            return (
              <Card
                key={plan.id}
                className={`rounded-xl shadow-sm relative ${
                  isRecommended
                    ? 'ring-2 ring-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10'
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
                    <h3 className="text-lg font-display font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <div className="mt-2 mb-6">
                      <span className="text-4xl font-display font-bold text-gray-900">{formatPrice(plan.priceUSD, currency)}</span>
                      {plan.priceUSD != null && plan.priceUSD > 0 && <span className="text-gray-400 text-sm font-normal ml-1">/mo</span>}
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

                  <Button
                    render={<Link href="/sign-up" />}
                    variant={isRecommended ? 'default' : 'outline'}
                    className={`w-full rounded-lg cursor-pointer mt-6 ${
                      isRecommended
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : ''
                    }`}
                  >
                      {plan.priceUSD === 0 ? 'Start for free' : plan.priceUSD === null ? 'Contact us' : 'Get started'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
