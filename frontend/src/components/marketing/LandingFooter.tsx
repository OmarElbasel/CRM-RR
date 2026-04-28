export function Footer() {
  return (
    <footer className="bg-ink text-[#8A8AA0] border-t border-ds-line-dark pt-16 pb-10">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-12 mb-14">
          <div>
            <div className="flex items-center gap-2.5 font-headline font-bold text-base tracking-tight text-[#EDEDF2] mb-4">
              <span className="w-[22px] h-[22px] rounded-md relative overflow-hidden bg-gradient-to-br from-ds-accent to-ds-primary">
                <span className="absolute inset-[3px] rounded bg-ink" />
                <span className="absolute left-1/2 top-[3px] bottom-[3px] w-0.5 bg-ds-accent z-10" />
              </span>
              Rawaj
            </div>
            <p className="text-[13px] text-[#8A8AA0] leading-[1.55] max-w-[260px] m-0">
              AI-powered workspace for Gulf e-commerce. Generate Arabic product copy, unify customer messages, and track orders in one place.
            </p>
          </div>
          <div className="space-y-3">
            <div className="uppercase tracking-widest text-[10px] font-black text-[#6A6A80] mb-6 block">Product</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              <li><a href="#product" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">AI Generator</a></li>
              <li><a href="#pillars" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Inbox</a></li>
              <li><a href="#pillars" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Pipeline</a></li>
              <li><a href="#pillars" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Content</a></li>
              <li><a href="#pricing" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase tracking-widest text-[10px] font-black text-[#6A6A80] mb-6 block">Company</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              <li><a href="mailto:hello@rawaj.ai" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase tracking-widest text-[10px] font-black text-[#6A6A80] mb-6 block">Resources</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              <li><a href="/docs" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Docs</a></li>
              <li><a href="/docs" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">API</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <div className="uppercase tracking-widest text-[10px] font-black text-[#6A6A80] mb-6 block">Legal</div>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              <li><a href="/privacy" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Privacy</a></li>
              <li><a href="/terms" className="text-[13px] text-[#8A8AA0] hover:text-[#EDEDF2] transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1240px] mx-auto mt-16 pt-7 border-t border-ds-line-dark flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>&copy; {new Date().getFullYear()} Rawaj AI. Built for Gulf E-commerce.</div>
        </div>
      </div>
    </footer>
  );
}
