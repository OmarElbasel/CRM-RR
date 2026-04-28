import Link from 'next/link';
import { ArrowIcon } from './landing-icons';

export function FinalCta() {
  return (
    <section className="bg-ink text-[#EDEDF2] py-[120px] relative overflow-hidden">
      <div
        className="absolute bottom-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(200,254,94,0.22), transparent 60%)' }}
      />
      <div className="text-center relative max-w-[800px] mx-auto px-8">
        <h2 className="font-display font-normal text-[48px] lg:text-[72px] leading-[1.02] tracking-[-0.035em] m-0 text-white">
          Ready to grow your<br />Gulf e-commerce store?
        </h2>
        <p className="mt-6 text-[17px] text-[#A8A8BC] leading-[1.5]">
          Join merchants saving hours every week on product copy, customer replies, and order tracking.
        </p>
        <div className="mt-10 flex gap-2.5 justify-center flex-wrap">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 h-11 px-[18px] rounded-[11px] text-sm font-semibold transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap bg-ds-accent text-ds-accent-ink hover:brightness-105"
          >
            Start free — no card <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="mailto:hello@rawaj.ai"
            className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[11px] text-sm font-medium transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap text-[#E2E2ED] bg-transparent hover:text-white"
            style={{ borderColor: 'rgba(255,255,255,0.12)' }}
          >
            Contact sales
          </a>
        </div>
        <div className="mt-8 text-xs text-[#8A8AA0]">Free plan · No credit card · Setup in minutes</div>
      </div>
    </section>
  );
}
