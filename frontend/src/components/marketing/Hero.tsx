"use client";

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // Custom Apple-like ease
    },
  },
};

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-[#faf8ff]">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          className="z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block bg-[#bfb9ff] text-[#35279b] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
          >
            Built for the Gulf Region
          </motion.span>
          
          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-7xl font-extrabold tracking-tight text-[#213156] mb-8 leading-[1.1]"
          >
            Supercharge Your <span className="text-[#594fbf]">Gulf E-Commerce</span> Store with AI
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-[#4f5e86] font-medium leading-relaxed mb-10 max-w-xl"
          >
            The Digital Majlis for growth. Automate Gulf Arabic descriptions, manage unified messages, and recover abandoned carts with intelligence built for Salla, Zid, and Shopify.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sign-up"
              className="bg-[#594fbf] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#4d44a6] transition-all flex items-center justify-center gap-2 group"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#how-it-works"
              className="bg-[#d9e2ff] text-[#213156] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e2e7ff] transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </Link>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7osIKbYdTz72ASLX9jUhDVGpsADurD36jXmFzpzX-eagMKhBfYhRUkTGgN9l61wP-1-XvPPuMRtQxsmLtxgGv_z3T6vPaxvUpp3moX87CIYDJXlqKTPD1Gtq6Tl_E_COmrVSsfysK38EC9Ixn6HYMRHFbsQ9M1cOrwNECChvcb71iasktKGEDTyEgsYfsokPZzeKkM1hdifIkjscZLMUD7l6R7pyuJMIzKeyKG2KY6eVz5EX4JBwQOtO7ub4rypo6UUJqw4zGTxoa"
              alt="Shopify"
              className="h-6 w-auto"
            />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4NylBlBrReW31O75ZQmsEwTnDy-k5uWzDoVRXVYzZnjm25jDYfXoq0TBaHgoIKP0cuogHHUMB2ynm3y5AQ2o08lvsRlTD8W87iRO8yt4eHI8M5FxRO0v1_nDwJ0zy9c_aNGgyDlR4Pyjb9xK1i1wAeSHMGawvDtgiNPR6v9TB-A5IKxnTYWq4lPyApNs-1ySPIQXnLgfBpFDwnWUmDPdTWhbQqqH_yZvVZW4abyTGDq0qElBV6F2gm__Cv3ViWmZsfsYHJLCj6Y_e"
              alt="WhatsApp"
              className="h-6 w-auto"
            />
            <span className="text-xl font-black text-[#213156]">Salla</span>
            <span className="text-xl font-black text-[#213156]">Zid</span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#594fbf]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#26fedc]/20 rounded-full blur-3xl"></div>
          
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-4 border border-[#a2b1dd]/10"
            whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(89, 79, 191, 0.25)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrBc5HX5svp7qC7XUyK25q4h4HinZK-sagvIOzjh1D57EQtv6kLq-x1WOlR-lL-cNYnqaRMqVBXyWqRNo695Hm0fDMSxEKWT4DSCr4-lHEA5PD_i3WB1MynSZsHPrVv-Q90NWmlazGvJC3VP-97gU_nlNV_5eF_0Ty_8VFF0aFaPC536rHw1qNbo_6V6dn2lxsvlE7MIh6oipO8YBKvqD682nDLmOEHXCgOer_QqyPwQg5Qoim_b_I1gC2Tn-SRFEszIY0PcCkFLxz"
              alt="Dashboard Preview"
              className="w-full h-auto rounded-2xl"
            />
            
            <motion.div 
              className="absolute bottom-12 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-[#a2b1dd]/20 max-w-[240px]"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#26fedc] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#00483d]" />
                </div>
                <span className="font-bold text-sm">Revenue Engine</span>
              </div>
              <div className="text-2xl font-black text-[#594fbf]">+127%</div>
              <div className="text-[10px] text-[#4f5e86] font-bold uppercase tracking-widest">Growth this month</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
