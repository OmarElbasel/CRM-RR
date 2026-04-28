export function Testimonial() {
  return (
    <section className="bg-paper py-[96px] lg:py-[140px] relative">
      <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[72px] items-start">
        <div>
          <div className="inline-flex items-center gap-2 text-[11.5px] text-ds-primary-ink uppercase tracking-[0.14em] font-semibold mb-5">
            <span className="w-[5px] h-[5px] bg-ds-primary rounded-full" />Early access feedback
          </div>
          <q className="block font-display font-normal text-[36px] leading-[1.2] tracking-[-0.02em] text-ds-text before:content-[open-quote] before:text-ds-primary before:mr-1.5 after:content-[close-quote] after:text-ds-primary after:ml-0.5">
            Rawaj cut our product listing time in half. The Gulf Arabic descriptions feel authentic — our customers notice the difference.
          </q>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-ds-primary to-ds-accent border-2 border-white shadow-[0_0_0_1px_#E7E6DF]" />
            <div>
              <div className="font-semibold text-sm tracking-[-0.01em]">Ahmad Al-Rashidi</div>
              <div className="text-[12.5px] text-ds-text-2">Founder · Boutique Riyadh</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 content-start">
          <div className="border border-ds-line rounded-[14px] p-6 bg-white">
            <div className="font-display text-[40px] font-normal tracking-[-0.03em] leading-none"><em className="text-ds-primary not-italic">50%</em></div>
            <div className="text-[12.5px] text-ds-text-2 mt-2 leading-[1.4]">Less time spent writing product copy</div>
          </div>
          <div className="border border-ds-line rounded-[14px] p-6 bg-white">
            <div className="font-display text-[40px] font-normal tracking-[-0.03em] leading-none"><em className="text-ds-primary not-italic">1 inbox</em></div>
            <div className="text-[12.5px] text-ds-text-2 mt-2 leading-[1.4]">For WhatsApp, Instagram, and Facebook DMs</div>
          </div>
          <div className="border border-ds-line rounded-[14px] p-6 bg-white">
            <div className="font-display text-[40px] font-normal tracking-[-0.03em] leading-none"><em className="text-ds-primary not-italic">Gulf Arabic</em></div>
            <div className="text-[12.5px] text-ds-text-2 mt-2 leading-[1.4]">Authentic dialect in every AI generation</div>
          </div>
          <div className="border border-ds-line rounded-[14px] p-6 bg-white">
            <div className="font-display text-[40px] font-normal tracking-[-0.03em] leading-none"><em className="text-ds-primary not-italic">Minutes</em></div>
            <div className="text-[12.5px] text-ds-text-2 mt-2 leading-[1.4]">To set up and connect your store</div>
          </div>
        </div>
      </div>
    </section>
  );
}
