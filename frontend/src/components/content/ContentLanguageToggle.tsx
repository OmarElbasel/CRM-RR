'use client'

import { Button } from '@/components/ui/button'

interface ContentLanguageToggleProps {
  value: 'ar' | 'en'
  onChange: (v: 'ar' | 'en') => void
}

export function ContentLanguageToggle({ value, onChange }: ContentLanguageToggleProps) {
  return (
    <div className="inline-flex rounded-lg border p-1">
      <Button
        variant={value === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('ar')}
        className="h-8 px-3 text-xs"
      >
        AR
      </Button>
      <Button
        variant={value === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChange('en')}
        className="h-8 px-3 text-xs"
      >
        EN
      </Button>
    </div>
  )
}
