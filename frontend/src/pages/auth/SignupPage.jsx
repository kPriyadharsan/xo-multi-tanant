import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Input } from '../../components/ui';
import {
  CheckCircle2, User, Mail, Lock, Building,
  Loader2, Zap, Sparkles, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/* ─── Variants ──────────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.12 },
  },
};

const shakeVariants = {
  shake: {
    x: [0, -10, 10, -8, 8, -4, 4, 0],
    transition: { duration: 0.55, ease: 'easeInOut' },
  },
  rest: { x: 0 },
};

const successVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1, opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 18, delay: 0.05 },
  },
};

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, filter: 'blur(4px)', transition: { duration: 0.25 } }),
};

/* ─── Background pieces ─────────────────────────────────────────── */

const GridBackground = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
    }}
  />
);

const Orb = ({ className, delay = 0, duration = 10 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none blur-[110px] ${className}`}
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.45, 0.75, 0.45],
      x: [0, 25, -15, 0],
      y: [0, -30, 12, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const Particle = ({ x, y, size, duration, delay, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0 }}
    animate={{ y: [0, -55, -115], opacity: [0, 0.55, 0], scale: [0.8, 1.2, 0.5] }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const particles = [
  { x: 8,  y: 82, size: 5, duration: 7,   delay: 0,   color: 'rgba(16,185,129,0.5)' },
  { x: 22, y: 91, size: 4, duration: 9,   delay: 1.3, color: 'rgba(52,211,153,0.4)' },
  { x: 48, y: 86, size: 7, duration: 7.5, delay: 0.6, color: 'rgba(16,185,129,0.35)' },
  { x: 70, y: 93, size: 4, duration: 8.5, delay: 2.2, color: 'rgba(4,120,87,0.45)' },
  { x: 85, y: 79, size: 6, duration: 6.5, delay: 0.9, color: 'rgba(52,211,153,0.5)' },
  { x: 35, y: 96, size: 3, duration: 8,   delay: 3.1, color: 'rgba(16,185,129,0.3)' },
  { x: 60, y: 89, size: 5, duration: 7,   delay: 1.8, color: 'rgba(4,120,87,0.35)' },
];

/* ─── Field Wrapper with glow ───────────────────────────────────── */

const GlowField = ({ focused, children }) => (
  <motion.div
    className="relative"
    animate={focused ? { y: -2 } : { y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <AnimatePresence>
      {focused && (
        <motion.div
          className="absolute -inset-1 rounded-2xl pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.14) 0%, transparent 70%)',
            border: '1px solid rgba(16,185,129,0.3)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        />
      )}
    </AnimatePresence>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

/* ─── Component ──────────────────────────────────────────────────── */

const SignupPage = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [tabDir, setTabDir]       = useState(1);
  const [formData, setFormData]   = useState({
    name: '', email: '', password: '', organization: '', organizationId: '',
  });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);
  const [shake, setShake]         = useState(false);
  const [focused, setFocused]     = useState(null);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRotateX = useTransform(mouseY, [-300, 300], [1.5, -1.5]);
  const cardRotateY = useTransform(mouseX, [-300, 300], [-1.5, 1.5]);

  useEffect(() => {
    const fn = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [mouseX, mouseY]);

  const switchTab = (joining) => {
    setTabDir(joining ? 1 : -1);
    setIsJoining(joining);
    setError('');
  };

  const set = (key) => (e) => setFormData((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShake(false);
    try {
      const payload = { ...formData };
      if (!isJoining) delete payload.organizationId;
      const { data } = await authApi.signup(payload);
      setSuccess(true);
      setTimeout(() => {
        login(data.user, data.token);
        navigate('/dashboard');
      }, 950);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const iconColor = (field) =>
    focused === field ? '#34d399' : '#64748b';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #071a12 0%, #0b1a1d 40%, #081524 100%)' }}
    >
      <GridBackground />

      {/* Orbs */}
      <Orb className="w-[480px] h-[480px] bg-emerald-600/20 top-[-12%] left-[-8%]"  delay={0} duration={13} />
      <Orb className="w-[380px] h-[380px] bg-teal-600/20 bottom-[-10%] right-[-5%]" delay={2} duration={11} />
      <Orb className="w-[280px] h-[280px] bg-green-700/15 top-[45%] right-[18%]"    delay={4} duration={15} />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[560px] relative z-10"
        style={{ perspective: 1000 }}
      >
        {/* Logo & Heading */}
        <motion.div variants={itemVariants} className="text-center mb-9">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
              transition={{ duration: 0.45 }}
              className="relative"
            >
              <div
                className="w-16 h-16 rounded-[1.4rem] flex items-center justify-center text-white"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                  boxShadow: '0 0 40px rgba(16,185,129,0.5), 0 20px 40px -10px rgba(16,185,129,0.3)',
                }}
              >
                <Zap size={30} fill="currentColor" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-[1.4rem] border border-emerald-400/40"
                animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-[1.4rem] border border-teal-400/30"
                animate={{ scale: [1, 1.5, 2], opacity: [0.4, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
            </motion.div>
            <motion.span
              className="text-sm font-black tracking-[0.3em] uppercase"
              style={{ color: 'rgba(110,231,183,0.8)' }}
              whileHover={{ letterSpacing: '0.4em', color: 'rgba(167,243,208,1)' }}
              transition={{ duration: 0.3 }}
            >
              TaskFlow
            </motion.span>
          </Link>

          <AnimatePresence mode="wait">
            <motion.h1
              key={isJoining ? 'join' : 'create'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-4xl font-black tracking-tight leading-none mt-4 mb-2"
              style={{ color: '#f1f5f9' }}
            >
              {isJoining ? 'Join a Workspace' : 'Create a Workspace'}
            </motion.h1>
          </AnimatePresence>

          <motion.p variants={itemVariants} style={{ color: 'rgba(148,163,184,0.9)' }} className="font-medium">
            Power up your team&apos;s productivity today.
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={cardVariants}
          style={{ rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: 'preserve-3d' }}
        >
          <motion.div
            variants={shakeVariants}
            animate={shake ? 'shake' : 'rest'}
            className="rounded-[2rem] p-8 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 32px 80px -16px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute top-0 left-[-100%] h-[1px] w-full pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(110,231,183,0.5), transparent)' }}
              animate={{ left: ['-100%', '200%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
            />

            <AnimatePresence mode="wait">
              {success ? (
                /* ── Success ── */
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center justify-center py-10 gap-4"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(16,185,129,0.1)',
                      border: '2px solid rgba(16,185,129,0.4)',
                      boxShadow: '0 0 40px rgba(16,185,129,0.3)',
                    }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <CheckCircle2 size={40} color="#10b981" strokeWidth={1.5} />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg font-black"
                    style={{ color: '#10b981' }}
                  >
                    {isJoining ? 'Joined!' : 'Workspace created!'}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm"
                    style={{ color: 'rgba(148,163,184,0.8)' }}
                  >
                    Redirecting to your dashboard…
                  </motion.p>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Tab Switcher */}
                  <div
                    className="flex items-center gap-1 mb-7 p-1 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {[{ label: '✦ Create New', val: false }, { label: '⟢ Join Existing', val: true }].map(({ label, val }) => (
                      <motion.button
                        key={label}
                        type="button"
                        onClick={() => switchTab(val)}
                        whileTap={{ scale: 0.97 }}
                        className="relative flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors z-10"
                        style={{
                          color: isJoining === val ? '#f1f5f9' : 'rgba(100,116,139,0.9)',
                        }}
                      >
                        {isJoining === val && (
                          <motion.div
                            layoutId="tabBg"
                            className="absolute inset-0 rounded-xl"
                            style={{
                              background: 'linear-gradient(135deg, rgba(5,150,105,0.6), rgba(52,211,153,0.3))',
                              border: '1px solid rgba(52,211,153,0.25)',
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Fields */}
                  <AnimatePresence mode="wait" custom={tabDir}>
                    <motion.form
                      key={isJoining ? 'join' : 'create'}
                      custom={tabDir}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Name + Workspace row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <GlowField focused={focused === 'name'}>
                          <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={set('name')}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            required
                            prefix={<User size={18} color={iconColor('name')} />}
                          />
                        </GlowField>
                        <GlowField focused={focused === 'organization'}>
                          <Input
                            label="Workspace Name"
                            placeholder={isJoining ? 'Exact workspace name' : 'Acme Corp'}
                            value={formData.organization}
                            onChange={set('organization')}
                            onFocus={() => setFocused('organization')}
                            onBlur={() => setFocused(null)}
                            required
                            prefix={<Building size={18} color={iconColor('organization')} />}
                          />
                        </GlowField>
                      </div>

                      {/* Workspace ID (join mode only) */}
                      <AnimatePresence>
                        {isJoining && (
                          <motion.div
                            key="orgId"
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: 'hidden' }}
                          >
                            <GlowField focused={focused === 'organizationId'}>
                              <Input
                                label="Workspace ID"
                                placeholder="Paste 24-character Object ID"
                                value={formData.organizationId}
                                onChange={set('organizationId')}
                                onFocus={() => setFocused('organizationId')}
                                onBlur={() => setFocused(null)}
                                required
                                prefix={<Lock size={18} color={iconColor('organizationId')} />}
                              />
                            </GlowField>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Email */}
                      <GlowField focused={focused === 'email'}>
                        <Input
                          label="Professional Email"
                          type="email"
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={set('email')}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          required
                          prefix={<Mail size={18} color={iconColor('email')} />}
                        />
                      </GlowField>

                      {/* Password */}
                      <GlowField focused={focused === 'password'}>
                        <Input
                          label="Password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={set('password')}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused(null)}
                          required
                          prefix={<Lock size={18} color={iconColor('password')} />}
                        />
                      </GlowField>

                      {/* Info strip */}
                      <motion.div
                        whileHover={{ x: 4, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3 p-4 rounded-2xl"
                        style={{
                          background: 'rgba(16,185,129,0.06)',
                          border: '1px solid rgba(16,185,129,0.15)',
                        }}
                      >
                        <div
                          className="mt-0.5 w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center"
                          style={{ background: 'rgba(16,185,129,0.12)' }}
                        >
                          <ShieldCheck size={15} color="#34d399" />
                        </div>
                        <p className="text-xs leading-relaxed font-medium" style={{ color: 'rgba(148,163,184,0.85)' }}>
                          {isJoining
                            ? "You'll get member-level access to the team's tasks immediately upon joining."
                            : 'Creating a workspace grants you full Admin control with enterprise-grade multi-tenant data isolation.'}
                        </p>
                      </motion.div>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            key="err"
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div
                              className="p-4 rounded-2xl flex items-start gap-3"
                              style={{
                                background: 'rgba(236,72,153,0.08)',
                                border: '1px solid rgba(236,72,153,0.2)',
                              }}
                            >
                              <motion.div
                                className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                                style={{ background: '#ec4899' }}
                                animate={{ scale: [1, 1.4, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                              <span className="text-sm font-semibold" style={{ color: '#f472b6' }}>
                                {error}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* CTA Button */}
                      <motion.button
                        type="submit"
                        disabled={loading || success}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="relative w-full py-4 rounded-2xl font-black text-base text-white overflow-hidden flex items-center justify-center gap-2 mt-1"
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #34d399 100%)',
                          boxShadow: '0 8px 32px -8px rgba(16,185,129,0.55), 0 0 0 1px rgba(255,255,255,0.1) inset',
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {/* Shimmer */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                            backgroundSize: '200% 100%',
                          }}
                          animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                        />

                        <AnimatePresence mode="wait">
                          {loading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              >
                                <Loader2 size={20} />
                              </motion.div>
                              <span>{isJoining ? 'Joining…' : 'Creating…'}</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <span>{isJoining ? 'Join Workspace' : 'Initialize Workspace'}</span>
                              <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <ArrowRight size={18} />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.form>
                  </AnimatePresence>

                  {/* Sign-in link */}
                  <motion.div className="mt-7 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <p className="text-sm font-medium" style={{ color: 'rgba(100,116,139,0.9)' }}>
                      Already part of a team?{' '}
                      <motion.span className="inline-block" whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
                        <Link to="/login" className="font-black transition-colors" style={{ color: '#34d399' }}>
                          Log In →
                        </Link>
                      </motion.span>
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Floating feature pills */}
        <motion.div
          variants={itemVariants}
          transition={{ delay: 0.65 }}
          className="mt-5 flex items-center justify-center gap-3 flex-wrap"
        >
          {['🔒 Isolated tenant data', '⚡ Real-time sync', '🤖 AI-powered'].map((label) => (
            <motion.span
              key={label}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(148,163,184,0.7)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
