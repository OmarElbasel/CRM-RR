export function UseCases() {
  const cases = [
    { name: 'Fashion boutiques', desc: 'Generate Gulf Arabic product descriptions and manage customer inquiries across Instagram and WhatsApp in one place.', stat: '3×', label: 'Faster listings' },
    { name: 'Electronics stores', desc: 'Track high-value deals from first DM to paid order. Never lose a lead in the DMs again.', stat: 'Pipeline', label: 'Visual CRM' },
    { name: 'Home & beauty brands', desc: 'Schedule Ramadan and Eid campaigns, send bulk WhatsApp broadcasts, and recover abandoned carts automatically.', stat: 'Auto', label: 'Cart recovery' },
    { name: 'Multi-channel sellers', desc: 'Sync Shopify orders, track revenue by source, and manage manual orders alongside social sales.', stat: 'Unified', label: 'Order hub' },
  ];
  return (
    <section id="usecases" className="band dark">
      <div className="container-rl">
        <div className="section-head">
          <div className="kicker"><span className="kdot" />Built for Gulf e-commerce</div>
          <h2 className="section-title">One workspace. <em>Every</em> merchant use case.</h2>
        </div>
        <div className="usecases">
          {cases.map(c => (
            <div className="uc" key={c.name}>
              <div className="uc-name">{c.name}</div>
              <div className="uc-desc">{c.desc}</div>
              <div>
                <div className="uc-stat">{c.stat}</div>
                <div className="uc-label">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
