import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui';
import { ArrowRight, Layout, Zap, Users, Shield, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold border border-indigo-100">
            Trusted by 5,000+ teams worldwide
          </span>
          <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            Manage tasks like a <br />
            <span className="text-gradient">modern team.</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The multi-tenant task management system designed to scale. Streamline workflows, 
            collaborate in real-time, and stay ahead of your deadlines.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-8 py-4 text-lg" onClick={() => navigate('/signup')}>
              Start for free <ArrowRight className="inline-block ml-2" size={20} />
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
              Book a demo
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 relative px-4"
        >
          <div className="glass p-2 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="rounded-[1.5rem] overflow-hidden">
               <div className="bg-slate-900 aspect-video w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <div className="text-indigo-400 opacity-20 text-9xl font-bold italic">TASKFLOW</div>
               </div>
            </div>
            {/* Decorative Orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-40 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Everything you need to ship faster.</h2>
          <p className="mt-4 text-slate-600">Powerful features tailored for modern multi-tenant environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Layout, title: 'Modular Board', desc: 'Customizable Kanban, list, and calendar views for all your projects.' },
            { icon: Zap, title: 'Instant Sync', desc: 'Changes propagate instantly to all team members across devices.' },
            { icon: Users, title: 'Multi-Tenant', desc: 'Secure isolation for different teams and organizations within one platform.' },
            { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access control and detailed audit logs for compliance.' },
            { icon: CheckCircle2, title: 'Smart Checklists', desc: 'Deeply integrated subtasks with dependencies and priority levels.' },
            { icon: ArrowRight, title: 'API Access', desc: 'Extend your workflow with our robust RESTful API and webhooks.' }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl border border-slate-100 bg-white/50 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-40 px-6">
        <div className="max-w-5xl mx-auto glass p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900">Ready to transform <br/> your workflow?</h2>
            <p className="mt-6 text-slate-600 text-lg">Join thousands of teams who trust TaskFlow every day.</p>
            <Button className="mt-10 px-10 py-5 text-xl" onClick={() => navigate('/signup')}>
              Get started for free
            </Button>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-50/50 to-pink-50/50 -z-1" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
