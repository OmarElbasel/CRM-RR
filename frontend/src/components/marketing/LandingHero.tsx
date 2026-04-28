"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowIcon, InboxIcon, SparkIcon } from './landing-icons';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.1 },
  }),
};

export function Hero() {
  return (
    <section className="bg-ink text-[#EDEDF2] pt-20 pb-[120px] relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
        }}
      />
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(89,79,191,0.35), transparent 60%)',
        }}
      />
      <div className="relative max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-16 items-center">
        <div>
          <motion.span
            className="inline-flex items-center gap-2 px-[11px] py-[5px] pl-[5px] border border-white/10 rounded-full text-xs text-[#C8C8D8] bg-white/[0.03]"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ds-accent text-ds-accent-ink text-[10px] font-bold">
              &#10022;
            </span>
            <span>Built for Gulf e-commerce &mdash; Shopify, Salla &amp; Zid</span>
            <span className="text-[#8888A0] text-[13px]">&rarr;</span>
          </motion.span>
          <motion.h1
            className="font-display font-medium text-[48px] lg:text-[68px] leading-[1.02] tracking-[-0.035em] mt-[22px] mb-0 text-white"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            AI-powered workspace for<br />
            <span className="italic font-normal">Gulf e-commerce growth.</span>
          </motion.h1>
          <motion.p
            className="mt-[22px] text-[17.5px] leading-[1.55] text-[#A8A8BC] max-w-[520px]"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Generate authentic Gulf Arabic product copy, unify WhatsApp, Instagram, and Facebook messages in one inbox, track deals from first message to paid order, and recover abandoned carts on autopilot.
          </motion.p>
          <motion.div
            className="mt-9 flex gap-2.5 items-center flex-wrap"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 h-11 px-[18px] rounded-[11px] text-sm font-semibold transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap bg-ds-accent text-ds-accent-ink hover:brightness-105"
            >
              Start for free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#product"
              className="inline-flex items-center gap-2 h-11 px-[18px] rounded-[11px] text-sm font-medium transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap text-[#E2E2ED] bg-transparent hover:text-white"
              style={{ borderColor: 'rgba(255,255,255,0.12)' }}
            >
              See how it works
            </a>
          </motion.div>
          <motion.div
            className="mt-8 flex gap-7 text-[#8888A0] text-[12.5px] items-center flex-wrap"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span><span className="text-ds-accent mr-1">&#10003;</span>20 free AI generations</span>
            <span><span className="text-ds-accent mr-1">&#10003;</span>No credit card</span>
            <span><span className="text-ds-accent mr-1">&#10003;</span>Setup in minutes</span>
          </motion.div>
        </div>
        <HeroStage />
      </div>
    </section>
  );
}

