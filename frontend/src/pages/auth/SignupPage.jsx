import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/apiClient';
import { Button, Input, Card } from '../../components/ui';
import { CheckCircle2, User, Mail, Lock, Building, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: ''
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
      const { data } = await authApi.signup(formData);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-xl mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-600 mt-2">Start managing tasks across your organization</p>
        </div>

        <Card className="p-8 glass shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Organization"
                placeholder="Acme Corp"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                required
              />
            </div>
            
            <Input
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />

            <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
               <div className="mt-1"><CheckCircle2 size={16} className="text-indigo-600" /></div>
               <p className="text-xs text-slate-600 leading-relaxed">
                  By signing up, you agree to our Terms of Service and Privacy Policy. 
                  Your data is securely isolated by tenant.
               </p>
            </div>

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
              Create Workspace
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;
