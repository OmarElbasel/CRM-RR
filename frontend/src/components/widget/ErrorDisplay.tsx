'use client'

interface ErrorDisplayProps {
  error: { message: string; message_ar: string; code: string } | null
  language: 'ar' | 'en' | 'bilingual'
  onRetry?: () => void
}

export default function ErrorDisplay({ error, language, onRetry }: ErrorDisplayProps) {
  if (!error) return null

  const isArabic = language !== 'en'
  const message = isArabic ? error.message_ar : error.message

  const showRetry = onRetry && error.code !== 'INVALID_API_KEY'

  let contextMessage = ''
  if (error.code === 'BUDGET_EXCEEDED') {
    contextMessage = isArabic
      ? 'تم الوصول إلى الحد الشهري للتوليد. يرجى ترقية خطتك.'
      : 'Monthly generation limit reached. Please upgrade your plan.'
  } else if (error.code === 'AI_PROVIDER_UNAVAILABLE') {
    contextMessage = isArabic
      ? 'خدمة الذكاء الاصطناعي غير متاحة حاليًا. يرجى المحاولة مرة أخرى.'
      : 'AI service is currently unavailable. Please try again.'
  }

  return (
    <div
      className="rounded-lg p-4 my-4"
      style={{
        backgroundColor: 'var(--rawaj-error-bg)',
        border: '1px solid var(--rawaj-error-text)',
        color: 'var(--rawaj-error-text)',
      }}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          {contextMessage && <p className="mt-1 text-sm opacity-80">{contextMessage}</p>}
        </div>
        <span
          className="text-xs px-2 py-1 rounded"
          style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-muted)' }}
        >
          {error.code}
        </span>
      </div>
      {showRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--rawaj-primary)',
            color: '#fff',
          }}
        >
          {isArabic ? 'إعادة المحاولة' : 'Retry'}
        </button>
      )}
    </div>
  )
}
