export function LogoStrip() {
  const names = ['Shopify', 'Salla', 'Zid', 'WhatsApp', 'Instagram', 'Facebook'];
  return (
    <section className="bg-paper py-14 border-b border-ds-line">
      <div className="max-w-[1240px] mx-auto px-8 flex items-center gap-10 justify-between flex-wrap">
        <div className="text-[11.5px] text-ds-text-3 uppercase tracking-[0.14em] font-semibold">Seamlessly integrates with your stack</div>
        <div className="flex items-center gap-12 flex-1 justify-center flex-wrap opacity-[0.72]">
          {names.map(n => <span key={n} className="font-display font-bold text-lg tracking-[-0.03em] text-ds-text">{n}</span>)}
        </div>
      </div>
    </section>
  );
}
