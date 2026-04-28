'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  GitBranch,
  ShoppingCart,
  BookOpen,
  Calendar,
  Share2,
  Settings,
  Search,
  X,
} from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
}

const NAV_ITEMS: CommandItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, action: () => {} },
  { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, action: () => {} },
  { id: 'pipeline', label: 'Pipeline', icon: <GitBranch className="w-4 h-4" />, action: () => {} },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" />, action: () => {} },
  { id: 'content', label: 'Content', icon: <BookOpen className="w-4 h-4" />, action: () => {} },
  { id: 'scheduler', label: 'Scheduler', icon: <Calendar className="w-4 h-4" />, action: () => {} },
  { id: 'channels', label: 'Channels', icon: <Share2 className="w-4 h-4" />, action: () => {} },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => {} },
]

const ROUTES: Record<string, string> = {
  dashboard: '/dashboard',
  inbox: '/inbox',
  pipeline: '/pipeline',
  orders: '/orders',
  content: '/content',
  scheduler: '/scheduler',
  channels: '/channels',
  settings: '/settings',
}

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items = NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % items.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + items.length) % items.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[selectedIndex]
        if (item) {
          router.push(ROUTES[item.id])
          onOpenChange(false)
          setQuery('')
        }
      } else if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, items, selectedIndex, router, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-lg bg-white rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.15)] overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ds-line">
          <Search className="w-4 h-4 text-ds-text-3" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-sm text-ds-text placeholder:text-ds-text-3 outline-none"
            placeholder="Search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="text-[10px] bg-paper-2 border border-ds-line rounded px-1.5 py-0.5 text-ds-text-3">ESC</kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-ds-text-2">No results found.</div>
          ) : (
            items.map((item, index) => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  index === selectedIndex ? 'bg-ds-primary/10 text-ds-primary' : 'text-ds-text hover:bg-paper-2'
                }`}
                onClick={() => {
                  router.push(ROUTES[item.id])
                  onOpenChange(false)
                  setQuery('')
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
