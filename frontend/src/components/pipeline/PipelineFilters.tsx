'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export interface FilterValues {
  platform: string
  assignee: string
  score_min: string
  score_max: string
  date_from: string
  date_to: string
}

interface PipelineFiltersProps {
  filters: FilterValues
  onChange: (filters: FilterValues) => void
  onClear: () => void
}

const EMPTY_FILTERS: FilterValues = {
  platform: '',
  assignee: '',
  score_min: '',
  score_max: '',
  date_from: '',
  date_to: '',
}

export function PipelineFilters({ filters, onChange, onClear }: PipelineFiltersProps) {
  function update(key: keyof FilterValues, value: string) {
    onChange({ ...filters, [key]: value })
  }

  const hasActive = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center gap-4 border border-outline-variant/30">
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Platform</label>
        <select
          className="text-xs bg-surface border border-outline-variant/50 rounded p-1.5 focus:ring-primary focus:border-primary outline-none"
          value={filters.platform}
          onChange={(e) => update('platform', e.target.value)}
        >
          <option value="">All Platforms</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="TIKTOK">TikTok</option>
          <option value="SNAPCHAT">Snapchat</option>
          <option value="WHATSAPP">WhatsApp</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Assignee</label>
        <div className="relative flex items-center">
            <input
            className="text-xs bg-surface border border-outline-variant/50 rounded p-1.5 w-full focus:ring-primary focus:border-primary outline-none pr-7"
            placeholder="Everyone"
            value={filters.assignee}
            onChange={(e) => update('assignee', e.target.value)}
            />
            {filters.assignee && (
                <button onClick={() => update('assignee', '')} className="absolute right-2 top-1.5 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Score Range</label>
        <div className="flex items-center gap-2">
          <input
            className="w-16 text-xs bg-surface border border-outline-variant/50 rounded p-1.5 focus:ring-primary focus:border-primary outline-none"
            type="number"
            placeholder="Min"
            value={filters.score_min}
            onChange={(e) => update('score_min', e.target.value)}
          />
          <span className="text-xs text-on-surface-variant">to</span>
          <input
            className="w-16 text-xs bg-surface border border-outline-variant/50 rounded p-1.5 focus:ring-primary focus:border-primary outline-none"
            type="number"
            placeholder="Max"
            min="0"
            max="100"
            value={filters.score_max}
            onChange={(e) => update('score_max', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-[160px]">
        <label className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Date Range</label>
        <div className="flex items-center gap-2">
            <div className="relative flex items-center flex-1">
                <input
                    className="text-xs bg-surface border border-outline-variant/50 rounded p-1.5 w-full pl-8 focus:ring-primary focus:border-primary outline-none"
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => update('date_from', e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-2 text-sm text-on-surface-variant pointer-events-none">calendar_today</span>
            </div>
            <span className="text-xs text-on-surface-variant">to</span>
            <input
                className="text-xs bg-surface border border-outline-variant/50 rounded p-1.5 flex-1 focus:ring-primary focus:border-primary outline-none"
                type="date"
                value={filters.date_to}
                onChange={(e) => update('date_to', e.target.value)}
            />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {hasActive && (
            <button 
                onClick={onClear} 
                className="p-2 rounded hover:bg-surface-container-highest text-error transition-colors flex items-center gap-1 text-xs font-bold"
            >
                <span className="material-symbols-outlined text-lg">filter_alt_off</span>
            </button>
        )}
        <button className="p-2 rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-lg">refresh</span>
        </button>
        <button className="p-2 rounded hover:bg-surface-container-highest text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      </div>
    </div>
  )
}

export { EMPTY_FILTERS }
