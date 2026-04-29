import { motion } from "framer-motion";
import {
  ArrowIcon,
  BotIcon,
  InboxIcon,
  BoardIcon,
  PenIcon,
} from "./landing-icons";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export function Pillars() {
  return (
    <section id="pillars" className="bg-paper py-[96px] lg:py-[140px] relative">
      <div className="max-w-[1240px] mx-auto px-8">
        <motion.div
          className="max-w-[760px] mb-[72px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-[11.5px] text-ds-primary-ink uppercase tracking-[0.14em] font-semibold mb-5"
            variants={fadeUp}
          >
            <span className="w-[5px] h-[5px] bg-ds-primary rounded-full" />
            One platform, four superpowers
          </motion.div>
          <motion.h2
            className="font-display font-medium tracking-[-0.03em] text-[40px] lg:text-[52px] leading-[1.04] m-0 text-ds-text"
            variants={fadeUp}
          >
            Everything a Gulf merchant needs to{" "}
            <em className="italic text-ds-primary font-normal">scale.</em>
          </motion.h2>
          <motion.p
            className="mt-5 text-[17.5px] leading-[1.55] text-ds-text-2 max-w-[600px]"
            variants={fadeUp}
          >
            Rawaj replaces the tangle of copywriting tools, inbox apps, and
            spreadsheets with one calm, intelligent workspace built for
            Arabic-first e-commerce.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-white border border-ds-line rounded-[20px] p-8 flex flex-col min-h-[480px] relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-ds-primary-soft text-ds-primary-ink flex items-center justify-center">
                <BotIcon />
              </div>
              <div className="font-display font-semibold text-[13px] tracking-[0.02em] uppercase text-ds-text-2">
                AI Product Generator
              </div>
            </div>
            <h3 className="font-display font-medium text-[30px] leading-[1.08] tracking-[-0.02em] m-0 mb-3 text-ds-text">
              Write product copy that{" "}
              <em className="italic text-ds-primary font-normal">sells</em> in
              Gulf Arabic.
            </h3>
            <p className="m-0 text-ds-text-2 text-[15px] leading-[1.55] max-w-[420px]">
              Instantly generate product titles, descriptions, and SEO metadata
              in authentic Gulf Arabic dialect and professional English. Choose
              your tone, category, and language — AI does the rest.
            </p>
            <div className="mt-auto pt-6">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-paper border border-ds-line rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#C8FE5E] shadow-[0_0_0_3px_rgba(200,254,94,0.3)]" />
                    <span className="text-[11px] text-ds-text-2 uppercase tracking-[0.08em] font-semibold">
                      Product: Silk Abaya
                    </span>
                  </div>
                  <div className="text-[13px] font-medium leading-[1.35] text-ds-text font-display tracking-[-0.01em]">
                    Generating title and description in Gulf Arabic...
                  </div>
                  <div className="h-[3px] bg-ds-line rounded-sm mt-1.5 overflow-hidden">
                    <span
                      className="block h-full bg-ds-primary rounded-sm"
                      style={{ width: "72%" }}
                    />
                  </div>
                  <div className="text-[11px] text-ds-text-3 mt-2 flex justify-between">
                    <span>Arabic · Luxury tone</span>
                    <span>ETA 3s</span>
                  </div>
                </div>
                <div className="bg-paper border border-ds-line rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#594FBF] shadow-[0_0_0_3px_rgba(89,79,191,0.3)]" />
                    <span className="text-[11px] text-ds-text-2 uppercase tracking-[0.08em] font-semibold">
                      Product: Oud Perfume
                    </span>
                  </div>
                  <div className="text-[13px] font-medium leading-[1.35] text-ds-text font-display tracking-[-0.01em]">
                    Drafting bilingual description...
                  </div>
                  <div className="h-[3px] bg-ds-line rounded-sm mt-1.5 overflow-hidden">
                    <span
                      className="block h-full bg-ds-primary rounded-sm"
                      style={{ width: "44%", background: "#594FBF" }}
                    />
                  </div>
                  <div className="text-[11px] text-ds-text-3 mt-2 flex justify-between">
                    <span>English + Arabic</span>
                    <span>Done</span>
                  </div>
                </div>
                <div className="bg-paper border border-ds-line rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#F4B740] shadow-[0_0_0_3px_rgba(244,183,64,0.3)]" />
                    <span className="text-[11px] text-ds-text-2 uppercase tracking-[0.08em] font-semibold">
                      Product: Sports Shoes
                    </span>
                  </div>
                  <div className="text-[13px] font-medium leading-[1.35] text-ds-text font-display tracking-[-0.01em]">
                    Generating SEO keywords...
                  </div>
                  <div className="h-[3px] bg-ds-line rounded-sm mt-1.5 overflow-hidden">
                    <span
                      className="block h-full bg-ds-primary rounded-sm"
                      style={{ width: "88%", background: "#F4B740" }}
                    />
                  </div>
                  <div className="text-[11px] text-ds-text-3 mt-2 flex justify-between">
                    <span>Casual tone</span>
                    <span>Almost done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ds-line rounded-[20px] p-8 flex flex-col min-h-[440px] relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-ds-primary-soft text-ds-primary-ink flex items-center justify-center">
                <InboxIcon />
              </div>
              <div className="font-display font-semibold text-[13px] tracking-[0.02em] uppercase text-ds-text-2">
                Unified Inbox
              </div>
            </div>
            <h3 className="font-display font-medium text-[30px] leading-[1.08] tracking-[-0.02em] m-0 mb-3 text-ds-text">
              Every channel,{" "}
              <em className="italic text-ds-primary font-normal">one</em>{" "}
              thread.
            </h3>
            <p className="m-0 text-ds-text-2 text-[15px] leading-[1.55] max-w-[420px]">
              WhatsApp Business, Instagram DMs, and Facebook Messenger — all
              stitched into a single customer timeline. AI detects buyer intent,
              scores leads, and drafts replies in your voice.
            </p>
            <div className="mt-auto pt-6">
              <div className="border border-ds-line rounded-xl overflow-hidden bg-white">
                <div className="grid grid-cols-[24px_1fr_auto] gap-2.5 px-3 py-2 border-b border-ds-line items-center text-xs bg-paper-2">
                  <div className="w-[18px] h-[18px] rounded-[5px] bg-[#DFF5E3] text-[10px] flex items-center justify-center font-bold text-[#136D2C]">
                    W
                  </div>
                  <div>
                    <div className="font-semibold text-[12.5px] tracking-[-0.01em]">
                      Priya Shah
                    </div>
                    <div className="text-ds-text-2 text-[11.5px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                      Can you handle cash on delivery in Dubai?
                    </div>
                  </div>
                  <div className="text-[10.5px] text-ds-text-3">2m</div>
                </div>
                <div className="grid grid-cols-[24px_1fr_auto] gap-2.5 px-3 py-2 border-b border-ds-line items-center text-xs">
                  <div className="w-[18px] h-[18px] rounded-[5px] bg-[#FFE0F0] text-[10px] flex items-center justify-center font-bold text-[#AA1D72]">
                    IG
                  </div>
                  <div>
                    <div className="font-semibold text-[12.5px] tracking-[-0.01em]">
                      @amelia.ux
                    </div>
                    <div className="text-ds-text-2 text-[11.5px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                      Thanks for the quick reply — placing order now
                    </div>
                  </div>
                  <div className="text-[10.5px] text-ds-text-3">14m</div>
                </div>
                <div className="grid grid-cols-[24px_1fr_auto] gap-2.5 px-3 py-2 border-b border-ds-line items-center text-xs">
                  <div className="w-[18px] h-[18px] rounded-[5px] bg-[#FFE0F0] text-[10px] flex items-center justify-center font-bold text-[#AA1D72]">
                    f
                  </div>
                  <div>
                    <div className="font-semibold text-[12.5px] tracking-[-0.01em]">
                      Carlos Mendes
                    </div>
                    <div className="text-ds-text-2 text-[11.5px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                      Do you have this in a larger size?
                    </div>
                  </div>
                  <div className="text-[10.5px] text-ds-text-3">1h</div>
                </div>
                <div className="grid grid-cols-[24px_1fr_auto] gap-2.5 px-3 py-2 items-center text-xs">
                  <div className="w-[18px] h-[18px] rounded-[5px] bg-[#DFF5E3] text-[10px] flex items-center justify-center font-bold text-[#136D2C]">
                    W
                  </div>
                  <div>
                    <div className="font-semibold text-[12.5px] tracking-[-0.01em]">
                      Derrick Okafor
                    </div>
                    <div className="text-ds-text-2 text-[11.5px] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                      Can I get a discount on 5 items?
                    </div>
                  </div>
                  <div className="text-[10.5px] text-ds-text-3">3h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ds-line rounded-[20px] p-8 flex flex-col min-h-[440px] relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-ds-primary-soft text-ds-primary-ink flex items-center justify-center">
                <BoardIcon />
              </div>
              <div className="font-display font-semibold text-[13px] tracking-[0.02em] uppercase text-ds-text-2">
                Deal Pipeline
              </div>
            </div>
            <h3 className="font-display font-medium text-[30px] leading-[1.08] tracking-[-0.02em] m-0 mb-3 text-ds-text">
              A pipeline that{" "}
              <em className="italic text-ds-primary font-normal">updates</em>{" "}
              itself.
            </h3>
            <p className="m-0 text-ds-text-2 text-[15px] leading-[1.55] max-w-[420px]">
              Track customers from first message to paid order on a visual
              Kanban board. AI scores each deal and flags risk before you lose
              the sale. Drag, drop, and close.
            </p>
            <div className="mt-auto pt-6">
              <div className="grid grid-cols-4 gap-2 min-h-[140px]">
                <div className="bg-paper border border-ds-line rounded-[10px] p-2.5">
                  <div className="flex justify-between text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ds-text-2 mb-2">
                    <span>New</span>
                    <span className="bg-white py-px px-1.5 rounded border border-ds-line text-ds-text">
                      6
                    </span>
                  </div>
                  <div className="bg-white border border-ds-line rounded-lg p-2 mb-1.5">
                    <div className="text-[11.5px] font-semibold tracking-[-0.01em]">
                      Helios Store
                    </div>
                    <div className="text-[11px] text-ds-text-2 mt-[3px]">
                      $115
                    </div>
                    <div className="mt-[5px] h-[2px] bg-ds-line rounded-sm overflow-hidden">
                      <span
                        className="block h-full bg-ds-primary rounded-sm"
                        style={{ width: "20%" }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-ds-line rounded-lg p-2 mb-1.5">
                    <div className="text-[11.5px] font-semibold tracking-[-0.01em]">
                      Kelvin Fashion
                    </div>
                    <div className="text-[11px] text-ds-text-2 mt-[3px]">
                      $58
                    </div>
                    <div className="mt-[5px] h-[2px] bg-ds-line rounded-sm overflow-hidden">
                      <span
                        className="block h-full bg-ds-primary rounded-sm"
                        style={{ width: "15%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-paper border border-ds-line rounded-[10px] p-2.5">
                  <div className="flex justify-between text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ds-text-2 mb-2">
                    <span>Qual</span>
                    <span className="bg-white py-px px-1.5 rounded border border-ds-line text-ds-text">
                      4
                    </span>
                  </div>
                  <div className="bg-[#FBFAE4] border border-[#E4EE8A] rounded-lg p-2 mb-1.5">
                    <div className="text-[11.5px] font-semibold tracking-[-0.01em]">
                      Parallax
                    </div>
                    <div className="text-[11px] text-ds-text-2 mt-[3px]">
                      $495
                    </div>
                    <div className="mt-[5px] h-[2px] bg-ds-line rounded-sm overflow-hidden">
                      <span
                        className="block h-full bg-ds-primary rounded-sm"
                        style={{ width: "55%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-paper border border-ds-line rounded-[10px] p-2.5">
                  <div className="flex justify-between text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ds-text-2 mb-2">
                    <span>Prop</span>
                    <span className="bg-white py-px px-1.5 rounded border border-ds-line text-ds-text">
                      3
                    </span>
                  </div>
                  <div className="bg-white border border-ds-line rounded-lg p-2 mb-1.5">
                    <div className="text-[11.5px] font-semibold tracking-[-0.01em]">
                      Vertex
                    </div>
                    <div className="text-[11px] text-ds-text-2 mt-[3px]">
                      $880
                    </div>
                    <div className="mt-[5px] h-[2px] bg-ds-line rounded-sm overflow-hidden">
                      <span
                        className="block h-full bg-ds-primary rounded-sm"
                        style={{ width: "78%" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-paper border border-ds-line rounded-[10px] p-2.5">
                  <div className="flex justify-between text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ds-text-2 mb-2">
                    <span>Won</span>
                    <span className="bg-white py-px px-1.5 rounded border border-ds-line text-ds-text">
                      2
                    </span>
                  </div>
                  <div className="bg-[#EAF6EE] border border-[#CDE7D6] rounded-lg p-2 mb-1.5">
                    <div className="text-[11.5px] font-semibold tracking-[-0.01em]">
                      Northwind
                    </div>
                    <div className="text-[11px] text-[#1C6A35] mt-[3px]">
                      $264 &#10003;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-ds-line rounded-[20px] p-8 flex flex-col min-h-[480px] relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-ds-primary-soft text-ds-primary-ink flex items-center justify-center">
                <PenIcon />
              </div>
              <div className="font-display font-semibold text-[13px] tracking-[0.02em] uppercase text-ds-text-2">
                Content &amp; Scheduler
              </div>
            </div>
            <h3 className="font-display font-medium text-[30px] leading-[1.08] tracking-[-0.02em] m-0 mb-3 text-ds-text">
              Social content that sounds{" "}
              <em className="italic text-ds-primary font-normal">like you.</em>
            </h3>
            <p className="m-0 text-ds-text-2 text-[15px] leading-[1.55] max-w-[420px]">
              Generate captions, ad copy, and WhatsApp broadcast messages tuned
              to your brand voice. Schedule posts across platforms and send bulk
              campaigns — all from one place.
            </p>
            <div className="mt-auto pt-6">
              <div className="border border-ds-line rounded-[14px] bg-white p-4">
                <div className="flex gap-2 mb-2.5 items-center">
                  <div className="text-xs text-ds-text-2">
                    New broadcast ·{" "}
                    <b className="text-ds-text">Ramadan Collection</b>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="text-[11px] py-[3px] px-2 rounded-md text-ds-text-2 cursor-pointer">
                      Plain
                    </span>
                    <span className="text-[11px] py-[3px] px-2 rounded-md bg-ink text-white cursor-pointer">
                      &#10022; AI Draft
                    </span>
                  </div>
                </div>
                <div className="text-[13px] leading-[1.55] text-ds-text py-3 px-0 pb-3.5 border-b border-dashed border-ds-line">
                  Hi Omar — our spring drop is live. The first 50 orders ship
                  free, and the limited pieces always sell out fast. Tap below
                  to browse the collection.
                </div>
                <div className="flex gap-2 items-center mt-3 flex-wrap">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="py-1 px-[9px] border border-ds-line rounded-md text-[11px] text-ds-text-2 bg-white cursor-pointer">
                      Tone: Warm
                    </span>
                    <span className="py-1 px-[9px] border border-ds-line rounded-md text-[11px] text-ds-text-2 bg-white cursor-pointer">
                      + Hashtags
                    </span>
                    <span className="py-1 px-[9px] border border-ds-line rounded-md text-[11px] text-ds-text-2 bg-white cursor-pointer">
                      + CTA
                    </span>
                  </div>
                  <div className="ml-auto flex gap-1.5">
                    <button className="h-7 px-2.5 rounded-md text-xs border border-ds-line bg-white text-ds-text cursor-pointer font-medium">
                      Schedule
                    </button>
                    <button className="h-7 px-2.5 rounded-md text-xs border-0 bg-ink text-white cursor-pointer font-medium">
                      Send now <ArrowIcon className="inline ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
