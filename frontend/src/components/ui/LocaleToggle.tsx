'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
]

export function LocaleToggle() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 bg-paper-2 border border-ds-line rounded-lg p-0.5">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={pathname}
          className="px-2 py-1 text-[11px] font-bold rounded-md text-ds-text-3 hover:text-ds-text transition-colors"
        >
          {locale.label}
        </Link>
      ))}
    </div>
  )
}
