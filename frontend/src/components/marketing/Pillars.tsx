import { motion } from 'framer-motion';
import { ArrowIcon, BotIcon, InboxIcon, BoardIcon, PenIcon } from './landing-icons';

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
    <section id="pillars" className="band light">
      <div className="container-rl">
        <motion.div 
          className="section-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div className="kicker" variants={fadeUp}><span className="kdot" />One platform, four superpowers</motion.div>
          <motion.h2 className="section-title" variants={fadeUp}>Everything a Gulf merchant needs to <em>scale.</em></motion.h2>
          <motion.p className="section-lede" variants={fadeUp}>
            Rawaj replaces the tangle of copywriting tools, inbox apps, and spreadsheets with one calm, intelligent workspace built for Arabic-first e-commerce.
          </motion.p>
        </motion.div>

        <div className="pillars">
          <div className="pillar lg">
            <div className="p-head">
              <div className="p-icon"><BotIcon /></div>
              <div className="p-name">AI Product Generator</div>
            </div>
            <h3>Write product copy that <em>sells</em> in Gulf Arabic.</h3>
            <p>Instantly generate product titles, descriptions, and SEO metadata in authentic Gulf Arabic dialect and professional English. Choose your tone, category, and language — AI does the rest.</p>
            <div className="visual">
              <div className="agents">
                <div className="agent">
                  <div className="agent-top"><span className="adot" style={{ background: '#C8FE5E', boxShadow: '0 0 0 3px rgba(200,254,94,0.3)' }} /><span className="role">Product: Silk Abaya</span></div>
                  <div className="task">Generating title and description in Gulf Arabic...</div>
                  <div className="prog"><span style={{ width: '72%' }} /></div>
                  <div className="task-meta"><span>Arabic · Luxury tone</span><span>ETA 3s</span></div>
                </div>
                <div className="agent">
                  <div className="agent-top"><span className="adot" style={{ background: '#594FBF', boxShadow: '0 0 0 3px rgba(89,79,191,0.3)' }} /><span className="role">Product: Oud Perfume</span></div>
                  <div className="task">Drafting bilingual description...</div>
                  <div className="prog"><span style={{ width: '44%', background: '#594FBF' }} /></div>
                  <div className="task-meta"><span>English + Arabic</span><span>Done</span></div>
                </div>
                <div className="agent">
                  <div className="agent-top"><span className="adot" style={{ background: '#F4B740', boxShadow: '0 0 0 3px rgba(244,183,64,0.3)' }} /><span className="role">Product: Sports Shoes</span></div>
                  <div className="task">Generating SEO keywords...</div>
                  <div className="prog"><span style={{ width: '88%', background: '#F4B740' }} /></div>
                  <div className="task-meta"><span>Casual tone</span><span>Almost done</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar">
            <div className="p-head">
              <div className="p-icon"><InboxIcon /></div>
              <div className="p-name">Unified Inbox</div>
            </div>
            <h3>Every channel, <em>one</em> thread.</h3>
            <p>WhatsApp Business, Instagram DMs, and Facebook Messenger — all stitched into a single customer timeline. AI detects buyer intent, scores leads, and drafts replies in your voice.</p>
            <div className="visual">
              <div className="inbox-mini">
                <div className="row on">
                  <div className="src wa">W</div>
                  <div>
                    <div className="who">Priya Shah</div>
                    <div className="prev">Can you handle cash on delivery in Dubai?</div>
                  </div>
                  <div className="t">2m</div>
                </div>
                <div className="row">
                  <div className="src ig">IG</div>
                  <div>
                    <div className="who">@amelia.ux</div>
                    <div className="prev">Thanks for the quick reply — placing order now</div>
                  </div>
                  <div className="t">14m</div>
                </div>
                <div className="row">
                  <div className="src fb">f</div>
                  <div>
                    <div className="who">Carlos Mendes</div>
                    <div className="prev">Do you have this in a larger size?</div>
                  </div>
                  <div className="t">1h</div>
                </div>
                <div className="row">
                  <div className="src wa">W</div>
                  <div>
                    <div className="who">Derrick Okafor</div>
                    <div className="prev">Can I get a discount on 5 items?</div>
                  </div>
                  <div className="t">3h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar">
            <div className="p-head">
              <div className="p-icon"><BoardIcon /></div>
              <div className="p-name">Deal Pipeline</div>
            </div>
            <h3>A pipeline that <em>updates</em> itself.</h3>
            <p>Track customers from first message to paid order on a visual Kanban board. AI scores each deal and flags risk before you lose the sale. Drag, drop, and close.</p>
            <div className="visual">
              <div className="kanban">
                <div className="col-rl">
                  <div className="col-h"><span>New</span><span className="count">6</span></div>
                  <div className="k-deal"><div className="k-name">Helios Store</div><div className="k-val">420 QAR</div><div className="bar"><span style={{ width: '20%' }} /></div></div>
                  <div className="k-deal"><div className="k-name">Kelvin Fashion</div><div className="k-val">210 QAR</div><div className="bar"><span style={{ width: '15%' }} /></div></div>
                </div>
                <div className="col-rl">
                  <div className="col-h"><span>Qual</span><span className="count">4</span></div>
                  <div className="k-deal hot"><div className="k-name">Parallax</div><div className="k-val">1,800 QAR</div><div className="bar"><span style={{ width: '55%' }} /></div></div>
                </div>
                <div className="col-rl">
                  <div className="col-h"><span>Prop</span><span className="count">3</span></div>
                  <div className="k-deal"><div className="k-name">Vertex</div><div className="k-val">3,200 QAR</div><div className="bar"><span style={{ width: '78%' }} /></div></div>
                </div>
                <div className="col-rl">
                  <div className="col-h"><span>Won</span><span className="count">2</span></div>
                  <div className="k-deal" style={{ background: '#EAF6EE', borderColor: '#CDE7D6' }}><div className="k-name">Northwind</div><div className="k-val" style={{ color: '#1C6A35' }}>960 QAR &#10003;</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pillar lg">
            <div className="p-head">
              <div className="p-icon"><PenIcon /></div>
              <div className="p-name">Content &amp; Scheduler</div>
            </div>
            <h3>Social content that sounds <em>like you.</em></h3>
            <p>Generate captions, ad copy, and WhatsApp broadcast messages in Arabic and English. Schedule posts across platforms and send bulk campaigns — all from one place.</p>
            <div className="visual">
              <div className="composer">
                <div className="composer-hd">
                  <div className="to">New broadcast · <b>Ramadan Collection</b></div>
                  <div className="mode">
                    <span>Plain</span>
                    <span className="on">&#10022; AI Draft</span>
                  </div>
                </div>
                <div className="draft">
                  &#x627;&#x644;&#x633;&#x644;&#x627;&#x645; &#x639;&#x644;&#x64A;&#x643;&#x645;! &#x62A;&#x634;&#x643;&#x64A;&#x644;&#x629; &#x631;&#x645;&#x636;&#x627;&#x646; &#x627;&#x644;&#x62C;&#x62F;&#x64A;&#x62F;&#x629; &#x648;&#x635;&#x644;&#x62A; &#x627;&#x644;&#x62D;&#x64A;&#x646;! &#x627;&#x633;&#x62A;&#x643;&#x634;&#x641;&#x648;&#x627; &#x627;&#x644;&#x62A;&#x635;&#x627;&#x645;&#x64A;&#x645; &#x627;&#x644;&#x645;&#x62D;&#x62F;&#x648;&#x62F;&#x629; &#x648;&#x627;&#x62D;&#x635;&#x644;&#x648;&#x627; &#x639;&#x644;&#x649; &#x62E;&#x635;&#x645; 20% &#x644;&#x644;&#x637;&#x644;&#x628;&#x627;&#x62A; &#x627;&#x644;&#x623;&#x648;&#x644;&#x649;.
                </div>
                <div className="foot">
                  <div className="left">
                    <span className="chip-c">Tone: Warm</span>
                    <span className="chip-c">+ Hashtags</span>
                    <span className="chip-c">+ CTA</span>
                  </div>
                  <div className="send">
                    <button className="schedule">Schedule</button>
                    <button className="go">Send now <ArrowIcon style={{ marginLeft: 4 }} /></button>
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
