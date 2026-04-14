'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PostStatusBadge } from './PostStatusBadge'
import { PostForm } from './PostForm'
import { Camera, Film, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface PostSchedule {
  id: number
  platform: 'INSTAGRAM' | 'TIKTOK'
  content: string
  media_url: string
  scheduled_at: string
  status: 'PENDING' | 'PUBLISHED' | 'FAILED'
  published_at: string | null
  error_message: string
  created_at: string
}

export function SchedulerCalendar() {
  const { getToken } = useAuth()
  const [posts, setPosts] = useState<PostSchedule[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [platformFilter, setPlatformFilter] = useState('')
  const [editingPost, setEditingPost] = useState<PostSchedule | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostSchedule | null>(null)

  const fetchPosts = async () => {
    try {
      const token = await getToken()
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59)

      const params = new URLSearchParams({
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
      })
      if (statusFilter) params.set('status', statusFilter)
      if (platformFilter) params.set('platform', platformFilter)

      const res = await fetch(`${API_URL}/api/scheduler/posts/?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setPosts(await res.json())
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentMonth, statusFilter, platformFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: number) => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/scheduler/posts/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) fetchPosts()
    } catch {
      // silently fail
    }
  }

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)

  const getPostsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return posts.filter((p) => {
      const postDate = new Date(p.scheduled_at)
      return postDate.toDateString() === date.toDateString()
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">{monthName}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="FAILED">Failed</option>
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
            <option value="">All Platforms</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="TIKTOK">TikTok</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">{d}</div>
          ))}
          {days.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="bg-white min-h-[100px]" />
            const dayPosts = getPostsForDay(day)
            return (
              <div key={day} className="bg-white p-2 min-h-[100px]">
                <span className="text-sm font-medium">{day}</span>
                <div className="mt-1 space-y-1">
                  {dayPosts.map((post) => (
                    <Popover key={post.id}>
                      <PopoverTrigger asChild>
                        <button
                          className="w-full text-left text-xs px-1 py-0.5 rounded bg-gray-100 hover:bg-gray-200 truncate flex items-center gap-1"
                          onClick={() => setSelectedPost(post)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                            backgroundColor: post.status === 'PUBLISHED' ? '#22c55e' : post.status === 'FAILED' ? '#ef4444' : '#eab308',
                          }} />
                          {post.platform === 'INSTAGRAM' ? <Camera className="h-3 w-3" /> : <Film className="h-3 w-3" />}
                          <span className="truncate">{post.content.slice(0, 20)}...</span>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <PostStatusBadge status={post.status} />
                            <span className="text-xs text-muted-foreground">{new Date(post.scheduled_at).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm">{post.content}</p>
                          {post.error_message && <p className="text-xs text-red-600">{post.error_message}</p>}
                          <div className="flex gap-2">
                            {post.status === 'PENDING' && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => { setEditingPost(post); setDialogOpen(true) }}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(post.id)}>Delete</Button>
                              </>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle></DialogHeader>
          <PostForm
            onSuccess={() => { setDialogOpen(false); setEditingPost(null); fetchPosts() }}
            initialValues={editingPost ? {
              id: editingPost.id,
              platform: editingPost.platform,
              content: editingPost.content,
              media_url: editingPost.media_url,
              scheduled_at: editingPost.scheduled_at ? new Date(editingPost.scheduled_at).toISOString().slice(0, 16) : undefined,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
