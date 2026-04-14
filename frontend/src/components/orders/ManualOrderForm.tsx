'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface LineItem {
  title: string
  quantity: number
  price: string
}

export function ManualOrderForm({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [totalAmount, setTotalAmount] = useState('')
  const [currency, setCurrency] = useState('QAR')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ title: '', quantity: 1, price: '' }])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addItem() {
    setItems([...items, { title: '', quantity: 1, price: '' }])
  }

  function updateItem(i: number, field: keyof LineItem, value: string | number) {
    setItems(items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)))
  }

  async function submit() {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      setError('Total amount must be greater than zero')
      return
    }
    if (items.some((li) => !li.title.trim())) {
      setError('All line items need a title')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/orders/manual/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ line_items: items, total_amount: totalAmount, currency, notes }),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.detail || 'Failed to create order')
        return
      }
      setOpen(false)
      onCreated()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Manual Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Manual Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Line Items</label>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  className="border rounded px-2 py-1 text-sm flex-1"
                  placeholder="Product name"
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                />
                <input
                  className="border rounded px-2 py-1 text-sm w-16"
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
            ))}
            <button onClick={addItem} className="text-xs text-indigo-600 mt-1">
              + Add item
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Total Amount</label>
              <input
                className="border rounded px-2 py-1 text-sm w-full mt-1"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Currency</label>
              <select
                className="border rounded px-2 py-1 text-sm mt-1"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>QAR</option>
                <option>SAR</option>
                <option>USD</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="border rounded px-2 py-1 text-sm w-full mt-1"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading ? 'Creating…' : 'Create Order'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
