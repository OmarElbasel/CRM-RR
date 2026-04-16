"use client";

import { Megaphone, Podcast as Music, Camera } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

export function Integrations() {
  const integrations = [
    {
      name: 'Shopify',
      icon: (
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ58f__Hs5QwGWIEcsawDwW1o5IQzaYNPONhQ&s"
          alt="Shopify"
          className="w-10 h-10 object-contain"
        />
      ),
    },
    {
      name: 'Meta Ads',
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
          alt="Meta"
          className="w-10 h-10 object-contain"
        />
      ),
    },
    {
      name: 'TikTok',
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
          alt="TikTok"
          className="w-10 h-10 object-contain"
        />
      ),
    },
    {
      name: 'WhatsApp',
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-10 h-10 object-contain"
        />
      ),
    },
    {
      name: 'Instagram',
      icon: (
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
          alt="Instagram"
          className="w-10 h-10 object-contain"
        />
      ),
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <section className="py-24 bg-white border-y border-[#e2e7ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#213156] mb-4">
            Works natively with your existing tools
          </h2>
          <p className="text-xl text-[#4f5e86] font-medium">Seamlessly integrates with your stack</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {integrations.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              className="bg-white p-8 rounded-2xl border border-[#a2b1dd]/10 flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-20px_rgba(89,79,191,0.2)] transition-shadow duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center transition-all duration-300">
                {item.icon}
              </div>
              <span className="font-bold text-sm text-[#213156] group-hover:text-[#594fbf] transition-colors text-center">
                {item.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
