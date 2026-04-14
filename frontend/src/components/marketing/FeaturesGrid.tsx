import { Sparkles, MessagesSquare, Rocket } from 'lucide-react';

const coreFeatures = [
  {
    icon: Sparkles,
    title: 'AI Product Content Generator',
    desc: 'Generate high-converting descriptions in Gulf Arabic, Khaleeji, and MSA dialects instantly.',
    color: '#594fbf',
    bgColor: 'rgba(89, 79, 191, 0.1)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF-00IaSrtx5VMggQjBOXbUTHbHrS82V4wsjNT5rgST3R0hXz75Y5MgMUlQkpGcL3RQDTmqqW0Y0KZB6n5_ec6DOtkvLc4Spy4Abko0ixukolCH5pvLA7HuIWlNjIFrTLncL4zeF8encZlBhQ3MCTgr-sotDgY01sTOuWcceuj_3S-cQ03-FbB2KCipFV6hzpq2xwe4f85_UrUwjEIF-9NgGwO8EVdIDuFeCAwxI4_KwZIIUMCOZuyCXwcCB7HCqv-JDIcsxLUjJD-',
  },
  {
    icon: MessagesSquare,
    title: 'Unified Social Inbox',
    desc: 'Centralize WhatsApp, Instagram, and Meta messages into one high-speed dashboard.',
    color: '#006c5c',
    bgColor: 'rgba(0, 108, 92, 0.1)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW9y7CiR5xmJpSNNiSNBloyWaXaY9HBv8ltJCKkfqwYhgiJvX5Qz64OEKW8FulPaz-pWIAQAqDUkeae32sEsHuJ5TV8Ml1OefEylSURnxJQtQYXyTXxh6UwlHz_rBK9hjO5STbR_w1osnjO1RBms--4L83Q6idHNPxfvIzFTqLOzlJ93105XbogXTl_hpllSTRzYUhPE_HhtiPrvXI1sKGtNSQq6hWBu30WaPEwIGw8lYw77QMxBzg60AbbF-KOc848wfVC7Ks8zRK',
  },
  {
    icon: Rocket,
    title: 'Automated Revenue Engine',
    desc: 'Automated recovery of abandoned carts through hyper-personalized regional messaging.',
    color: '#7000ff',
    bgColor: 'rgba(112, 0, 255, 0.1)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8BYtzRgJMFe3qK7MIoDdXyRF8ocnchdbBdfE4aGqfaI-wxVymtZ_oDw70bem0dQXR0uz9Fv-7b--3L1VTGVt9ZFEaxSlBmC0eiN5H21u-QvI7OX3Sp58HW2a1kzUULcYUaQwXMm2DAQfkiqIaM2Ipgo9NDPlStICeo3IUSPbGs4Z9yIcOC05yJ3FUNmqkeyHpo9nQ4qEe7ed4Y0IVYavw0SlZ6tWIhzpAVWAURg99nsBj9L5Xy0G5Ag-0EAIrPJ4cNnpSkqFGPlm_',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-32 bg-[#f2f3ff]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-6">Built for Gulf Market Dominance</h2>
          <p className="text-lg text-[#4f5e86] max-w-2xl mx-auto font-medium">Precision-engineered tools to handle local linguistic nuances and regional e-commerce workflows.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {coreFeatures.map((f, i) => (
            <div 
              key={f.title} 
              className="bg-white p-10 rounded-[32px] group hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl border border-[#a2b1dd]/10 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-300"
                style={{ backgroundColor: f.bgColor }}
              >
                <f.icon className="w-7 h-7" style={{ color: f.color }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#213156]">{f.title}</h3>
              <p className="text-[#4f5e86] leading-relaxed mb-6 font-medium">{f.desc}</p>
              <div className="h-40 w-full rounded-2xl bg-[#eaedff] overflow-hidden relative">
                <img 
                  src={f.image} 
                  alt={f.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
