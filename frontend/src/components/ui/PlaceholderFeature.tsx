'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PlaceholderFeatureProps {
  icon: React.ReactNode
  title: string
  description: string
  phase: string
  ctaLabel?: string
  onNotify?: () => void
}

export function PlaceholderFeature({
  icon,
  title,
  description,
  phase,
  ctaLabel = 'Notify me',
  onNotify,
}: PlaceholderFeatureProps) {
  function handleNotify() {
    if (onNotify) {
      onNotify()
    } else {
      alert(`We'll notify you when ${title} is available!`)
    }
  }

  return (
    <Card className="rounded-xl shadow-sm max-w-md mx-auto">
      <CardContent className="flex flex-col items-center text-center py-12 px-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-indigo-600">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-4 max-w-xs">{description}</p>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 mb-6">
          Coming in {phase}
        </span>
        <Button onClick={handleNotify} variant="outline" className="rounded-lg">
          {ctaLabel}
        </Button>
      </CardContent>
    </Card>
  )
}
