'use client'

import { useLocaleContext } from '@/components/providers/LocaleProvider'

const locales = [
  { code: 'en' as const, label: 'EN' },
  { code: 'ar' as const, label: 'AR' },
]

export function LocaleToggle() {
  const { locale, setLocale } = useLocaleContext()

  return (
    <div className="flex items-center gap-1 bg-paper-2 border border-ds-line rounded-lg p-0.5">
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => setLocale(loc.code)}
          className={`px-2 py-1 text-[11px] font-bold rounded-md transition-colors ${
            locale === loc.code
              ? 'bg-white text-ds-text shadow-sm'
              : 'text-ds-text-3 hover:text-ds-text'
          }`}
        >
          {loc.label}
        </button>
      ))}
    </div>
  )
}
