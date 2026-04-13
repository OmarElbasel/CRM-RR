'use client'

interface GenerateButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
  language: 'ar' | 'en' | 'bilingual'
}

export default function GenerateButton({ onClick, loading, disabled, language }: GenerateButtonProps) {
  const isArabic = language !== 'en'

  const label = loading
    ? isArabic ? 'جارٍ التوليد...' : 'Generating...'
    : isArabic ? 'توليد المحتوى' : 'Generate Content'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full min-h-[44px] py-3 px-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
        loading || disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-[var(--rawaj-primary)] hover:bg-[var(--rawaj-primary-hover)] text-white cursor-pointer'
      }`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {label}
    </button>
  )
}
