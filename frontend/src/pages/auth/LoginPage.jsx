import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Button, Input, Card } from '../../components/ui';
import { CheckCircle2, Lock, Mail, Loader2, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/* ─── Animation Variants ─────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
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
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 18, delay: 0.05 },
  },
};

/* ─── Floating Particle ──────────────────────────────────────────── */

const Particle = ({ x, y, size, duration, delay, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      background: color,
      opacity: 0,
    }}
    animate={{
      y: [0, -60, -120],
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.6],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const particles = [
  { x: 10, y: 80, size: 6, duration: 6, delay: 0,   color: 'rgba(99,102,241,0.5)' },
  { x: 25, y: 90, size: 4, duration: 8, delay: 1.2, color: 'rgba(168,85,247,0.4)' },
  { x: 50, y: 85, size: 8, duration: 7, delay: 0.5, color: 'rgba(99,102,241,0.35)' },
  { x: 75, y: 92, size: 5, duration: 9, delay: 2.1, color: 'rgba(236,72,153,0.4)' },
  { x: 88, y: 78, size: 6, duration: 6.5, delay: 0.8, color: 'rgba(168,85,247,0.5)' },
  { x: 38, y: 95, size: 3, duration: 7.5, delay: 3, color: 'rgba(99,102,241,0.3)' },
  { x: 62, y: 88, size: 5, duration: 8.5, delay: 1.7, color: 'rgba(236,72,153,0.3)' },
];

/* ─── Animated Background Grid ──────────────────────────────────── */

const GridBackground = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
    }}
  />
);

/* ─── Animated Orb ───────────────────────────────────────────────── */

