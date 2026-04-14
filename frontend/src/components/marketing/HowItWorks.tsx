export function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Connect Your Store',
      desc: 'One-click integration with Salla, Zid, or Shopify. We import your entire catalog instantly without any technical friction.',
    },
    {
      number: '2',
      title: 'Let AI Heavy Lift',
      desc: 'Our models optimize your content for local search and deploy automated recovery workflows across your social channels.',
    },
    {
      number: '3',
      title: 'Track & Grow',
      desc: 'Watch your conversion rates soar. Monitor performance through our real-time Gulf-specific analytics dashboard.',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl animate-slide-up">
            <span className="text-[#00efce] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              The Process
            </span>
            <h2 className="text-5xl font-extrabold text-[#213156]">
              Your Path to Scaling <br /> From Day One
            </h2>
          </div>
          <div className="h-1 bg-[#d9e2ff] flex-1 mx-12 hidden md:block"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-16 relative">
          {steps.map((step, i) => (
            <div key={step.number} className="relative animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="text-[120px] font-black text-[#d9e2ff]/50 absolute -top-16 -left-4 leading-none select-none">
                {step.number}
              </div>
              <div className="relative z-10 pt-12">
                <h4 className="text-2xl font-bold mb-4 text-[#213156]">{step.title}</h4>
                <p className="text-[#4f5e86] font-medium">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
