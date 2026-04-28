import { CheckIcon, SparkIcon } from './landing-icons';

export function ProductDeepDive() {
  return (
    <section id="product" className="bg-paper-2 py-[96px] lg:py-[140px] relative">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="max-w-[760px] mb-[72px]">
          <div className="inline-flex items-center gap-2 text-[11.5px] text-ds-primary-ink uppercase tracking-[0.14em] font-semibold mb-5">
            <span className="w-[5px] h-[5px] bg-ds-primary rounded-full" />How it works
          </div>
          <h2 className="font-display font-medium tracking-[-0.03em] text-[40px] lg:text-[52px] leading-[1.04] m-0 text-ds-text">
            From setup to <em className="italic text-ds-primary font-normal">sales</em> in three steps.
          </h2>
          <p className="mt-5 text-[17.5px] leading-[1.55] text-ds-text-2 max-w-[600px]">
            Connect your store, let AI handle the heavy lifting, and watch your pipeline grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-[72px] items-center" style={{ marginBottom: 140 }}>
          <div>
            <h3 className="font-display font-medium text-[40px] leading-[1.08] tracking-[-0.03em] m-0 mb-[18px]">
              Connect your store and channels.
            </h3>
            <p className="text-ds-text-2 text-[16.5px] leading-[1.55] m-0">
              Link your Shopify, Salla, or Zid store and connect WhatsApp, Instagram, and Facebook in minutes. All your customer conversations and orders flow into one place.
            </p>
            <ul className="list-none p-0 mt-7 flex flex-col gap-3.5">
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                One-click store connection
              </li>
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                OAuth for social channels
              </li>
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                Real-time order sync
              </li>
            </ul>
          </div>
          <div className="bg-white border border-ds-line rounded-[18px] shadow-[0_40px_80px_-30px_rgba(10,10,20,0.25)] overflow-hidden">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ds-line bg-paper">
              <div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" /><div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" /><div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" />
              <div className="ml-4 text-[11.5px] text-ds-text-3 font-mono">app.rawaj.com / channels</div>
            </div>
            <div className="grid grid-cols-[180px_1fr] min-h-[420px]">
              <div className="bg-paper-2 border-r border-ds-line px-2.5 py-4">
                <div className="text-[10px] uppercase tracking-[0.12em] text-ds-text-3 font-bold px-2 pt-2.5 pb-1.5">Workspace</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Inbox</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text font-medium bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]"><span className="w-[14px] h-[14px] rounded bg-ds-primary" />Channels</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Pipeline</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Orders</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Content</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-ds-text-3 font-bold px-2 pt-2.5 pb-1.5">Store</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Shopify</div>
                <div className="flex items-center gap-2 px-2 py-[7px] rounded-md text-[12.5px] text-ds-text-2 font-medium"><span className="w-[14px] h-[14px] rounded bg-ds-line-2" />Salla</div>
              </div>
              <div className="p-5">
                <div className="flex gap-3 items-center mb-3.5">
                  <div className="w-11 h-11 rounded-xl" style={{ background: 'linear-gradient(135deg,#594fbf,#C8FE5E)' }} />
                  <div>
                    <h5 className="font-display text-[15px] font-semibold m-0 mb-[3px] tracking-[-0.01em]">Connected Channels</h5>
                    <div className="text-ds-text-2 text-xs m-0 mb-4">3 active · 1 pending</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  <div className="border border-ds-line rounded-[10px] p-3 bg-white">
                    <div className="text-[10.5px] text-ds-text-3 uppercase tracking-[0.08em] font-semibold">WhatsApp</div>
                    <div className="font-display text-[22px] font-medium tracking-[-0.02em] mt-1">Connected</div>
                  </div>
                  <div className="border border-ds-line rounded-[10px] p-3 bg-white">
                    <div className="text-[10.5px] text-ds-text-3 uppercase tracking-[0.08em] font-semibold">Instagram</div>
                    <div className="font-display text-[22px] font-medium tracking-[-0.02em] mt-1">Connected</div>
                  </div>
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-ds-text-3 font-semibold mb-2">Recent activity</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { w: 'System', t: 'Shopify store synced — 24 orders imported', c: '#C8FE5E' },
                    { w: 'WhatsApp', t: 'New message from Ahmed Al-Rashidi', c: '#25D366' },
                    { w: 'Instagram', t: 'New DM from @fashion_qtr', c: '#E4405F' },
                    { w: 'System', t: 'Facebook page connected', c: '#D9D7CE' },
                  ].map((r, i) => (
                    <div key={i} className="flex gap-2.5 items-center text-[12.5px] py-1.5">
                      <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: r.c }} />
                      <span className="font-semibold min-w-[110px]">{r.w}</span>
                      <span className="text-ds-text-2 flex-1">{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 lg:gap-[72px] items-center">
          <div className="bg-white border border-ds-line rounded-[18px] shadow-[0_40px_80px_-30px_rgba(10,10,20,0.25)] overflow-hidden order-2 lg:order-1">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ds-line bg-paper">
              <div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" /><div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" /><div className="w-[9px] h-[9px] rounded-full bg-ds-line-2" />
              <div className="ml-4 text-[11.5px] text-ds-text-3 font-mono">app.rawaj.com / generate</div>
            </div>
            <div className="p-6 bg-paper">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-[26px] h-[26px] rounded-lg bg-ds-accent flex items-center justify-center text-ds-accent-ink"><SparkIcon /></div>
                <div className="font-display text-sm font-semibold tracking-[-0.01em]">AI Product Generator</div>
                <div className="ml-auto text-[11px] text-ds-text-2 bg-white border border-ds-line py-[3px] px-2 rounded-[5px]">200 left this month</div>
              </div>
              <div className="text-[12.5px] text-ds-text-2 mb-[18px]">Generate product titles and descriptions in Gulf Arabic and English.</div>

              <div className="flex flex-col gap-2.5">
                <div className="bg-white border border-ds-line rounded-[10px] px-3.5 py-3 flex gap-3 items-start relative">
                  <div className="w-[22px] h-[22px] rounded-md bg-ds-primary-soft text-ds-primary-ink text-[11px] font-bold flex items-center justify-center font-display flex-shrink-0">1</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold tracking-[-0.01em] font-display">Enter product details</div>
                    <div className="text-xs text-ds-text-2 mt-0.5">Name, category, price, tone, and language</div>
                  </div>
                </div>
                <div className="w-px h-2.5 bg-ds-line ml-[23px]" />
                <div className="bg-white border border-ds-line rounded-[10px] px-3.5 py-3 flex gap-3 items-start relative">
                  <div className="w-[22px] h-[22px] rounded-md bg-ds-primary-soft text-ds-primary-ink text-[11px] font-bold flex items-center justify-center font-display flex-shrink-0">2</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold tracking-[-0.01em] font-display">AI generates copy</div>
                    <div className="text-xs text-ds-text-2 mt-0.5">Title, description, and SEO metadata</div>
                  </div>
                  <span className="ml-auto bg-ds-accent text-ds-accent-ink text-[10px] font-bold py-0.5 px-1.5 rounded-[5px] font-display">AI</span>
                </div>
                <div className="w-px h-2.5 bg-ds-line ml-[23px]" />
                <div className="bg-white border border-ds-line rounded-[10px] px-3.5 py-3 flex gap-3 items-start relative">
                  <div className="w-[22px] h-[22px] rounded-md bg-ds-primary-soft text-ds-primary-ink text-[11px] font-bold flex items-center justify-center font-display flex-shrink-0">3</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold tracking-[-0.01em] font-display">Review and copy</div>
                    <div className="text-xs text-ds-text-2 mt-0.5">Edit, copy, or regenerate instantly</div>
                  </div>
                </div>
                <div className="w-px h-2.5 bg-ds-line ml-[23px]" />
                <div className="bg-white border border-ds-line rounded-[10px] px-3.5 py-3 flex gap-3 items-start relative">
                  <div className="w-[22px] h-[22px] rounded-md bg-ds-primary-soft text-ds-primary-ink text-[11px] font-bold flex items-center justify-center font-display flex-shrink-0">4</div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold tracking-[-0.01em] font-display">Publish to your store</div>
                    <div className="text-xs text-ds-text-2 mt-0.5">Use the embed widget or copy manually</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="font-display font-medium text-[40px] leading-[1.08] tracking-[-0.03em] m-0 mb-[18px]">
              Generate product copy that <em className="italic text-ds-primary font-normal">converts.</em>
            </h3>
            <p className="text-ds-text-2 text-[16.5px] leading-[1.55] m-0">
              Tell Rawaj your product name, category, and tone. It drafts titles, descriptions, and SEO keywords in authentic Gulf Arabic and English — ready to publish.
            </p>
            <ul className="list-none p-0 mt-7 flex flex-col gap-3.5">
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                Gulf Arabic, English, or bilingual
              </li>
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                Professional, casual, or luxury tone
              </li>
              <li className="flex gap-3 text-[14.5px] leading-[1.5] text-ds-text">
                <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-ds-primary text-white flex items-center justify-center mt-0.5"><CheckIcon /></span>
                Embed directly on Shopify, Salla, or Zid
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
