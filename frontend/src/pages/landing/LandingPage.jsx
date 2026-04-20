import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../../components/ui';
import {
  ArrowRight, Layout, Zap, Users, Shield,
  Sparkles, Globe, CheckCircle2, ChevronRight,
  BarChart2, Clock, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── tiny reusable components ─────────────────────────────────────── */
const Tag = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
    bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400
    border border-emerald-200/40 dark:border-emerald-500/20">
    {children}
  </span>
);

const StatCard = ({ value, label, icon: Icon }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="flex flex-col items-center gap-1 px-8 py-5
      glass rounded-2xl border border-slate-200/50 dark:border-white/[0.06]
      hover:border-emerald-300/40 dark:hover:border-emerald-500/30 transition-all duration-300"
  >
    <Icon size={18} className="text-emerald-500 mb-1" />
    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">{label}</span>
  </motion.div>
);

const FeatureCard = ({ icon: Icon, num, title, desc, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    whileHover={{ y: -8 }}
    transition={{ duration: 0.5 }}
    className="group relative p-8 rounded-3xl glass border border-slate-200/50 dark:border-white/[0.06]
      hover:border-emerald-300/50 dark:hover:border-emerald-500/25
      hover:shadow-2xl hover:shadow-emerald-500/[0.08] dark:hover:shadow-emerald-500/[0.15]
      transition-all duration-500 overflow-hidden cursor-default"
  >
    {/* card number watermark */}
    <span className="absolute top-5 right-6 text-7xl font-black text-slate-100 dark:text-white/[0.03]
      select-none pointer-events-none transition-all duration-500 group-hover:text-emerald-50 dark:group-hover:text-emerald-400/5">
      {num}
    </span>

    {/* glow orb */}
    <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-3xl opacity-0
      group-hover:opacity-60 transition-opacity duration-700 ${accent}`} />

    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm
      relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6
      bg-emerald-500/10 dark:bg-emerald-400/10`}>
      <Icon size={26} className="text-emerald-600 dark:text-emerald-400" />
    </div>

    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">{desc}</p>

    <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400
      opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 relative z-10">
      Learn more <ChevronRight size={13} />
    </div>
  </motion.div>
);

