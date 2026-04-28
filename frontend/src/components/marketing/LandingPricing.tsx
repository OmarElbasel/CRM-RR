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
    <section id="pricing" className="band light">
      <div className="container-rl">
        <div className="section-head" style={{ textAlign: 'center', margin: '0 auto 56px' }}>
          <div className="kicker" style={{ justifyContent: 'center' }}><span className="kdot" />Pricing</div>
          <h2 className="section-title">Straightforward plans. <em>No</em> gotchas.</h2>
          <p className="section-lede" style={{ margin: '20px auto 0' }}>Pay in QAR. Cancel any time. AI generations included — no metered surprises.</p>
        </div>
        <div className="pricing-rl">
          {plans.map(p => (
            <div key={p.n} className={`plan ${p.hi ? 'hi' : ''}`}>
              {p.tag && <div className="p-tag">{p.tag}</div>}
              <div className="p-name">{p.n}</div>
              <div className="p-desc">{p.d}</div>
              <div className="p-price">
                <span className="n">{p.p}</span>
                <span className="u">{p.per}</span>
              </div>
              <div className="p-cta">
                <Link href="/sign-up" className={`btn-rl ${p.hi ? 'btn-primary' : 'btn-dark'}`}>{p.cta} <ArrowIcon /></Link>
              </div>
              <ul className="feats">
                {p.f.map(fe => (
                  <li key={fe}><span className="tk"><CheckIcon /></span>{fe}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
