"use client";

import { motion, Variants } from 'framer-motion';

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
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[#00efce] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              The Process
            </span>
            <h2 className="text-5xl font-extrabold text-[#213156]">
              Your Path to Scaling <br /> From Day One
            </h2>
          </motion.div>
          
          <motion.div 
            className="h-1 bg-[#d9e2ff] flex-1 mx-12 hidden md:block origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
        
        <div className="grid md:grid-cols-3 gap-16 relative">
          {steps.map((step, i) => (
            <motion.div 
              key={step.number} 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="text-[120px] font-black text-[#d9e2ff]/50 absolute -top-16 -left-4 leading-none select-none"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: (i * 0.15) + 0.2, ease: "easeOut", type: "spring", bounce: 0.4 }}
              >
                {step.number}
              </motion.div>
              <div className="relative z-10 pt-12">
                <h4 className="text-2xl font-bold mb-4 text-[#213156]">{step.title}</h4>
                <p className="text-[#4f5e86] font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