/* ─── trust logos strip ─────────────────────────────────────────────── */
const logos = ['Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'GitHub'];

/* ─── features data ─────────────────────────────────────────────────── */
const features = [
  { icon: Globe,    num: '01', title: 'Multi-Tenant Core',  desc: 'Enterprise-grade workspace isolation for complex organisations — zero data bleed guaranteed.', accent: 'bg-emerald-400' },
  { icon: Zap,      num: '02', title: 'Nitro Real-Time',    desc: 'Proprietary sync engine delivers sub-100 ms updates to every collaborator worldwide.',          accent: 'bg-teal-400'   },
  { icon: Shield,   num: '03', title: 'Vault Security',     desc: 'SOC 2 Type II compliant. AES-256 encryption at rest and TLS 1.3 in transit, always.',            accent: 'bg-green-400'  },
  { icon: Sparkles, num: '04', title: 'AI Copilot',         desc: 'Automated task breakdown, smart effort estimation, and priority scoring out of the box.',         accent: 'bg-lime-400'   },
  { icon: Users,    num: '05', title: 'Sprint Planning',    desc: 'Fluid sprints with drag-and-drop backlog, burndown charts, and deep subtask nesting.',            accent: 'bg-cyan-400'   },
  { icon: BarChart2, num: '06', title: 'Omni Analytics',   desc: 'Kanban, List, Gantt — one click away. Live dashboards that tell the story of your team.',         accent: 'bg-emerald-400' },
];

/* ─── main component ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef  = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'var(--bg-main)' }}>

      {/* ── ambient blobs ──────────────────────────────────────────── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px]
          bg-emerald-400/[0.07] dark:bg-emerald-500/[0.08] rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px]
          bg-teal-400/[0.06] dark:bg-teal-500/[0.07] rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px]
          bg-lime-400/[0.05] dark:bg-lime-500/[0.06] rounded-full blur-[90px] animate-blob animation-delay-4000" />
      </div>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative max-w-7xl mx-auto px-6 pt-36 pb-24 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 cursor-pointer
              glass border border-emerald-200/60 dark:border-emerald-500/20
              hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10
              transition-all duration-300 group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
              Version 2.0 — Now Live
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5
              group-hover:gap-1.5 transition-all duration-300">
              What&apos;s new <ArrowRight size={11} />
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(3rem,9vw,7rem)] font-black leading-[0.92] tracking-tight
              text-slate-900 dark:text-white"
          >
            Ship work that<br />
            <span className="text-gradient">actually matters.</span>
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 text-lg md:text-xl text-slate-500 dark:text-slate-400
              max-w-xl mx-auto leading-relaxed font-medium"
          >
            The multi-tenant task platform that keeps distributed teams in perfect sync —
            from first sprint to final delivery.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate('/signup')}
              className="group relative overflow-hidden w-full sm:w-auto px-9 py-4 text-base font-bold
                bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-400
                shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40
                hover:-translate-y-0.5 transition-all duration-300 rounded-2xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start free — no card needed
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-0
                bg-white/10 transition-transform duration-500" />
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto px-9 py-4 text-base font-bold glass rounded-2xl
                hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
            >
              Watch demo
            </Button>
          </motion.div>

          {/* social proof tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-2"
          >
            {['No credit card', 'Free 14-day trial', 'Cancel anytime'].map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <CheckCircle2 size={12} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-4"
        >
          <StatCard value="40k+" label="Teams worldwide"      icon={Users}    />
          <StatCard value="99.9%" label="Uptime SLA"          icon={Clock}    />
          <StatCard value="4.9★"  label="Average rating"      icon={Star}     />
          <StatCard value="<80ms" label="Global sync latency" icon={Zap}       />
        </motion.div>

        {/* ── Dashboard preview card ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 48 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          {/* halo */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent
            blur-3xl rounded-full scale-110 pointer-events-none" />

          <div className="relative glass rounded-[2rem] p-2.5 border border-slate-200/60 dark:border-white/[0.07]
            shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200/40 dark:border-white/[0.05]">
              {['bg-red-400','bg-amber-400','bg-emerald-400'].map(c => (
                <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
              ))}
              <div className="mx-auto flex items-center gap-2 px-4 py-1 rounded-full
                bg-slate-100/80 dark:bg-white/[0.05] text-xs text-slate-400 dark:text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                app.taskflow.io/dashboard
              </div>
            </div>

            {/* mock UI body */}
            <div className="rounded-[1.5rem] overflow-hidden bg-slate-950 aspect-[16/9] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 via-transparent to-teal-900/20" />

              {/* sidebar mock */}
              <div className="absolute left-0 top-0 h-full w-48 border-r border-white/[0.04] flex flex-col gap-2 p-4">
                <div className="w-24 h-5 rounded-full bg-white/10 mb-4" />
                {[0.7, 1, 0.5, 0.6, 0.4].map((op, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/10" style={{ opacity: op }} />
                    <div className="h-2.5 rounded-full bg-white/10 flex-1" style={{ opacity: op }} />
                  </div>
                ))}
              </div>

              {/* main content area */}
              <div className="absolute left-48 top-0 right-0 bottom-0 p-6 grid grid-cols-3 gap-4">
                {/* stat cards */}
                {['bg-emerald-500/20', 'bg-teal-500/20', 'bg-lime-500/20'].map((bg, i) => (
                  <div key={i} className={`${bg} rounded-xl p-3 flex flex-col gap-2 border border-white/[0.04]`}>
                    <div className="w-12 h-1.5 rounded bg-white/20" />
                    <div className="w-8 h-5 rounded bg-white/30" />
                    <div className="w-16 h-1 rounded bg-white/10" />
                  </div>
                ))}
                {/* kanban columns */}
                {['To Do', 'In Progress', 'Done'].map((col, ci) => (
                  <div key={col} className="col-span-1 rounded-xl bg-white/[0.03] border border-white/[0.04] p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${ci===0?'bg-slate-400':ci===1?'bg-amber-400':'bg-emerald-400'}`} />
                      <div className="h-2 w-12 rounded bg-white/20" />
                    </div>
                    {[...Array(ci===1?3:2)].map((_,i) => (
                      <div key={i} className="bg-white/[0.05] rounded-lg p-2.5 border border-white/[0.04] flex flex-col gap-1.5">
                        <div className="h-2 rounded w-full bg-white/20" />
                        <div className="h-1.5 rounded w-3/4 bg-white/10" />
                        <div className="flex gap-1 mt-1">
                          {[...Array(2)].map((_,j)=>(
                            <div key={j} className="h-4 w-10 rounded-full bg-emerald-500/20 border border-emerald-500/20" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Trusted by strip ───────────────────────────────────────── */}
      <section className="py-12 border-y border-slate-200/40 dark:border-white/[0.05] overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-8">
          Trusted by teams at
        </p>
        <div className="flex items-center justify-center flex-wrap gap-x-12 gap-y-4 max-w-4xl mx-auto px-6">
          {logos.map(l => (
            <span key={l} className="text-lg font-black text-slate-300 dark:text-slate-700
              hover:text-emerald-500 dark:hover:text-emerald-500 transition-colors duration-300 cursor-default tracking-tight">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Tag><Sparkles size={11} /> Everything you need</Tag>
            <h2 className="mt-5 text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Built for modern teams
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-md mx-auto text-base font-medium">
              Six core pillars that turn scattered work into a coherent, fast-moving operation.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonial strip ──────────────────────────────────────── */}
      <section className="py-16 px-6 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04] border-y border-emerald-200/30 dark:border-emerald-500/10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-5">
            {[...Array(5)].map((_,i) => (
              <Star key={i} size={16} className="text-emerald-500 fill-emerald-500" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-snug tracking-tight">
            &ldquo;TaskFlow cut our sprint planning time in half.
            It&apos;s the single tool we can&apos;t live without.&rdquo;
          </blockquote>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-800 dark:text-white">Alex Rivera</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">VP Engineering, Stripe</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="px-6 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto group"
        >
          {/* pulse border */}
          <div className="absolute -inset-px rounded-[3rem] bg-gradient-to-r from-emerald-500 to-teal-500
            opacity-20 group-hover:opacity-40 blur-sm transition-all duration-700 animate-pulse" />

          <div className="relative glass rounded-[3rem] px-12 py-20 md:px-24 md:py-28 text-center overflow-hidden
            border border-emerald-200/30 dark:border-emerald-500/10 shadow-2xl dark:shadow-none">

            {/* decorative grid */}
            <div className="absolute inset-0 opacity-[0.012] dark:opacity-[0.03]"
              style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10">
              <Tag><Zap size={11} className="fill-current" /> Limited time</Tag>
              <h2 className="mt-6 text-4xl md:text-6xl font-black text-slate-900 dark:text-white
                tracking-tight leading-[0.95]">
                Ready to move <br className="hidden md:block" />
                <span className="text-gradient">at full speed?</span>
              </h2>
              <p className="mt-6 text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                Join 40,000+ teams already shipping faster.
                Your first workspace is always free.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => navigate('/signup')}
                  className="group w-full sm:w-auto px-10 py-4 text-base font-bold rounded-2xl
                    bg-slate-900 dark:bg-white text-white dark:text-slate-900
                    hover:bg-emerald-600 dark:hover:bg-emerald-100 dark:hover:text-emerald-800
                    shadow-2xl hover:shadow-emerald-500/20 hover:scale-105
                    transition-all duration-300"
                >
                  Create your workspace
                  <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-500 dark:text-slate-400
                    hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                >
                  Already have an account? Sign in →
                </button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
                {['SOC 2 Compliant', 'GDPR Ready', 'SSO Support', '24/7 Support'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-emerald-500" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
