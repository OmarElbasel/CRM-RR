import Link from 'next/link';
import { ArrowIcon, CheckIcon } from './landing-icons';

export function PricingCards() {
  const plans = [
    {
      n: 'Free', d: 'For merchants testing the waters.',
      p: '0', per: 'QAR / month', cta: 'Start free', hi: false,
      f: ['20 AI generations/month', '1 channel', 'Basic embed widget', 'Community support'],
    },
    {
      n: 'Starter', d: 'For new stores ready to grow.',
      p: '49', per: 'QAR / month (~$14)', cta: 'Start free', hi: false,
      f: ['200 AI generations/month', '3 channels', 'Shopify integration', 'Embed widget', 'Chat support'],
    },
    {
      n: 'Pro', d: 'For scaling brands that need the full stack.',
      p: '149', per: 'QAR / month (~$41)', cta: 'Start free', hi: true, tag: 'Most popular',
      f: ['2,000 AI generations/month', 'Unlimited channels', 'Full inbox + pipeline', 'Content scheduler', 'Priority support'],
    },
    {
      n: 'Enterprise', d: 'For large brands with custom needs.',
      p: 'Custom', per: 'Contact us', cta: 'Talk to sales', hi: false,
      f: ['Unlimited generations', 'Custom integrations', 'Dedicated support', 'SLA'],
    },
  ];
  return (
    <section id="pricing" className="bg-paper py-[96px] lg:py-[140px] relative">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="max-w-[760px] mb-14 text-center mx-auto">
          <div className="inline-flex items-center gap-2 text-[11.5px] text-ds-primary-ink uppercase tracking-[0.14em] font-semibold mb-5 justify-center">
            <span className="w-[5px] h-[5px] bg-ds-primary rounded-full" />Pricing
          </div>
          <h2 className="font-display font-medium tracking-[-0.03em] text-[40px] lg:text-[52px] leading-[1.04] m-0 text-ds-text">
            Straightforward plans. <em className="italic text-ds-primary font-normal">No</em> gotchas.
          </h2>
          <p className="mt-5 text-[17.5px] leading-[1.55] text-ds-text-2 max-w-[600px] mx-auto">
            Pay in QAR. Cancel any time. AI generations included — no metered surprises.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.n} className={`bg-white border border-ds-line rounded-[20px] p-8 flex flex-col relative ${p.hi ? 'bg-ink text-[#EDEDF2] border-ink' : ''}`}>
              {p.tag && <div className="absolute top-5 right-5 bg-ds-accent text-ds-accent-ink text-[10px] font-bold py-[3px] px-2 rounded-[5px] font-display tracking-[0.04em] uppercase">{p.tag}</div>}
              <div className={`font-display font-semibold text-sm tracking-[0.02em] uppercase ${p.hi ? 'text-ds-accent' : 'text-ds-text-2'}`}>{p.n}</div>
              <div className={`text-[13.5px] mt-2 leading-[1.45] ${p.hi ? 'text-[#A8A8BC]' : 'text-ds-text-2'}`}>{p.d}</div>
              <div className="my-8 flex items-baseline gap-1">
                <span className="font-display text-[56px] font-normal tracking-[-0.035em] leading-none">{p.p}</span>
                <span className={`text-[13px] ${p.hi ? 'text-[#A8A8BC]' : 'text-ds-text-2'}`}>{p.per}</span>
              </div>
              <div className="mt-2 mb-6">
                <Link
                  href="/sign-up"
                  className={`inline-flex items-center gap-2 h-[42px] px-[18px] rounded-[11px] text-sm font-semibold transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap w-full justify-center ${p.hi ? 'bg-ds-accent text-ds-accent-ink hover:brightness-105' : 'bg-ink text-white hover:bg-ink-2'}`}
                >
                  {p.cta} <ArrowIcon />
                </Link>
              </div>
              <ul className={`list-none m-0 pt-5 flex flex-col gap-2.5 border-t ${p.hi ? 'border-white/10' : 'border-ds-line'}`}>
                {p.f.map(fe => (
                  <li key={fe} className={`flex gap-2.5 text-[13.5px] leading-[1.45] ${p.hi ? 'text-[#E2E2ED]' : 'text-ds-text'}`}>
                    <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${p.hi ? 'bg-[rgba(200,254,94,0.18)] text-ds-accent' : 'bg-ds-primary-soft text-ds-primary-ink'}`}>
                      <CheckIcon />
                    </span>
                    {fe}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
