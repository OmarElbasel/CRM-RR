import { BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" />
      <PlaceholderFeature
        icon={<BarChart3 />}
        title="Analytics"
        description="Revenue analytics, customer insights, and AI performance tracking."
        phase="Phase 8"
      />
    </>
  )
}
