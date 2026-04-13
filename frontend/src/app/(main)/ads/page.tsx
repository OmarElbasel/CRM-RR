import { Megaphone } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'

export default function AdsPage() {
  return (
    <>
      <PageHeader title="Ads" />
      <PlaceholderFeature
        icon={<Megaphone />}
        title="Ads"
        description="Smart ad campaign management powered by AI targeting."
        phase="Phase 8"
      />
    </>
  )
}
