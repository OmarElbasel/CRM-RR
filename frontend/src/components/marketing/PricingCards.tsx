"use client";

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function PricingCards() {
  return (
    <section className="py-32 bg-[#f2f3ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-4">Growth-Focused Plans</h2>
          <p className="text-[#4f5e86] font-medium">Simple, transparent pricing for stores of all sizes.</p>
        </motion.div>
        
        <motion.div 
          className="grid lg:grid-cols-4 gap-6 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
              whileHover={{ 
                y: plan.highlight ? -24 : -8, 
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              className={`p-8 rounded-[32px] flex flex-col border relative origin-bottom ${
                plan.highlight
                  ? 'bg-[#594fbf] text-white shadow-2xl lg:-translate-y-4 border-transparent z-10'
                  : 'bg-white border-[#a2b1dd]/20 text-[#213156] shadow-sm hover:shadow-md'
              }`}
            >
              {plan.highlight && (
                <motion.div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#26fedc] text-[#00483d] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
                >
                  Most Popular
                </motion.div>
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
                {plan.features.map((feature, i) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-center gap-3 text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.5 }}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${plan.highlight ? 'text-[#26fedc]' : 'text-[#006c5c]'}`} />
                    {feature}
                  </motion.li>
                ))}
              </ul>
              
              <motion.div whileTap={{ scale: 0.95 }}>
                <Link
                  href="/sign-up"
                  className={`w-full py-4 rounded-xl font-black text-center transition-all block ${
                    plan.highlight
                      ? 'bg-[#26fedc] text-[#00483d] text-lg hover:brightness-110'
                      : 'border-2 border-[#594fbf] text-[#594fbf] hover:bg-[#594fbf]/5'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