const Orb = ({ className, delay = 0, duration = 10 }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none blur-[100px] ${className}`}
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.5, 0.8, 0.5],
      x: [0, 20, -15, 0],
      y: [0, -25, 10, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  />
);

/* ─── Component ──────────────────────────────────────────────────── */

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [shake, setShake]       = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const cardRotateY = useTransform(mouseX, [-300, 300], [-2, 2]);

  useEffect(() => {
    const handleMouse = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set(e.clientX - cx);
      mouseY.set(e.clientY - cy);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShake(false);
    try {
      const { data } = await authApi.login({ email, password });
      setSuccess(true);
      setTimeout(() => {
        login(data.user, data.token);
        navigate('/dashboard');
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #121228 40%, #1a0533 100%)',
      }}
    >
      {/* Grid */}
      <GridBackground />

      {/* Animated Orbs */}
      <Orb className="w-[500px] h-[500px] bg-indigo-600/20 top-[-10%] right-[-5%]" delay={0} duration={12} />
      <Orb className="w-[400px] h-[400px] bg-purple-700/20 bottom-[-10%] left-[-5%]" delay={2} duration={10} />
      <Orb className="w-[300px] h-[300px] bg-pink-600/15 top-[40%] left-[20%]" delay={4} duration={14} />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[460px] relative z-10"
        style={{ perspective: 1000 }}
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
              transition={{ duration: 0.45 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-[1.4rem] flex items-center justify-center text-white shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 20px 40px -10px rgba(99,102,241,0.3)',
                }}
              >
                <Zap size={30} fill="currentColor" />
              </div>
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-[1.4rem] border border-indigo-400/40"
                animate={{ scale: [1, 1.3, 1.6], opacity: [0.6, 0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-[1.4rem] border border-purple-400/30"
                animate={{ scale: [1, 1.5, 2], opacity: [0.4, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
            </motion.div>
            <motion.span
              className="text-sm font-black tracking-[0.3em] uppercase"
              style={{ color: 'rgba(165,180,252,0.8)' }}
              whileHover={{ letterSpacing: '0.4em', color: 'rgba(199,210,254,1)' }}
              transition={{ duration: 0.3 }}
            >
              TaskFlow
            </motion.span>
          </Link>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-black tracking-tight leading-none mt-4 mb-2"
            style={{ color: '#f1f5f9' }}
          >
            Welcome back
          </motion.h1>
          <motion.p variants={itemVariants} style={{ color: 'rgba(148,163,184,0.9)' }} className="font-medium">
            Sign in to continue your journey
          </motion.p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={cardVariants}
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            variants={shakeVariants}
            animate={shake ? 'shake' : 'rest'}
            className="rounded-[2rem] p-8 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 32px 80px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Card inner shimmer line */}
            <motion.div
              className="absolute top-0 left-[-100%] h-[1px] w-full pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(165,180,252,0.6), transparent)',
              }}
              animate={{ left: ['−100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
            />

            <AnimatePresence mode="wait">
              {success ? (
                /* ── Success State ── */
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
                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                      border: '2px solid rgba(16,185,129,0.4)',
                      boxShadow: '0 0 40px rgba(16,185,129,0.3)',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
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
                    Signed in!
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
                /* ── Form State ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Email Field */}
                  <motion.div
                    variants={itemVariants}
                    className="relative"
                    animate={focusedField === 'email' ? { y: -2 } : { y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence>
                      {focusedField === 'email' && (
                        <motion.div
                          layoutId="field-glow"
                          className="absolute -inset-1 rounded-2xl pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                            border: '1px solid rgba(99,102,241,0.3)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </AnimatePresence>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      prefix={
                        <motion.div
                          animate={focusedField === 'email' ? { color: '#818cf8' } : { color: '#64748b' }}
                          transition={{ duration: 0.2 }}
                        >
                          <Mail size={18} />
                        </motion.div>
                      }
                    />
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    variants={itemVariants}
                    className="space-y-1 relative"
                    animate={focusedField === 'password' ? { y: -2 } : { y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatePresence>
                      {focusedField === 'password' && (
                        <motion.div
                          layoutId="field-glow"
                          className="absolute -inset-1 rounded-2xl pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)',
                            border: '1px solid rgba(99,102,241,0.3)',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        />
                      )}
                    </AnimatePresence>
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: 'rgba(148,163,184,0.8)' }}>
                        Password
                      </label>
                      <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                        <Link to="/"
                          className="text-xs font-bold transition-colors"
                          style={{ color: '#818cf8' }}
                        >
                          Forgot Password?
                        </Link>
                      </motion.div>
                    </div>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      prefix={
                        <motion.div
                          animate={focusedField === 'password' ? { color: '#818cf8' } : { color: '#64748b' }}
                          transition={{ duration: 0.2 }}
                        >
                          <Lock size={18} />
                        </motion.div>
                      }
                    />
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
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

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <motion.button
                      type="submit"
                      disabled={loading || success}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="relative w-full py-4 rounded-2xl font-black text-base text-white overflow-hidden flex items-center justify-center gap-2 mt-2"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        boxShadow: '0 8px 32px -8px rgba(99,102,241,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {/* Shimmer sweep */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
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
                            <span>Signing in…</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <span>Sign In</span>
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
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Sign-up link */}
        <motion.div
          variants={itemVariants}
          className="mt-6 text-center"
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(100,116,139,0.9)' }}>
            New to TaskFlow?{' '}
            <motion.span className="inline-block" whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
              <Link
                to="/signup"
                className="font-black transition-colors"
                style={{ color: '#818cf8' }}
              >
                Create Workspace →
              </Link>
            </motion.span>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        <motion.div
          variants={itemVariants}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="mt-5 p-4 rounded-2xl text-center cursor-default"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={13} color="#a5b4fc" />
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(148,163,184,0.6)' }}>
              Demo Credentials
            </p>
            <motion.div
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            >
              <Sparkles size={13} color="#a5b4fc" />
            </motion.div>
          </div>
          <motion.p
            className="text-sm font-black tracking-wide"
            style={{ color: '#a5b4fc' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            admin@demo.com &nbsp;•&nbsp; password
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
