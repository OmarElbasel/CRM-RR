export function UseCases() {
  const cases = [
    { name: 'Fashion boutiques', desc: 'Generate Gulf Arabic product descriptions and manage customer inquiries across Instagram and WhatsApp in one place.', stat: '3×', label: 'Faster listings' },
    { name: 'Electronics stores', desc: 'Track high-value deals from first DM to paid order. Never lose a lead in the DMs again.', stat: 'Pipeline', label: 'Visual CRM' },
    { name: 'Home & beauty brands', desc: 'Schedule Ramadan and Eid campaigns, send bulk WhatsApp broadcasts, and recover abandoned carts automatically.', stat: 'Auto', label: 'Cart recovery' },
    { name: 'Multi-channel sellers', desc: 'Sync Shopify orders, track revenue by source, and manage manual orders alongside social sales.', stat: 'Unified', label: 'Order hub' },
  ];
  return (
    <section id="usecases" className="bg-ink text-[#EDEDF2] py-[140px] relative">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="max-w-[760px] mb-[72px]">
          <div className="inline-flex items-center gap-2 text-[11.5px] text-ds-accent uppercase tracking-[0.14em] font-semibold mb-5">
            <span className="w-[5px] h-[5px] bg-ds-accent rounded-full" />Built for Gulf e-commerce
          </div>
          <h2 className="font-display font-medium tracking-[-0.03em] text-[40px] lg:text-[52px] leading-[1.04] m-0 text-white">
            One workspace. <em className="italic text-ds-accent font-normal">Every</em> merchant use case.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cases.map(c => (
            <div key={c.name} className="border border-ds-line-dark rounded-[14px] p-6 bg-ink-2 text-[#EDEDF2] flex flex-col gap-3 min-h-[240px]">
              <div className="font-display font-semibold text-base tracking-[-0.01em]">{c.name}</div>
              <div className="text-[#A8A8BC] text-[13px] leading-[1.5] flex-1">{c.desc}</div>
              <div>
                <div className="font-display text-[26px] font-normal tracking-[-0.02em] text-ds-accent">{c.stat}</div>
                <div className="text-[11px] text-[#8A8AA0] uppercase tracking-[0.08em] font-semibold">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
