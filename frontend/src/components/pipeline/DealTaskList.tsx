'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, Plus, Circle } from 'lucide-react'

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
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks</h4>

      <div className="space-y-1 mb-3">
        {tasks.map((task) => {
          const isComplete = !!task.completed_at
          return (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group"
            >
              <button
                onClick={() => toggleTask(task.id, isComplete)}
                className="flex-shrink-0"
              >
                {isComplete ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                )}
              </button>
              <span className={`text-sm flex-1 ${isComplete ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              {task.due_at && (
                <span className="text-[10px] text-gray-400">
                  {new Date(task.due_at).toLocaleDateString()}
                </span>
              )}
            </div>
          )
        })}
        {tasks.length === 0 && (
          <p className="text-xs text-gray-400 py-2">No tasks yet</p>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Add a task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="text-sm"
        />
        <Button size="sm" variant="outline" onClick={addTask} disabled={loading}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
