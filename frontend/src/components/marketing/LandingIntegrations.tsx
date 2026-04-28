import { ArrowIcon } from './landing-icons';

export function Integrations() {
  const tools = [
    { n: 'Shopify', c: '#96BF48', i: 'S' },
    { n: 'Salla', c: '#801DFF', i: 'Sa' },
    { n: 'Zid', c: '#9B51E0', i: 'Z' },
    { n: 'WhatsApp', c: '#25D366', i: 'W' },
    { n: 'Instagram', c: '#E4405F', i: 'IG' },
    { n: 'Facebook', c: '#1877F2', i: 'f' },
  ];
  return (
    <section className="band paper" style={{ paddingTop: 100, paddingBottom: 100 }}>
      <div className="container-rl">
        <div className="section-head" style={{ marginBottom: 48, maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 560 }}>
            <div className="kicker"><span className="kdot" />Integrations</div>
            <h2 className="section-title" style={{ fontSize: 42 }}>Connect your store and channels in minutes.</h2>
          </div>
        </div>
        <div className="integ-grid">
          {tools.map(t => (
            <div className="ilogo" key={t.n}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: t.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Inter Tight', letterSpacing: '-0.02em' }}>{t.i}</span>
              {t.n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
