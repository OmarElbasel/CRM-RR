'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'

interface NotificationBellProps {
  count?: number
  pipelineEnabled?: boolean
}

export function NotificationBell({ count: externalCount, pipelineEnabled = false }: NotificationBellProps) {
  const { unread_count, results, refresh } = useNotifications(pipelineEnabled)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = pipelineEnabled ? unread_count : (externalCount ?? 0)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleToggle() {
    if (!open && pipelineEnabled) refresh()
    setOpen(!open)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && pipelineEnabled && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
          </div>
          {results.length === 0 ? (
            <div className="p-4 text-xs text-gray-400 text-center">No notifications</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {results.slice(0, 10).map((n) => (
                <a
                  key={n.id}
                  href="/pipeline"
                  className={`block p-3 hover:bg-gray-50 ${!n.read_at ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.priority === 'HIGH' ? 'bg-red-400' : 'bg-gray-300'}`} />
                    <span className="text-xs font-medium text-gray-700 truncate">{n.title}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{n.body}</p>
                  {n.body_ar && (
                    <p className="text-[10px] text-gray-500 truncate" dir="rtl">{n.body_ar}</p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
