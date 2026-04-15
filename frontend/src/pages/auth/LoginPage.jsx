import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Button, Input, Card } from '../../components/ui';
import { CheckCircle2, Lock, Mail, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authApi.login({ email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh relative overflow-hidden">
      {/* Metabolic Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/10 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 group-hover:rotate-6 transition-transform">
              <Zap size={28} fill="currentColor" />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Continue your journey with TaskFlow</p>
        </div>

        <Card className="p-10 glass rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              prefix={<Mail size={20} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />}
            />
            <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <Link to="/" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot Password?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  prefix={<Lock size={20} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />}
                />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-pink-500/10 border border-pink-500/20 text-pink-600 rounded-2xl text-sm font-bold flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-5 text-xl font-black shadow-none mt-2"
              loading={loading}
            >
              Log In
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm">
                New to TaskFlow? {' '}
                <Link to="/signup" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors">
                  Create Workspace
                </Link>
            </p>
          </div>
        </Card>
        
        {/* Demo Credentials Tip */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-5 rounded-3xl glass-dark bg-slate-900 border-slate-800 text-center"
        >
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Demo Credentials</p>
            <p className="text-sm text-indigo-400 font-black mt-2 tracking-wide">admin@demo.com {' • '} password</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
