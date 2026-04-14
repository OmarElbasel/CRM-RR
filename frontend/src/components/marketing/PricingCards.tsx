import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '0',
    currency: 'QAR',
    features: ['10 AI Descriptions', 'Unified Inbox Lite'],
    buttonText: 'Get Started',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '49',
    currency: 'QAR',
    features: ['100 AI Descriptions', 'Full Unified Inbox', '5 Recovery Flows'],
    buttonText: 'Start Trial',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '149',
    currency: 'QAR',
    features: [
      'Unlimited AI Content',
      'VIP Response Automation',
      'Advanced Analytics',
      'Priority Support',
    ],
    buttonText: 'Go Pro Now',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    currency: '',
    desc: 'For large retail chains',
    features: ['Custom Dialect Training', 'Dedicated Account Manager', 'API Access'],
    buttonText: 'Contact Sales',
    highlight: false,
  },
];

export function PricingCards() {
  return (
    <section className="py-32 bg-[#f2f3ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-4">Growth-Focused Plans</h2>
          <p className="text-[#4f5e86] font-medium">Simple, transparent pricing for stores of all sizes.</p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`p-8 rounded-[32px] flex flex-col border transition-all duration-300 animate-fade-in ${
                plan.highlight
                  ? 'bg-[#594fbf] text-white shadow-2xl relative lg:-translate-y-4 border-transparent'
                  : 'bg-white border-[#a2b1dd]/20 text-[#213156] shadow-sm hover:shadow-md'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#26fedc] text-[#00483d] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.currency && (
                    <span className={`text-sm font-bold ml-2 ${plan.highlight ? 'opacity-80' : 'text-[#4f5e86]'}`}>
                      {plan.currency} / mo
                    </span>
                  )}
                </div>
                {plan.desc && <p className="text-xs font-bold mt-1 opacity-70">{plan.desc}</p>}
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className={`w-5 h-5 ${plan.highlight ? 'text-[#26fedc]' : 'text-[#006c5c]'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`w-full py-4 rounded-xl font-black text-center transition-all ${
                  plan.highlight
                    ? 'bg-[#26fedc] text-[#00483d] text-lg hover:brightness-110'
                    : 'border-2 border-[#594fbf] text-[#594fbf] hover:bg-[#594fbf]/5'
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
