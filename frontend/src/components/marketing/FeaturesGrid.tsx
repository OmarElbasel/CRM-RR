import { Sparkles, Globe, Code2 } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Generation',
    description: 'Auto-generates compelling product titles and descriptions optimized for e-commerce conversion.',
  },
  {
    icon: Globe,
    title: 'Gulf Arabic Support',
    description: 'Native Gulf-dialect Arabic output tailored for Saudi, Qatari, and Emirati consumers.',
  },
  {
    icon: Code2,
    title: 'Embed Anywhere',
    description: 'One-line script install on Shopify, Salla, or Zid. Works with any storefront.',
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-20 px-6 bg-white" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-indigo-600 text-sm font-semibold tracking-widest uppercase mb-3">Why Rawaj</p>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
            Everything you need to sell more
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Rawaj combines AI generation, Gulf Arabic expertise, and simple installation to boost your product listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 cursor-default">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
