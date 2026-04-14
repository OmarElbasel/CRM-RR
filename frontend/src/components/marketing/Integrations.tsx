import { Megaphone, Podcast as Music, Camera } from 'lucide-react';

export function Integrations() {
  const integrations = [
    {
      name: 'Shopify',
      icon: (
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7osIKbYdTz72ASLX9jUhDVGpsADurD36jXmFzpzX-eagMKhBfYhRUkTGgN9l61wP-1-XvPPuMRtQxsmLtxgGv_z3T6vPaxvUpp3moX87CIYDJXlqKTPD1Gtq6Tl_E_COmrVSsfysK38EC9Ixn6HYMRHFbsQ9M1cOrwNECChvcb71iasktKGEDTyEgsYfsokPZzeKkM1hdifIkjscZLMUD7l6R7pyuJMIzKeyKG2KY6eVz5EX4JBwQOtO7ub4rypo6UUJqw4zGTxoa"
          alt="Shopify"
          className="w-full h-auto"
        />
      ),
    },
    {
      name: 'Meta Ads',
      icon: <Megaphone className="w-10 h-10 text-slate-400 group-hover:text-blue-600 transition-colors" />,
    },
    {
      name: 'TikTok Marketing',
      icon: <Music className="w-10 h-10 text-slate-400 group-hover:text-black transition-colors" />,
    },
    {
      name: 'WhatsApp',
      icon: (
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4NylBlBrReW31O75ZQmsEwTnDy-k5uWzDoVRXVYzZnjm25jDYfXoq0TBaHgoIKP0cuogHHUMB2ynm3y5AQ2o08lvsRlTD8W87iRO8yt4eHI8M5FxRO0v1_nDwJ0zy9c_aNGgyDlR4Pyjb9xK1i1wAeSHMGawvDtgiNPR6v9TB-A5IKxnTYWq4lPyApNs-1ySPIQXnLgfBpFDwnWUmDPdTWhbQqqH_yZvVZW4abyTGDq0qElBV6F2gm__Cv3ViWmZsfsYHJLCj6Y_e"
          alt="WhatsApp"
          className="w-full h-auto"
        />
      ),
    },
    {
      name: 'Instagram',
      icon: <Camera className="w-10 h-10 text-slate-400 group-hover:text-pink-600 transition-colors" />,
    },
  ];

  return (
    <section className="py-24 bg-white border-y border-[#e2e7ff]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-4">
            Works natively with your existing tools
          </h2>
          <p className="text-xl text-[#4f5e86] font-medium">Seamlessly integrates with your stack</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {integrations.map((item, i) => (
            <div
              key={item.name}
              className="bg-white p-8 rounded-2xl border border-[#a2b1dd]/10 flex flex-col items-center justify-center gap-4 hover:shadow-lg transition-all group animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-16 h-16 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                {item.icon}
              </div>
              <span className="font-bold text-sm text-[#213156] group-hover:text-[#594fbf] transition-colors text-center">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
