'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface DealTaskData {
  id: number
  title: string
  description: string
  due_at: string | null
  completed_at: string | null
  assigned_to: { clerk_user_id: string; name: string }
}

interface DealTaskListProps {
  dealId: number
  tasks: DealTaskData[]
  apiUrl: string
  onUpdate: () => void
}

export function DealTaskList({ dealId, tasks, apiUrl, onUpdate }: DealTaskListProps) {
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(false)

  async function addTask() {
    if (!newTitle.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/deals/${dealId}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle.trim() }),
      })
      if (res.ok) {
        setNewTitle('')
        onUpdate()
      }
    } finally {
      setLoading(false)
    }
  }

  async function toggleTask(taskId: number, isComplete: boolean) {
    await fetch(`${apiUrl}/api/tasks/${taskId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ completed: !isComplete }),
    })
    onUpdate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-secondary text-[20px]">assignment</span>
        <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface">Precision Task List</h3>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const isComplete = !!task.completed_at
          return (
            <div
              key={task.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 transition-all group"
            >
              <button
                onClick={() => toggleTask(task.id, isComplete)}
                className="flex-shrink-0 flex items-center justify-center"
              >
                {isComplete ? (
                  <span className="material-symbols-outlined text-primary text-[24px]">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-outline-variant text-[24px] group-hover:text-primary transition-colors">radio_button_unchecked</span>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isComplete ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                  {task.title}
                </p>
                {task.due_at && (
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">
                    Due {new Date(task.due_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
        {tasks.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-outline-variant rounded-3xl">
            <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">No Active Tasks</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 bg-surface-container rounded-2xl p-3 border border-outline-variant/30">
        <span className="material-symbols-outlined text-on-secondary-container/50 ml-2">add_task</span>
        <input
          placeholder="Provision a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-on-surface placeholder:text-on-surface-variant/50 h-10"
        />
        <button 
          onClick={addTask} 
          disabled={loading || !newTitle.trim()}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-dim disabled:opacity-50 disabled:shadow-none transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  )
}
