'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { isEnabled } from '@/lib/flags'
import posthog from 'posthog-js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SchedulerCalendar } from '@/components/scheduler/SchedulerCalendar'
import { BroadcastForm } from '@/components/scheduler/BroadcastForm'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Broadcast {
  id: number
  template_name: string
  status: 'DRAFT' | 'SENDING' | 'SENT' | 'FAILED'
  recipient_count: number
  sent_count: number
  failed_count: number
  sent_at: string | null
  created_at: string
}

function BroadcastStatusBadge({ status }: { status: string }) {
  if (status === 'SENT') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">Sent</span>
  if (status === 'FAILED') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Failed</span>
  if (status === 'SENDING') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Sending</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">Draft</span>
}

export default function SchedulerPage() {
  const { getToken } = useAuth()
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false)
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [broadcastsLoading, setBroadcastsLoading] = useState(false)

  if (!isEnabled('POST_SCHEDULER')) {
    return (
      <>
        <PageHeader title="Scheduler" />
        <PlaceholderFeature
          icon={<CalendarDays />}
          title="Post Scheduler"
          description="Schedule and auto-publish content across all social channels."
          phase="Phase 9"
        />
      </>
    )
  }

  const fetchBroadcasts = async () => {
    setBroadcastsLoading(true)
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/scheduler/broadcasts/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setBroadcasts(await res.json())
    } catch {
      // silently fail
    } finally {
      setBroadcastsLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Post Scheduler" description="Schedule posts and send WhatsApp broadcasts." />
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="broadcasts" onClick={fetchBroadcasts}>Broadcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <SchedulerCalendar />
        </TabsContent>
        <TabsContent value="broadcasts">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setBroadcastDialogOpen(true)}>New Broadcast</Button>
            </div>
            {broadcastsLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : broadcasts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Sent / Failed</th>
                      <th className="text-left p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcasts.map((b) => (
                      <tr key={b.id} className="border-b">
                        <td className="p-3">{b.template_name}</td>
                        <td className="p-3"><BroadcastStatusBadge status={b.status} /></td>
                        <td className="p-3">{b.sent_count} / {b.failed_count}</td>
                        <td className="p-3">{new Date(b.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Broadcast</DialogTitle></DialogHeader>
          <BroadcastForm onSuccess={() => { setBroadcastDialogOpen(false); fetchBroadcasts(); posthog.capture('scheduler_created') }} />
        </DialogContent>
      </Dialog>
    </>
  )
}
