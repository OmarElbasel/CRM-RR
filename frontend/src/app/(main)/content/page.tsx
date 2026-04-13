import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'

export default function ContentPage() {
  return (
    <>
      <PageHeader title="Content" />
      <PlaceholderFeature
        icon={<FileText />}
        title="Content"
        description="AI-generated social media content with brand voice consistency."
        phase="Phase 9"
      />
    </>
  )
}
