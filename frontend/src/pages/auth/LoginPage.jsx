import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Button, Input, Card } from '../../components/ui';
import { CheckCircle2, Lock, Mail, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-mesh">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-xl mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-600 mt-2">Sign in to manage your tasks</p>
        </div>

        <Card className="p-8 glass shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              prefix={<Mail size={18} className="text-slate-400" />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              prefix={<Lock size={18} className="text-slate-400" />}
            />

            {error && (
              <div className="p-3 bg-pink-50 border border-pink-100 text-pink-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 flex items-center justify-center gap-2"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign up for free
            </Link>
          </div>
        </Card>
        
        {/* Demo Credentials Tip */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
            <p className="text-xs text-indigo-600 font-medium">Demo: admin@demo.com / password</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
