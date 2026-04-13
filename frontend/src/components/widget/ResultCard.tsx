'use client'

import { useCallback, useState } from 'react'
import type { GenerateResult } from '@/lib/api'
import type { StreamState } from '@/hooks/useStreamGeneration'

interface ResultCardProps {
  result: GenerateResult | null
  streamingTokens: string
  state: StreamState
  language: 'ar' | 'en' | 'bilingual'
}

type EditableField = 'title' | 'short_description' | 'long_description' | 'keywords' | 'seo_meta'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

function CopyButton({ text, language }: { text: string; language: 'ar' | 'en' | 'bilingual' }) {
  const [copied, setCopied] = useState(false)
  const isArabic = language !== 'en'

  const handleCopy = useCallback(async () => {
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded transition-colors"
      style={{
        backgroundColor: copied ? 'var(--rawaj-primary)' : 'var(--rawaj-border)',
        color: copied ? '#fff' : 'var(--rawaj-muted)',
      }}
    >
      {copied ? (isArabic ? '✓ تم النسخ!' : '✓ Copied!') : (isArabic ? 'نسخ' : 'Copy')}
    </button>
  )
}

export default function ResultCard({ result, streamingTokens, state, language }: ResultCardProps) {
  const isArabic = language !== 'en'

  const [editedValues, setEditedValues] = useState<Partial<Record<EditableField, string>>>({})
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [copyAllDone, setCopyAllDone] = useState(false)

  const getValue = useCallback(
    (field: EditableField): string => {
      if (editedValues[field] !== undefined) return editedValues[field]!
      if (!result) return ''
      if (field === 'keywords') return result.keywords.join(', ')
      return result[field]
    },
    [editedValues, result]
  )

  const getKeywords = useCallback((): string[] => {
    if (editedValues.keywords !== undefined) {
      return editedValues.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    }
    return result?.keywords ?? []
  }, [editedValues, result])

  const handleEdit = useCallback((field: EditableField) => {
    setEditingField(field)
  }, [])

  const handleSave = useCallback(
    (field: EditableField, value: string) => {
      setEditedValues((prev) => ({ ...prev, [field]: value }))
      setEditingField(null)
    },
    []
  )

  const handleCopyAll = useCallback(async () => {
    if (!result) return
    const formatted = [
      getValue('title'),
      getValue('short_description'),
      getValue('long_description'),
      getKeywords().join(', '),
      getValue('seo_meta'),
    ].join('\n\n')
    const ok = await copyText(formatted)
    if (ok) {
      setCopyAllDone(true)
      setTimeout(() => setCopyAllDone(false), 2000)
    }
  }, [result, getValue, getKeywords])

  if (state === 'idle' || state === 'submitting') return null

  if (state === 'streaming') {
    return (
      <div
        className="mt-6 rounded-lg p-4"
        dir={language === 'en' ? 'ltr' : 'rtl'}
        style={{
          backgroundColor: 'var(--rawaj-bg)',
          border: '1px solid var(--rawaj-border)',
          color: 'var(--rawaj-text)',
        }}
      >
        <h3 className="text-lg font-semibold mb-3">
          {isArabic ? 'جارٍ التوليد...' : 'Generating...'}
        </h3>
        <div className="whitespace-pre-wrap rawaj-cursor-blink">{streamingTokens}</div>
      </div>
    )
  }

  if ((state === 'done' || state === 'error') && result) {
    return (
      <div
        className="mt-6 rounded-lg p-4 space-y-4"
        dir={language === 'en' ? 'ltr' : 'rtl'}
        style={{
          backgroundColor: 'var(--rawaj-bg)',
          border: '1px solid var(--rawaj-border)',
          color: 'var(--rawaj-text)',
        }}
      >
        {/* Copy All */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCopyAll}
            className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: copyAllDone ? 'var(--rawaj-primary)' : 'var(--rawaj-border)',
              color: copyAllDone ? '#fff' : 'var(--rawaj-text)',
            }}
          >
            {copyAllDone
              ? isArabic ? '✓ تم النسخ!' : '✓ Copied!'
              : isArabic ? 'نسخ الكل' : 'Copy All'}
          </button>
        </div>

        {/* Title */}
        <EditableSection
          field="title"
          label={isArabic ? 'العنوان' : 'Title'}
          value={getValue('title')}
          isEditing={editingField === 'title'}
          onEdit={() => handleEdit('title')}
          onSave={(v) => handleSave('title', v)}
          onCancel={() => setEditingField(null)}
          language={language}
          bold
        />

        {/* Short Description */}
        <EditableSection
          field="short_description"
          label={isArabic ? 'الوصف القصير' : 'Short Description'}
          badge="≤160 chars"
          value={getValue('short_description')}
          isEditing={editingField === 'short_description'}
          onEdit={() => handleEdit('short_description')}
          onSave={(v) => handleSave('short_description', v)}
          onCancel={() => setEditingField(null)}
          language={language}
        />

        {/* Long Description */}
        <EditableSection
          field="long_description"
          label={isArabic ? 'الوصف الطويل' : 'Long Description'}
          badge="≤500 chars"
          value={getValue('long_description')}
          isEditing={editingField === 'long_description'}
          onEdit={() => handleEdit('long_description')}
          onSave={(v) => handleSave('long_description', v)}
          onCancel={() => setEditingField(null)}
          language={language}
          multiline
        />

        {/* Keywords */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-sm font-medium" style={{ color: 'var(--rawaj-muted)' }}>
              {isArabic ? 'الكلمات المفتاحية' : 'Keywords'}
            </label>
            <CopyButton text={getKeywords().join(', ')} language={language} />
            {editingField !== 'keywords' && (
              <button
                type="button"
                onClick={() => handleEdit('keywords')}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-muted)' }}
              >
                {isArabic ? '✎ تعديل' : '✎ Edit'}
              </button>
            )}
          </div>
          {editingField === 'keywords' ? (
            <InlineEditor
              value={getValue('keywords')}
              onSave={(v) => handleSave('keywords', v)}
              onCancel={() => setEditingField(null)}
              language={language}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {getKeywords().map((kw, i) => (
                <span
                  key={i}
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-text)' }}
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEO Meta */}
        <EditableSection
          field="seo_meta"
          label={isArabic ? 'وصف SEO' : 'SEO Meta'}
          badge="≤155 chars"
          value={getValue('seo_meta')}
          isEditing={editingField === 'seo_meta'}
          onEdit={() => handleEdit('seo_meta')}
          onSave={(v) => handleSave('seo_meta', v)}
          onCancel={() => setEditingField(null)}
          language={language}
          muted
        />
      </div>
    )
  }

  return null
}

/* ---- Helper sub-components ---- */

interface EditableSectionProps {
  field: EditableField
  label: string
  badge?: string
  value: string
  isEditing: boolean
  onEdit: () => void
  onSave: (value: string) => void
  onCancel: () => void
  language: 'ar' | 'en' | 'bilingual'
  bold?: boolean
  multiline?: boolean
  muted?: boolean
}

function EditableSection({
  label,
  badge,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  language,
  bold,
  multiline,
  muted,
}: EditableSectionProps) {
  const isArabic = language !== 'en'

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label className="text-sm font-medium" style={{ color: 'var(--rawaj-muted)' }}>
          {label}
        </label>
        {badge && (
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-muted)' }}
          >
            {badge}
          </span>
        )}
        <CopyButton text={value} language={language} />
        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs px-2 py-1 rounded"
            style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-muted)' }}
          >
            {isArabic ? '✎ تعديل' : '✎ Edit'}
          </button>
        )}
      </div>
      {isEditing ? (
        <InlineEditor
          value={value}
          onSave={onSave}
          onCancel={onCancel}
          language={language}
          multiline={multiline}
        />
      ) : (
        <p
          className={`mt-1 ${bold ? 'text-xl font-bold' : ''}`}
          style={muted ? { color: 'var(--rawaj-muted)' } : undefined}
        >
          {value}
        </p>
      )}
    </div>
  )
}

interface InlineEditorProps {
  value: string
  onSave: (value: string) => void
  onCancel: () => void
  language: 'ar' | 'en' | 'bilingual'
  multiline?: boolean
}

function InlineEditor({ value, onSave, onCancel, language, multiline }: InlineEditorProps) {
  const [draft, setDraft] = useState(value)
  const isArabic = language !== 'en'

  const inputStyle = {
    backgroundColor: 'var(--rawaj-bg)',
    borderColor: 'var(--rawaj-primary)',
    color: 'var(--rawaj-text)',
  }

  return (
    <div>
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-[var(--rawaj-primary)]"
          style={inputStyle}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border text-base focus:outline-none focus:ring-2 focus:ring-[var(--rawaj-primary)]"
          style={inputStyle}
          autoFocus
        />
      )}
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="text-xs px-3 py-1.5 rounded text-white"
          style={{ backgroundColor: 'var(--rawaj-primary)' }}
        >
          {isArabic ? 'حفظ' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs px-3 py-1.5 rounded"
          style={{ backgroundColor: 'var(--rawaj-border)', color: 'var(--rawaj-text)' }}
        >
          {isArabic ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}
