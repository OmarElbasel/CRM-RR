import Link from 'next/link';
import { Hero } from '@/components/marketing/Hero';
import { FeaturesGrid } from '@/components/marketing/FeaturesGrid';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { PricingCards } from '@/components/marketing/PricingCards';
import { Integrations } from '@/components/marketing/Integrations';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf8ff] font-body">
      {/* Sticky top navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#a2b1dd]/10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-[#594fbf]">Rawaj SaaS</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#594fbf] font-bold border-b-2 border-[#594fbf] pb-1 text-sm tracking-tight text-balance">
              Platform
            </Link>
            <Link href="#features" className="text-[#4f5e86] hover:text-[#594fbf] text-sm font-semibold tracking-tight transition-all">
              Features
            </Link>
            <Link href="#how-it-works" className="text-[#4f5e86] hover:text-[#594fbf] text-sm font-semibold tracking-tight transition-all">
              How it Works
            </Link>
            <Link href="#pricing" className="text-[#4f5e86] hover:text-[#594fbf] text-sm font-semibold tracking-tight transition-all">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hidden md:block text-[#4f5e86] font-semibold text-sm hover:opacity-80 transition-opacity">
              Login
            </Link>
            <Button
              render={<Link href="/sign-up" />}
              className="bg-[#594fbf] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Hero />
        
        <div id="features">
          <FeaturesGrid />
        </div>

        <HowItWorks />

        <div id="pricing">
          <PricingCards />
        </div>

        <Integrations />

        {/* Final CTA Section */}
        <section className="py-24 px-8">
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#594fbf] to-[#35279b] rounded-[40px] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl animate-fade-in">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white,_transparent)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Automate Your Store&apos;s Growth?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12">
                Join hundreds of successful Gulf retailers using Rawaj AI to dominate their niche.
              </p>
              <Link
                href="/sign-up"
                className="inline-block bg-[#26fedc] text-[#00483d] px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Start Your Free Trial Today
              </Link>
              <p className="mt-6 text-sm opacity-70 font-medium">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
