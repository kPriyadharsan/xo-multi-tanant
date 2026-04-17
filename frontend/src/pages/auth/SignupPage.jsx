import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Button, Input, Card } from '../../components/ui';
import { CheckCircle2, User, Mail, Lock, Building, Loader2, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [isJoining, setIsJoining] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    organizationId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData };
      if (!isJoining) {
         delete payload.organizationId;
      }
      const { data } = await authApi.signup(payload);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh relative overflow-hidden">
      {/* Metabolic Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[130px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-teal-500/10 blur-[130px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-[560px] relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 group-hover:rotate-6 transition-transform">
              <Zap size={28} fill="currentColor" />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
             {isJoining ? "Join Workspace" : "Create Workspace"}
          </h1>
          <p className="text-slate-500 font-medium">Power up your team&apos;s productivity today.</p>
        </div>

        <Card className="p-10 glass rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.1)] border-white/40">
          <div className="flex items-center justify-center gap-6 mb-8 border-b border-emerald-600/10 pb-4">
             <button 
                type="button" 
                onClick={() => { setIsJoining(false); setError(''); }} 
                className={`text-sm font-bold transition-all relative ${!isJoining ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Create New
                {!isJoining && <motion.div layoutId="activeTab" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-emerald-600" />}
             </button>
             <button 
                type="button" 
                onClick={() => { setIsJoining(true); setError(''); }} 
                className={`text-sm font-bold transition-all relative ${isJoining ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
             >
                Join Existing
                {isJoining && <motion.div layoutId="activeTab" className="absolute -bottom-4 left-0 right-0 h-0.5 bg-emerald-600" />}
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Your Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                prefix={<User size={18} className="text-slate-400" />}
              />
              <Input
                label="Workspace Name"
                placeholder={isJoining ? "Exact Workspace Name" : "Acme Corp"}
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                required
                prefix={<Building size={18} className="text-slate-400" />}
              />
            </div>
            
            {isJoining && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <Input
                  label="Workspace ID"
                  placeholder="Paste 24-character Object ID"
                  value={formData.organizationId}
                  onChange={(e) => setFormData({...formData, organizationId: e.target.value})}
                  required
                  prefix={<Lock size={18} className="text-slate-400" />}
                />
              </motion.div>
            )}

            <Input
              label="Professional Email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              prefix={<Mail size={18} className="text-slate-400" />}
            />
            
            <Input
              label="Choice Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              prefix={<Lock size={18} className="text-slate-400" />}
            />

            <motion.div 
               whileHover={{ x: 5 }}
               className="flex items-start gap-4 p-5 bg-emerald-600/5 rounded-2xl border border-emerald-600/10 group transition-all"
            >
               <div className="mt-1 w-8 h-8 min-w-[32px] rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Sparkles size={16} />
               </div>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isJoining 
                    ? "Welcome to the team! Upon joining, you'll instantly get member-level access to your organization's tasks."
                    : "By creating a workspace, you unlock enterprise-grade multi-tenant isolation and become the Admin."}
               </p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-pink-500/10 border border-pink-500/20 text-pink-600 rounded-2xl text-sm font-bold flex items-center gap-3"
              >
                <div className="min-w-[6px] w-1.5 h-1.5 rounded-full bg-pink-600" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-5 text-xl font-black shadow-none border-0"
              loading={loading}
              style={{ backgroundColor: '#10b981', color: '#fff' }}
            >
               {isJoining ? "Join Workspace" : "Initialize Workspace"}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm">
                Already part of a team? {' '}
                <Link to="/login" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors">
                  Log In
                </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
