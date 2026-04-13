import { CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'

export default function SchedulerPage() {
  return (
    <>
      <PageHeader title="Scheduler" />
      <PlaceholderFeature
        icon={<CalendarDays />}
        title="Scheduler"
        description="Schedule and auto-publish content across all social channels."
        phase="Phase 9"
      />
    </>
  )
}
