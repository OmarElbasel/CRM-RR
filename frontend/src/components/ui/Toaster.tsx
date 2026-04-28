'use client'

import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-[10px] border shadow-lg text-sm font-medium min-w-[280px] ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-ds-line text-ds-text'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
          {t.type === 'info' && <Info className="w-4 h-4 text-ds-primary" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="p-1 hover:bg-black/5 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
