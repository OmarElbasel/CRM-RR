'use client'

interface LanguageToggleProps {
  value: 'ar' | 'en' | 'bilingual'
  onChange: (lang: 'ar' | 'en' | 'bilingual') => void
}

const options: { key: 'ar' | 'en' | 'bilingual'; label: string }[] = [
  { key: 'ar', label: 'العربية' },
  { key: 'en', label: 'English' },
  { key: 'bilingual', label: 'العربية + English' },
]

export default function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="flex gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            value === opt.key
              ? 'bg-[var(--rawaj-primary)] text-white'
              : 'bg-[var(--rawaj-border)] text-[var(--rawaj-text)] hover:bg-[var(--rawaj-primary)] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
