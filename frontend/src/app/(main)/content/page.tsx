import { FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaceholderFeature } from '@/components/ui/PlaceholderFeature'
import { isEnabled } from '@/lib/flags'
import { CaptionGenerator } from '@/components/content/CaptionGenerator'
import { AdCopyWriter } from '@/components/content/AdCopyWriter'
import { BroadcastComposer } from '@/components/content/BroadcastComposer'
import { SeasonalTemplateGallery } from '@/components/content/SeasonalTemplateGallery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ContentPage() {
  if (!isEnabled('CONTENT_ASSISTANT')) {
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

  return (
    <>
      <PageHeader title="Content Assistant" />
      <Tabs defaultValue="captions">
        <TabsList>
          <TabsTrigger value="captions">Captions</TabsTrigger>
          <TabsTrigger value="ad-copy">Ad Copy</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>
        <TabsContent value="captions"><CaptionGenerator /></TabsContent>
        <TabsContent value="ad-copy"><AdCopyWriter /></TabsContent>
        <TabsContent value="broadcast"><BroadcastComposer /></TabsContent>
      </Tabs>
      <details className="mt-6">
        <summary className="cursor-pointer font-medium">Seasonal Templates</summary>
        <SeasonalTemplateGallery onSelect={() => {}} />
      </details>
    </>
  )
}
