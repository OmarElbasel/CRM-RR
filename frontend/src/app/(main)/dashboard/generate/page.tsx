import { GeneratorForm } from '@/components/dashboard/GeneratorForm'

export default function GeneratorPage() {
  return (
    <div className="pt-24 px-8 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section from Design */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">AI Generator</h1>
          <p className="text-on-surface-variant font-body">Generate product descriptions powered by AI to boost your conversion rates.</p>
        </div>

        <GeneratorForm />
      </div>
    </div>
  )
}
