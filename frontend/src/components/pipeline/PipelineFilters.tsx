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
    <div className="flex flex-wrap items-end gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">Platform</Label>
        <select
          className="rounded-md border border-gray-200 px-2 py-1.5 text-xs w-28"
          value={filters.platform}
          onChange={(e) => update('platform', e.target.value)}
        >
          <option value="">All</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="FACEBOOK">Facebook</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">Assignee</Label>
        <Input
          className="text-xs w-28 h-8"
          placeholder="Clerk ID"
          value={filters.assignee}
          onChange={(e) => update('assignee', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">Score Min</Label>
        <Input
          className="text-xs w-16 h-8"
          type="number"
          min="0"
          max="100"
          value={filters.score_min}
          onChange={(e) => update('score_min', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">Score Max</Label>
        <Input
          className="text-xs w-16 h-8"
          type="number"
          min="0"
          max="100"
          value={filters.score_max}
          onChange={(e) => update('score_max', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">From</Label>
        <Input
          className="text-xs w-32 h-8"
          type="date"
          value={filters.date_from}
          onChange={(e) => update('date_from', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-[10px] text-gray-500">To</Label>
        <Input
          className="text-xs w-32 h-8"
          type="date"
          value={filters.date_to}
          onChange={(e) => update('date_to', e.target.value)}
        />
      </div>

      {hasActive && (
        <Button size="sm" variant="ghost" onClick={onClear} className="h-8 gap-1 text-xs">
          <X className="w-3 h-3" /> Clear
        </Button>
      )}
    </div>
  )
}

export { EMPTY_FILTERS }
