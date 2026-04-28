export function Footer() {
  return (
    <footer className="foot-rl">
      <div className="container-rl">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ color: '#EDEDF2', marginBottom: 16 }}><span className="logo-mark" />Rawaj</div>
            <p style={{ fontSize: 13, color: '#8A8AA0', lineHeight: 1.55, maxWidth: 260, margin: 0 }}>
              AI-powered workspace for Gulf e-commerce. Generate Arabic product copy, unify customer messages, and track orders in one place.
            </p>
          </div>
          <div className="foot-grp">
            <div className="fh">Product</div>
            <ul>
              <li><a href="#product">AI Generator</a></li>
              <li><a href="#pillars">Inbox</a></li>
              <li><a href="#pillars">Pipeline</a></li>
              <li><a href="#pillars">Content</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="foot-grp">
            <div className="fh">Company</div>
            <ul>
              <li><a href="mailto:hello@rawaj.ai">Contact</a></li>
            </ul>
          </div>
          <div className="foot-grp">
            <div className="fh">Resources</div>
            <ul>
              <li><a href="/docs">Docs</a></li>
              <li><a href="/docs">API</a></li>
            </ul>
          </div>
          <div className="foot-grp">
            <div className="fh">Legal</div>
            <ul>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div>&copy; {new Date().getFullYear()} Rawaj AI. Built for Gulf E-commerce.</div>
        </div>
      </div>
    </footer>
  );
}
