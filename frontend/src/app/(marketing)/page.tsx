import Link from 'next/link'
import { Hero } from '@/components/marketing/Hero'
import { FeaturesGrid } from '@/components/marketing/FeaturesGrid'
import { PricingCards } from '@/components/marketing/PricingCards'
import { Footer } from '@/components/marketing/Footer'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Sticky top navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Rawaj</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Button
              render={<Link href="/sign-up" />}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              Start for free
            </Button>
          </nav>
        </div>
      </header>

      {/* Push content below fixed header */}
      <div className="pt-16">
        <Hero />
        <FeaturesGrid />
        <PricingCards />
        <Footer />
      </div>
    </div>
  )
}
