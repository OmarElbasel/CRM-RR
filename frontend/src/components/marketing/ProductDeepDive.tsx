import { CheckIcon, SparkIcon } from './landing-icons';

export function ProductDeepDive() {
  return (
    <section id="product" className="band paper">
      <div className="container-rl">
        <div className="section-head">
          <div className="kicker"><span className="kdot" />How it works</div>
          <h2 className="section-title">From setup to <em>sales</em> in three steps.</h2>
          <p className="section-lede">Connect your store, let AI handle the heavy lifting, and watch your pipeline grow.</p>
        </div>

        <div className="deep" style={{ marginBottom: 140 }}>
          <div>
            <h3>Connect your store and channels.</h3>
            <p>Link your Shopify, Salla, or Zid store and connect WhatsApp, Instagram, and Facebook in minutes. All your customer conversations and orders flow into one place.</p>
            <ul>
              <li><span className="tick"><CheckIcon /></span>One-click store connection</li>
              <li><span className="tick"><CheckIcon /></span>OAuth for social channels</li>
              <li><span className="tick"><CheckIcon /></span>Real-time order sync</li>
            </ul>
          </div>
          <div className="frame">
            <div className="frame-head">
              <div className="frame-dot" /><div className="frame-dot" /><div className="frame-dot" />
              <div className="frame-url">app.rawaj.com / channels</div>
            </div>
            <div className="dash">
              <div className="dash-side">
                <div className="grp">Workspace</div>
                <div className="item"><span className="d" />Inbox</div>
                <div className="item on"><span className="d" />Channels</div>
                <div className="item"><span className="d" />Pipeline</div>
                <div className="item"><span className="d" />Orders</div>
                <div className="item"><span className="d" />Content</div>
                <div className="grp">Store</div>
                <div className="item"><span className="d" />Shopify</div>
                <div className="item"><span className="d" />Salla</div>
              </div>
              <div className="dash-main">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#594fbf,#C8FE5E)' }} />
                  <div>
                    <h5>Connected Channels</h5>
                    <div className="dash-sub">3 active · 1 pending</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 12, background: '#fff' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>WhatsApp</div>
                    <div style={{ fontFamily: 'Inter Tight', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Connected</div>
                  </div>
                  <div style={{ border: '1px solid var(--line)', borderRadius: 10, padding: 12, background: '#fff' }}>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Instagram</div>
                    <div style={{ fontFamily: 'Inter Tight', fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Connected</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', fontWeight: 600, marginBottom: 8 }}>Recent activity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { w: 'System', t: 'Shopify store synced — 24 orders imported', c: 'var(--accent)' },
                    { w: 'WhatsApp', t: 'New message from Ahmed Al-Rashidi', c: '#25D366' },
                    { w: 'Instagram', t: 'New DM from @fashion_qtr', c: '#E4405F' },
                    { w: 'System', t: 'Facebook page connected', c: 'var(--line-2)' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5, padding: '6px 0' }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: r.c, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, minWidth: 110 }}>{r.w}</span>
                      <span style={{ color: 'var(--text-2)', flex: 1 }}>{r.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="deep flip">
          <div className="frame">
            <div className="frame-head">
              <div className="frame-dot" /><div className="frame-dot" /><div className="frame-dot" />
              <div className="frame-url">app.rawaj.com / generate</div>
            </div>
            <div style={{ padding: 24, background: 'var(--paper)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)' }}><SparkIcon /></div>
                <div style={{ fontFamily: 'Inter Tight', fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>AI Product Generator</div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-2)', background: '#fff', border: '1px solid var(--line)', padding: '3px 8px', borderRadius: 5 }}>200 left this month</div>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 18 }}>Generate product titles and descriptions in Gulf Arabic and English.</div>

              <div className="flow">
                <div className="step">
                  <div className="num">1</div>
                  <div style={{ flex: 1 }}>
                    <div className="t">Enter product details</div>
                    <div className="d">Name, category, price, tone, and language</div>
                  </div>
                </div>
                <div className="step-conn" />
                <div className="step">
                  <div className="num">2</div>
                  <div style={{ flex: 1 }}>
                    <div className="t">AI generates copy</div>
                    <div className="d">Title, description, and SEO metadata</div>
                  </div>
                  <span className="tag-ai">AI</span>
                </div>
                <div className="step-conn" />
                <div className="step">
                  <div className="num">3</div>
                  <div style={{ flex: 1 }}>
                    <div className="t">Review and copy</div>
                    <div className="d">Edit, copy, or regenerate instantly</div>
                  </div>
                </div>
                <div className="step-conn" />
                <div className="step">
                  <div className="num">4</div>
                  <div style={{ flex: 1 }}>
                    <div className="t">Publish to your store</div>
                    <div className="d">Use the embed widget or copy manually</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3>Generate product copy that <em>converts.</em></h3>
            <p>Tell Rawaj your product name, category, and tone. It drafts titles, descriptions, and SEO keywords in authentic Gulf Arabic and English — ready to publish.</p>
            <ul>
              <li><span className="tick"><CheckIcon /></span>Gulf Arabic, English, or bilingual</li>
              <li><span className="tick"><CheckIcon /></span>Professional, casual, or luxury tone</li>
              <li><span className="tick"><CheckIcon /></span>Embed directly on Shopify, Salla, or Zid</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
