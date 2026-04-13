'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'

interface CreateDealDialogProps {
  apiUrl: string
  onCreated: () => void
}

export function CreateDealDialog({ apiUrl, onCreated }: CreateDealDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [stage, setStage] = useState('NEW_MESSAGE')
  const [priority, setPriority] = useState('MEDIUM')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${apiUrl}/api/deals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          value: value || null,
          stage,
          priority,
          notes,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to create deal.')
        return
      }
      setTitle('')
      setValue('')
      setStage('NEW_MESSAGE')
      setPriority('MEDIUM')
      setNotes('')
      setOpen(false)
      onCreated()
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        }
      />
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New Deal</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div>
            <Label htmlFor="deal-title">Title *</Label>
            <Input
              id="deal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VIP lead from exhibition"
            />
          </div>

          <div>
            <Label htmlFor="deal-value">Value (QAR)</Label>
            <Input
              id="deal-value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <Label htmlFor="deal-stage">Stage</Label>
            <select
              id="deal-stage"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="NEW_MESSAGE">New Message</option>
              <option value="ENGAGED">Engaged</option>
              <option value="PRICE_SENT">Price Sent</option>
              <option value="ORDER_PLACED">Order Placed</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div>
            <Label htmlFor="deal-priority">Priority</Label>
            <select
              id="deal-priority"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <Label htmlFor="deal-notes">Notes</Label>
            <textarea
              id="deal-notes"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm min-h-[80px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Deal'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
