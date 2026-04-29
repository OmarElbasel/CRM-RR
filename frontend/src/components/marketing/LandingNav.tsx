"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowIcon } from './landing-icons';
import { DEMO_MODE } from '@/lib/demo';

export function Nav() {
  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-ds-line-dark"
      style={{
        background: 'rgba(11,11,20,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[1240px] mx-auto px-8 flex items-center justify-between h-16 text-[#EDEDF2]">
        <div className="flex items-center gap-9">
          <Link href="/" className="flex items-center gap-2.5 font-headline font-bold text-base tracking-tight">
            <span className="w-[22px] h-[22px] rounded-md relative overflow-hidden bg-gradient-to-br from-ds-accent to-ds-primary">
              <span className="absolute inset-[3px] rounded bg-ink" />
              <span className="absolute left-1/2 top-[3px] bottom-[3px] w-0.5 bg-ds-accent z-10" />
            </span>
            Rawaj
          </Link>
          <div className="hidden lg:flex gap-7 text-[13.5px] text-[#B8B8C8]">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#pillars" className="hover:text-white transition-colors">Features</a>
            <a href="#usecases" className="hover:text-white transition-colors">Use cases</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[13.5px]">
          {DEMO_MODE ? (
            <>
              <a
                href="https://github.com/OmarEbasel"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] font-medium text-[13.5px] transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap text-[#B8B8C8] bg-transparent hover:text-white"
              >
                GitHub
              </a>
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] font-semibold text-[13.5px] transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap bg-ds-accent text-ds-accent-ink hover:brightness-105"
              >
                Try the demo <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] font-medium text-[13.5px] transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap text-[#B8B8C8] bg-transparent hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] font-semibold text-[13.5px] transition-all duration-150 cursor-pointer border border-transparent whitespace-nowrap bg-ds-accent text-ds-accent-ink hover:brightness-105"
              >
                Start free <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
