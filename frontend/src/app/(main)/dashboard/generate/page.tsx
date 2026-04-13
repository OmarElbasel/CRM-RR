import { PageHeader } from '@/components/ui/PageHeader'
import { GeneratorForm } from '@/components/dashboard/GeneratorForm'

export default function GeneratorPage() {
  return (
    <>
      <PageHeader
        title="AI Generator"
        subtitle="Generate product descriptions powered by AI"
      />
      <GeneratorForm />
    </>
  )
}
