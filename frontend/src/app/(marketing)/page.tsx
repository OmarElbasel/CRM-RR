"use client";

import { Nav } from '@/components/marketing/LandingNav';
import { Hero } from '@/components/marketing/LandingHero';
import { LogoStrip } from '@/components/marketing/LogoStrip';
import { Pillars } from '@/components/marketing/Pillars';
import { Metrics } from '@/components/marketing/Metrics';
import { ProductDeepDive } from '@/components/marketing/ProductDeepDive';
import { UseCases } from '@/components/marketing/UseCases';
import { Testimonial } from '@/components/marketing/Testimonial';
import { Integrations } from '@/components/marketing/LandingIntegrations';
import { PricingCards } from '@/components/marketing/LandingPricing';
import { FinalCta } from '@/components/marketing/FinalCta';
import { Footer } from '@/components/marketing/LandingFooter';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="rawaj-landing">
      <Nav />
      <main>
        <Hero />
        <LogoStrip />
        <Pillars />
        <Metrics />
        <ProductDeepDive />
        <UseCases />
        <Testimonial />
        <Integrations />
        <PricingCards />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
