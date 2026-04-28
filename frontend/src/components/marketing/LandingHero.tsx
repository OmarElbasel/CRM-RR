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
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-glow" />
      <div className="container-rl hero-inner">
        <div>
          <motion.span 
            className="eyebrow"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="eb-dot">&#10022;</span>
            <span>Built for Gulf e-commerce &mdash; Shopify, Salla &amp; Zid</span>
            <span className="arrow">&rarr;</span>
          </motion.span>
          <motion.h1
            className="hero-title"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            AI-powered workspace for<br />
            <span className="italic">Gulf e-commerce growth.</span>
          </motion.h1>
          <motion.p
            className="hero-sub"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            Generate authentic Gulf Arabic product copy, unify WhatsApp, Instagram, and Facebook messages in one inbox, track deals from first message to paid order, and recover abandoned carts on autopilot.
          </motion.p>
          <motion.div
            className="hero-ctas"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link href="/sign-up" className="btn-rl btn-lg btn-primary">Start for free <ArrowIcon className="btn-arrow" /></Link>
            <a href="#product" className="btn-rl btn-lg btn-ghost" style={{ color: '#E2E2ED', borderColor: 'var(--line-dark-2)' }}>
              See how it works
            </a>
          </motion.div>
          <motion.div
            className="hero-meta"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span><span className="check">&#10003;</span>20 free AI generations</span>
            <span><span className="check">&#10003;</span>No credit card</span>
            <span><span className="check">&#10003;</span>Setup in minutes</span>
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
      className="hero-stage"
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
    >
      <div className="card-rl inbox shadow-lg-rl">
        <div className="inbox-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, background: 'var(--primary-soft)', color: 'var(--primary-ink)' }}><InboxIcon /></div>
            <div className="title">Unified Inbox</div>
          </div>
          <div className="filters">
            <span className="chip on">All</span>
            <span className="chip">Unread</span>
            <span className="chip">Hot</span>
          </div>
        </div>
        <div className="conv new">
          <div className="avatar-rl p-1">MR</div>
          <div>
            <div className="name">Maya Rodriguez <span className="ndot" /></div>
            <div className="msg">Can you ship the abaya set to Doha by Thursday?</div>
          </div>
          <div className="right">
            <span className="tag-rl tag-hot">Hot · 94</span>
            <span className="time">2m</span>
          </div>
        </div>
        <div className="conv new">
          <div className="avatar-rl p-2">TA</div>
          <div>
            <div className="name">Theo Adewale <span className="ndot" /></div>
            <div className="msg">Looks good — sending payment now.</div>
          </div>
          <div className="right">
            <span className="tag-rl tag-buy">Ready to buy</span>
            <span className="time">8m</span>
          </div>
        </div>
        <div className="conv">
          <div className="avatar-rl p-3">LS</div>
          <div>
            <div className="name">Linh Stein</div>
            <div className="msg">Do you have this in navy blue?</div>
          </div>
          <div className="right">
            <span className="tag-rl tag-price">Pricing</span>
            <span className="time">22m</span>
          </div>
        </div>
        <div className="conv">
          <div className="avatar-rl p-4">JK</div>
          <div>
            <div className="name">Jonah Kim</div>
            <div className="msg">Thanks! Order confirmed.</div>
          </div>
          <div className="right">
            <span className="tag-rl tag-support">Support</span>
            <span className="time">1h</span>
          </div>
        </div>
      </div>

      <div className="ai-card">
        <div className="ai-head">
          <div className="ai-spark"><SparkIcon style={{ color: '#1F2A00' }} /></div>
          <div className="ai-label">Suggested reply</div>
          <div className="ai-by">Rawaj AI</div>
        </div>
        <div className="ai-body">
          Hi Maya — yes, we can deliver to Doha by Thursday if you place the order before 2pm today. Shipping is 25 QAR. Shall I send you the payment link?
        </div>
        <div className="ai-actions">
          <button>Regenerate</button>
          <button>Edit</button>
          <button className="primary">Send <ArrowIcon style={{ marginLeft: 4 }} /></button>
        </div>
      </div>

      <div className="dark-card pipeline shadow-lg-rl">
        <div className="pipe-head">
          <div>
            <div className="pipe-title">Deal Pipeline</div>
            <div className="pipe-sub">48 deals · 12,400 QAR open</div>
          </div>
          <div style={{ background: 'rgba(200,254,94,0.12)', color: 'var(--accent)', fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 5, fontFamily: 'Inter Tight' }}>+18% this week</div>
        </div>
        <div className="stage-col">
          <div className="stage-head"><span>Qualified</span><span>12</span></div>
          <div className="stage-bar"><span style={{ width: '65%', background: 'var(--primary)' }} /></div>
          <div className="deal hot">
            <div className="deal-top"><span>RAW-2241</span><span style={{ color: 'var(--accent)' }}>● AI active</span></div>
            <div className="deal-name">Maya Rodriguez · WhatsApp</div>
            <div className="deal-meta"><span>Abaya set</span><span className="val">450 QAR</span></div>
          </div>
          <div className="deal">
            <div className="deal-top"><span>RAW-2240</span><span>●</span></div>
            <div className="deal-name">Theo Adewale · Instagram</div>
            <div className="deal-meta"><span>Shoes bundle</span><span className="val">320 QAR</span></div>
          </div>
        </div>
        <div className="stage-col">
          <div className="stage-head"><span>Proposal</span><span>8</span></div>
          <div className="stage-bar"><span style={{ width: '40%', background: '#C8FE5E' }} /></div>
        </div>
      </div>
    </motion.div>
  );
}
