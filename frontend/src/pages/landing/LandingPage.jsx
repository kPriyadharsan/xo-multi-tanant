import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui';
import { ArrowRight, Layout, Zap, Users, Shield, CheckCircle2, Sparkles, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden bg-mesh">
      {/* Dynamic Blobs for Premium Depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-blob pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-lime-500/10 blur-[120px] rounded-full animate-blob animation-delay-4000 pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center relative pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-200/50 dark:border-emerald-500/20 mb-10 shadow-sm cursor-pointer hover:shadow-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300"
          >
            <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">Version 2.0 is now live</span>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-2" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group transition-all">
              See what&apos;s new <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.9] mb-8">
            Work flows <br />
            <span className="text-gradient">smarter</span> now.
          </h1>

          <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            The next generation of multi-tenant task management. 
            Automate your productivity with AI-driven insights and real-time collaboration.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
                className="w-full sm:w-auto px-10 py-5 text-xl font-bold bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-400 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 group relative overflow-hidden" 
                onClick={() => navigate('/signup')}
            >
              <div className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-out_infinite]" />
              <span className="relative z-10 flex items-center">
                 Get Started Free <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform duration-300" size={20} />
              </span>
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto px-10 py-5 text-xl font-bold glass hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-300">
              Talk to Sales
            </Button>
          </div>
        </motion.div>

        {/* Hero Mockup with Glass Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-32 relative group"
        >
          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="glass p-3 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border-slate-200/50 dark:border-white/10">
               <div className="rounded-[1.8rem] overflow-hidden bg-slate-900 aspect-video relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent" />
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                     <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-4 transform hover:scale-110 hover:rotate-3 hover:bg-white/20 transition-all duration-500 cursor-pointer shadow-2xl">
                        <Layout size={40} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                     </div>
                     <h3 className="text-4xl font-black text-white uppercase tracking-[0.2em] opacity-40">TaskFlow Dashboard</h3>
                     <div className="flex gap-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-16 h-2 rounded-full bg-white/10" />)}
                     </div>
                  </div>
               </div>
            </div>
          </div>
          {/* Decorative Backglow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>
      </section>


      {/* Features Grid */}
      <section className="mt-60 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { icon: Globe, title: 'Multi-Tenant Core', desc: 'Enterprise-grade isolation for complex organizational structures.', colorClass: 'bg-emerald-500/10 text-emerald-600' },
            { icon: Zap, title: 'Nitro Sync', desc: 'Proprietary sync engine for sub-100ms updates across the globe.', colorClass: 'bg-teal-500/10 text-teal-600' },
            { icon: Shield, title: 'Vault Security', desc: 'SOC2 compliant data encryption at rest and in transit.', colorClass: 'bg-green-500/10 text-green-600' },
            { icon: Sparkles, title: 'AI Assistant', desc: 'Automated task breakdown and smart effort estimations.', colorClass: 'bg-lime-500/10 text-lime-600' },
            { icon: Users, title: 'Team Sprints', desc: 'Fluid sprint planning with deeply integrated subtask tracking.', colorClass: 'bg-cyan-500/10 text-cyan-600' },
            { icon: Layout, title: 'Omni View', desc: 'Seamlessly switch between Kanban, List, and Gantt charts.', colorClass: 'bg-emerald-500/10 text-emerald-600' }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group p-10 rounded-[2.5rem] glass border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-500 cursor-pointer overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
              <div className={`w-16 h-16 relative z-10 ${f.colorClass} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm`}>
                <f.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium CTA */}
      <section className="mt-60 px-6 pb-40">
        <div className="max-w-6xl mx-auto relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[4rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
           <div className="relative glass p-20 md:p-32 rounded-[4rem] text-center overflow-hidden border-slate-200/50 dark:border-white/10 shadow-2xl dark:shadow-none">
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[0.9]">
                   Ready for the <br/><span className="text-gradient">next level?</span>
                </h2>
                <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto font-medium mb-12">
                   Experience the workflow revolution. No credit card required.
                </p>
                <Button 
                    className="px-12 py-6 text-2xl font-black bg-slate-900 text-white hover:bg-emerald-600 dark:bg-white dark:text-slate-900 dark:hover:bg-emerald-50 dark:hover:text-emerald-700 transition-all duration-500 shadow-2xl hover:scale-105 hover:shadow-emerald-500/25" 
                    onClick={() => navigate('/signup')}
                >
                  Create Your Workspace
                </Button>
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-5 hover:opacity-10 transition-opacity bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
           </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
