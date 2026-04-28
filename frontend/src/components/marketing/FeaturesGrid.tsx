"use client";

import { Sparkles, MessagesSquare, Rocket } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const coreFeatures = [
  {
    icon: Sparkles,
    title: 'AI Product Content Generator',
    desc: 'Generate high-converting product titles and descriptions in authentic Gulf Arabic dialect and professional English.',
    color: '#594fbf',
    bgColor: 'rgba(89, 79, 191, 0.1)',
  },
  {
    icon: MessagesSquare,
    title: 'Unified Social Inbox',
    desc: 'Centralize WhatsApp, Instagram, and Facebook messages into one dashboard with AI-drafted replies and intent scoring.',
    color: '#006c5c',
    bgColor: 'rgba(0, 108, 92, 0.1)',
  },
  {
    icon: Rocket,
    title: 'Order Hub & Pipeline',
    desc: 'Sync Shopify orders, track revenue by source, manage deals on a Kanban board, and recover abandoned carts via WhatsApp.',
    color: '#7000ff',
    bgColor: 'rgba(112, 0, 255, 0.1)',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function FeaturesGrid() {
  return (
    <section className="py-32 bg-[#f2f3ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-6">Built for Gulf E-Commerce</h2>
          <p className="text-lg text-[#4f5e86] max-w-2xl mx-auto font-medium">Precision-engineered tools to handle local linguistic nuances and regional e-commerce workflows.</p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {coreFeatures.map((f) => (
            <motion.div 
              key={f.title} 
              variants={cardVariants}
              whileHover={{ y: -12, boxShadow: "0 25px 50px -12px rgba(89, 79, 191, 0.15)" }}
              className="bg-white p-10 rounded-[32px] group transition-shadow duration-300 shadow-sm border border-[#a2b1dd]/10"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8"
                style={{ backgroundColor: f.bgColor }}
              >
                <f.icon className="w-7 h-7" style={{ color: f.color }} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#213156]">{f.title}</h3>
              <p className="text-[#4f5e86] leading-relaxed mb-6 font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
