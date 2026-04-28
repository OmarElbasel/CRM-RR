import Link from 'next/link';
import { ArrowIcon } from './landing-icons';

export function FinalCta() {
  return (
    <section className="final">
      <div className="final-glow" />
      <div className="container-rl final-inner">
        <h2>Ready to grow your<br />Gulf e-commerce store?</h2>
        <p>Join merchants saving hours every week on product copy, customer replies, and order tracking.</p>
        <div className="final-ctas">
          <Link href="/sign-up" className="btn-rl btn-lg btn-primary">Start free — no card <ArrowIcon /></Link>
          <a href="mailto:hello@rawaj.ai" className="btn-rl btn-lg btn-ghost" style={{ color: '#E2E2ED', borderColor: 'var(--line-dark-2)' }}>Contact sales</a>
        </div>
        <div style={{ marginTop: 32, fontSize: 12, color: '#8A8AA0' }}>Free plan · No credit card · Setup in minutes</div>
      </div>
    </section>
  );
}
