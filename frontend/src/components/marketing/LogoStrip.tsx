export function LogoStrip() {
  const names = ['Shopify', 'Salla', 'Zid', 'WhatsApp', 'Instagram', 'Facebook'];
  return (
    <section className="logos">
      <div className="container-rl logos-inner">
        <div className="logos-label">Seamlessly integrates with your stack</div>
        <div className="logos-row">
          {names.map(n => <span key={n} className="logo-mark-text">{n}</span>)}
        </div>
      </div>
    </section>
  );
}