function HeroStage() {
  return (
    <motion.div
      className="relative h-[560px]"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
    >
      <div className="absolute top-0 left-0 w-[420px] bg-white rounded-[14px] border border-ds-line shadow-[0_1px_0_rgba(0,0,0,0.02),0_30px_60px_-30px_rgba(10,10,20,0.35)] shadow-[0_1px_0_rgba(0,0,0,0.04),0_40px_80px_-30px_rgba(10,10,20,0.55)]">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-ds-line">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-md bg-ds-primary-soft text-ds-primary-ink">
              <InboxIcon />
            </div>
            <div className="font-display font-semibold text-[13.5px] tracking-[-0.01em]">Unified Inbox</div>
          </div>
          <div className="flex gap-1 text-[11px]">
            <span className="py-[3px] px-2 rounded-md bg-ink text-white cursor-pointer">All</span>
            <span className="py-[3px] px-2 rounded-md text-ds-text-2 cursor-pointer">Unread</span>
            <span className="py-[3px] px-2 rounded-md text-ds-text-2 cursor-pointer">Hot</span>
          </div>
        </div>
        <div className="grid grid-cols-[28px_1fr_auto] gap-3 px-4 py-3 border-b border-ds-line items-center bg-[#FBFAF3]">
          <div className="w-7 h-7 rounded-[7px] bg-[#FEF3F3] flex items-center justify-center text-[11px] font-semibold text-[#B23A3A] border border-[#FADADA]">MR</div>
          <div>
            <div className="font-semibold text-[13px] leading-[1.2] tracking-[-0.01em]">Maya Rodriguez <span className="inline-block w-1.5 h-1.5 rounded-full bg-ds-primary ml-1.5 align-middle" /></div>
            <div className="text-xs text-ds-text-2 mt-[3px] leading-[1.35] max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap">Can you ship the abaya set to Doha by Thursday?</div>
          </div>
          <div className="flex flex-col items-end gap-[5px]">
            <span className="inline-flex items-center gap-[5px] py-0.5 px-1.5 rounded-[5px] text-[10px] font-medium font-display tracking-[0.01em] bg-[#FFE7E0] text-[#9B2C10]">Hot · 94</span>
            <span className="text-[10.5px] text-ds-text-3">2m</span>
          </div>
        </div>
        <div className="grid grid-cols-[28px_1fr_auto] gap-3 px-4 py-3 border-b border-ds-line items-center bg-[#FBFAF3]">
          <div className="w-7 h-7 rounded-[7px] bg-[#EAF6EE] flex items-center justify-center text-[11px] font-semibold text-[#1C6A35] border border-[#CDE7D6]">TA</div>
          <div>
            <div className="font-semibold text-[13px] leading-[1.2] tracking-[-0.01em]">Theo Adewale <span className="inline-block w-1.5 h-1.5 rounded-full bg-ds-primary ml-1.5 align-middle" /></div>
            <div className="text-xs text-ds-text-2 mt-[3px] leading-[1.35] max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap">Looks good — sending payment now.</div>
          </div>
          <div className="flex flex-col items-end gap-[5px]">
            <span className="inline-flex items-center gap-[5px] py-0.5 px-1.5 rounded-[5px] text-[10px] font-medium font-display tracking-[0.01em] bg-[#E8FBE8] text-[#0E6B17]">Ready to buy</span>
            <span className="text-[10.5px] text-ds-text-3">8m</span>
          </div>
        </div>
        <div className="grid grid-cols-[28px_1fr_auto] gap-3 px-4 py-3 border-b border-ds-line items-center">
          <div className="w-7 h-7 rounded-[7px] bg-[#ECEAFB] flex items-center justify-center text-[11px] font-semibold text-[#35279B] border border-[#D9D5F4]">LS</div>
          <div>
            <div className="font-semibold text-[13px] leading-[1.2] tracking-[-0.01em]">Linh Stein</div>
            <div className="text-xs text-ds-text-2 mt-[3px] leading-[1.35] max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap">Do you have this in navy blue?</div>
          </div>
          <div className="flex flex-col items-end gap-[5px]">
            <span className="inline-flex items-center gap-[5px] py-0.5 px-1.5 rounded-[5px] text-[10px] font-medium font-display tracking-[0.01em] bg-[#FFF4D8] text-[#7A5300]">Pricing</span>
            <span className="text-[10.5px] text-ds-text-3">22m</span>
          </div>
        </div>
        <div className="grid grid-cols-[28px_1fr_auto] gap-3 px-4 py-3 items-center">
          <div className="w-7 h-7 rounded-[7px] bg-[#FDF4E7] flex items-center justify-center text-[11px] font-semibold text-[#9A5A00] border border-[#F3E0C2]">JK</div>
          <div>
            <div className="font-semibold text-[13px] leading-[1.2] tracking-[-0.01em]">Jonah Kim</div>
            <div className="text-xs text-ds-text-2 mt-[3px] leading-[1.35] max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap">Thanks! Order confirmed.</div>
          </div>
          <div className="flex flex-col items-end gap-[5px]">
            <span className="inline-flex items-center gap-[5px] py-0.5 px-1.5 rounded-[5px] text-[10px] font-medium font-display tracking-[0.01em] bg-[#EEF0F5] text-[#3C4660]">Support</span>
            <span className="text-[10.5px] text-ds-text-3">1h</span>
          </div>
        </div>
      </div>

      <div className="absolute right-[-12px] top-[240px] w-[340px] p-4 rounded-[14px] bg-white border border-ds-line shadow-[0_30px_60px_-20px_rgba(10,10,20,0.55)]">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-[22px] h-[22px] rounded-[7px] bg-gradient-to-br from-ds-accent to-[#85E53D] flex items-center justify-center">
            <SparkIcon className="text-ds-accent-ink" />
          </div>
          <div className="font-display font-semibold text-xs tracking-[-0.01em]">Suggested reply</div>
          <div className="text-[10.5px] text-ds-text-3 ml-auto">Rawaj AI</div>
        </div>
        <div className="text-[13px] leading-[1.5] text-ds-text border-l-2 border-ds-accent pl-2.5 my-2 mb-3">
          Hi Maya — yes, we can deliver to Doha by Thursday if you place the order before 2pm today. Shipping is 25 QAR. Shall I send you the payment link?
        </div>
        <div className="flex gap-1.5">
          <button className="flex-1 h-[30px] rounded-lg border border-ds-line bg-white text-xs font-medium cursor-pointer">Regenerate</button>
          <button className="flex-1 h-[30px] rounded-lg border border-ds-line bg-white text-xs font-medium cursor-pointer">Edit</button>
          <button className="flex-1 h-[30px] rounded-lg border border-ink bg-ink text-white text-xs font-medium cursor-pointer">Send <ArrowIcon className="inline ml-1" /></button>
        </div>
      </div>

      <div className="absolute right-0 top-[-10px] w-[300px] p-3.5 rounded-[14px] bg-ink-2 border border-white/10 shadow-[0_1px_0_rgba(0,0,0,0.04),0_40px_80px_-30px_rgba(10,10,20,0.55)]">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div>
            <div className="font-display font-semibold text-[13px] text-white tracking-[-0.01em]">Deal Pipeline</div>
            <div className="text-[11px] text-[#8A8AA0]">48 deals · 12,400 QAR open</div>
          </div>
          <div className="text-[10px] font-bold py-[3px] px-[7px] rounded-[5px] font-display" style={{ background: 'rgba(200,254,94,0.12)', color: '#C8FE5E' }}>+18% this week</div>
        </div>
        <div className="mb-2.5">
          <div className="flex items-center justify-between text-[10.5px] text-[#9090A8] mb-1.5 px-0.5 uppercase tracking-[0.08em] font-semibold">
            <span>Qualified</span><span>12</span>
          </div>
          <div className="h-[3px] rounded-sm bg-ds-line-dark mb-1.5 overflow-hidden">
            <span className="block h-full rounded-sm" style={{ width: '65%', background: '#594FBF' }} />
          </div>
          <div className="p-2.5 border border-ds-accent/35 rounded-lg bg-ds-accent/[0.06] mb-1.5">
            <div className="flex justify-between text-[10.5px] text-[#8A8AA0] mb-1"><span>RAW-2241</span><span style={{ color: '#C8FE5E' }}>● AI active</span></div>
            <div className="text-[12.5px] font-semibold text-[#EDEDF2] tracking-[-0.01em]">Maya Rodriguez · WhatsApp</div>
            <div className="flex justify-between mt-1.5 text-[11px] text-[#B8B8C8]"><span>Abaya set</span><span className="text-ds-accent font-semibold">450 QAR</span></div>
          </div>
          <div className="p-2.5 border border-white/10 rounded-lg bg-ink-3 mb-1.5">
            <div className="flex justify-between text-[10.5px] text-[#8A8AA0] mb-1"><span>RAW-2240</span><span>●</span></div>
            <div className="text-[12.5px] font-semibold text-[#EDEDF2] tracking-[-0.01em]">Theo Adewale · Instagram</div>
            <div className="flex justify-between mt-1.5 text-[11px] text-[#B8B8C8]"><span>Shoes bundle</span><span className="text-ds-accent font-semibold">320 QAR</span></div>
          </div>
        </div>
        <div className="mb-2.5">
          <div className="flex items-center justify-between text-[10.5px] text-[#9090A8] mb-1.5 px-0.5 uppercase tracking-[0.08em] font-semibold">
            <span>Proposal</span><span>8</span>
          </div>
          <div className="h-[3px] rounded-sm bg-ds-line-dark mb-1.5 overflow-hidden">
            <span className="block h-full rounded-sm" style={{ width: '40%', background: '#C8FE5E' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
