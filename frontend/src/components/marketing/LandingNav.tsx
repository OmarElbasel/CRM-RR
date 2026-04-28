"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowIcon } from './landing-icons';

export function Nav() {
  return (
    <motion.nav 
      className="nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container-rl nav-inner">
        <div className="nav-left">
          <Link href="/" className="logo"><span className="logo-mark" />Rawaj</Link>
          <div className="nav-links">
            <a href="#product">Product</a>
            <a href="#pillars">Features</a>
            <a href="#usecases">Use cases</a>
            <a href="#pricing">Pricing</a>
          </div>
        </div>
        <div className="nav-right">
          <Link href="/sign-in" className="btn-rl btn-ghost">Sign in</Link>
          <Link href="/sign-up" className="btn-rl btn-primary">Start free <ArrowIcon /></Link>
        </div>
      </div>
    </motion.nav>
  );
}
