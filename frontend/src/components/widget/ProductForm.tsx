'use client'

import { useState, useCallback, useEffect, useRef, type FormEvent } from 'react'
import type { GenerateInputs } from '@/lib/api'
import LanguageToggle from './LanguageToggle'

interface ProductFormProps {
  onSubmit: (inputs: GenerateInputs) => void
  disabled: boolean
  language: 'ar' | 'en' | 'bilingual'
  onLanguageChange: (lang: 'ar' | 'en' | 'bilingual') => void
  defaultValues?: Partial<GenerateInputs>
  formRef?: React.Ref<HTMLFormElement>
}

const CATEGORIES = [
  { value: 'fashion', ar: 'أزياء', en: 'Fashion' },
  { value: 'food', ar: 'طعام', en: 'Food' },
  { value: 'electronics', ar: 'إلكترونيات', en: 'Electronics' },
  { value: 'beauty', ar: 'تجميل', en: 'Beauty' },
  { value: 'home', ar: 'منزل', en: 'Home' },
  { value: 'other', ar: 'أخرى', en: 'Other' },
]

const TONES = [
  { value: 'professional', ar: 'احترافي', en: 'Professional' },
  { value: 'casual', ar: 'عادي', en: 'Casual' },
  { value: 'luxury', ar: 'فاخر', en: 'Luxury' },
]

export default function ProductForm({
  onSubmit,
  disabled,
  language,
  onLanguageChange,
  defaultValues,
  formRef,
}: ProductFormProps) {
  const isArabic = language !== 'en'

  const [productName, setProductName] = useState(defaultValues?.product_name ?? '')
  const [category, setCategory] = useState(defaultValues?.category ?? 'fashion')
  const [tone, setTone] = useState(defaultValues?.tone ?? 'professional')
  const [price, setPrice] = useState(defaultValues?.price ?? '')
  const [targetAudience, setTargetAudience] = useState(defaultValues?.target_audience ?? '')
  const [nameError, setNameError] = useState('')

  // Sync state when defaultValues changes (e.g., postMessage RAWAJ_PREFILL)
  const prevDefaultsRef = useRef(defaultValues)
  useEffect(() => {
    if (defaultValues && defaultValues !== prevDefaultsRef.current) {
      prevDefaultsRef.current = defaultValues
      if (defaultValues.product_name !== undefined) setProductName(defaultValues.product_name)
      if (defaultValues.category !== undefined) setCategory(defaultValues.category)
      if (defaultValues.tone !== undefined) setTone(defaultValues.tone)
      if (defaultValues.price !== undefined) setPrice(defaultValues.price)
      if (defaultValues.target_audience !== undefined) setTargetAudience(defaultValues.target_audience)
    }
  }, [defaultValues])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (!productName.trim()) {
        setNameError(isArabic ? 'اسم المنتج مطلوب' : 'Product name is required')
        return
      }
      setNameError('')
      onSubmit({
        product_name: productName.trim(),
        category,
        tone,
        language,
        ...(price ? { price } : {}),
        ...(targetAudience ? { target_audience: targetAudience } : {}),
      })
    },
    [productName, category, tone, language, price, targetAudience, onSubmit, isArabic]
  )

  const inputCls =
    'w-full min-h-[44px] px-4 py-3 rounded-lg text-base border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--rawaj-primary)]'

  return (
    <form ref={formRef} onSubmit={handleSubmit} dir={language === 'en' ? 'ltr' : 'rtl'}>
      <LanguageToggle value={language} onChange={onLanguageChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Product Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--rawaj-text)' }}>
            {isArabic ? 'اسم المنتج' : 'Product Name'} *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value)
              if (nameError) setNameError('')
            }}
            placeholder={isArabic ? 'اسم المنتج' : 'Product name'}
            disabled={disabled}
            className={inputCls}
            style={{
              backgroundColor: 'var(--rawaj-bg)',
              borderColor: nameError ? 'var(--rawaj-error-text)' : 'var(--rawaj-border)',
              color: 'var(--rawaj-text)',
            }}
          />
          {nameError && (
            <p className="text-sm mt-1" style={{ color: 'var(--rawaj-error-text)' }}>
              {nameError}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--rawaj-text)' }}>
            {isArabic ? 'الفئة' : 'Category'}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={disabled}
            className={inputCls}
            style={{
              backgroundColor: 'var(--rawaj-bg)',
              borderColor: 'var(--rawaj-border)',
              color: 'var(--rawaj-text)',
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {isArabic ? c.ar : c.en}
              </option>
            ))}
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--rawaj-text)' }}>
            {isArabic ? 'الأسلوب' : 'Tone'}
          </label>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                disabled={disabled}
                className={`flex-1 min-h-[44px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tone === t.value
                    ? 'bg-[var(--rawaj-primary)] text-white'
                    : 'border text-[var(--rawaj-text)]'
                }`}
                style={
                  tone !== t.value
                    ? { borderColor: 'var(--rawaj-border)', backgroundColor: 'var(--rawaj-bg)' }
                    : undefined
                }
              >
                {isArabic ? t.ar : t.en}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--rawaj-text)' }}>
            {isArabic ? 'السعر (اختياري)' : 'Price (optional)'}
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={isArabic ? 'السعر (اختياري)' : 'Price (optional)'}
            disabled={disabled}
            className={inputCls}
            style={{
              backgroundColor: 'var(--rawaj-bg)',
              borderColor: 'var(--rawaj-border)',
              color: 'var(--rawaj-text)',
            }}
          />
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--rawaj-text)' }}>
            {isArabic ? 'الجمهور المستهدف (اختياري)' : 'Target audience (optional)'}
          </label>
          <input
            type="text"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder={isArabic ? 'الجمهور المستهدف' : 'Target audience'}
            disabled={disabled}
            className={inputCls}
            style={{
              backgroundColor: 'var(--rawaj-bg)',
              borderColor: 'var(--rawaj-border)',
              color: 'var(--rawaj-text)',
            }}
          />
        </div>
      </div>

      <button type="submit" className="hidden" />
    </form>
  )
}
