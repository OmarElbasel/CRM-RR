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
    <section className="bg-paper-2 py-[100px] relative">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="mb-12 max-w-full flex justify-between items-end gap-8 flex-wrap" style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 560 }}>
            <div className="inline-flex items-center gap-2 text-[11.5px] text-ds-primary-ink uppercase tracking-[0.14em] font-semibold mb-5">
              <span className="w-[5px] h-[5px] bg-ds-primary rounded-full" />Integrations
            </div>
            <h2 className="font-display font-medium tracking-[-0.03em] text-[42px] leading-[1.04] m-0 text-ds-text">
              Connect your store and channels in minutes.
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {tools.map(t => (
            <div key={t.n} className="aspect-[1.4/1] border border-ds-line rounded-xl flex items-center justify-center bg-white flex-col gap-1.5 text-ds-text-2 text-xs font-medium tracking-[-0.01em] transition-all duration-150 hover:border-ds-line-2 hover:text-ds-text hover:-translate-y-px">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display tracking-[-0.02em]" style={{ background: t.c, color: '#fff' }}>{t.i}</span>
              {t.n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
