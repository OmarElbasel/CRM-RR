import { Globe, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#f8f9fc] dark:bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
          <span className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-6 block">Rawaj AI</span>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Empowering Gulf e-commerce through localized artificial intelligence and automated growth systems.
          </p>
        </div>
        <div>
          <span className="uppercase tracking-widest text-[10px] font-black text-slate-400 mb-6 block">Platform</span>
          <ul className="space-y-3">
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Product AI</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Messaging</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Analytics</a></li>
          </ul>
        </div>
        <div>
          <span className="uppercase tracking-widest text-[10px] font-black text-slate-400 mb-6 block">Company</span>
          <ul className="space-y-3">
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">About Us</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Contact Support</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Global Insights</a></li>
          </ul>
        </div>
        <div>
          <span className="uppercase tracking-widest text-[10px] font-black text-slate-400 mb-6 block">Legal</span>
          <ul className="space-y-3">
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Privacy Policy</a></li>
            <li><a href="#" className="text-slate-500 hover:text-indigo-600 transition-all text-sm">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} Rawaj AI. The Digital Majlis for Gulf E-commerce.
        </p>
        <div className="flex gap-6">
          <Globe className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600" />
          <Share2 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-indigo-600" />
        </div>
      </div>
    </footer>
  );
}
