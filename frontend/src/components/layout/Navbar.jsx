import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import { CheckCircle2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, confirmLogout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass px-6 py-3 rounded-2xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-800 to-indigo-600">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-slate-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard/profile')}>
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            user.name[0]
                        )}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{user.name.split(' ')[0]}</span>
                </div>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                <Button variant="primary" onClick={confirmLogout}>Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="primary" onClick={() => navigate('/signup')}>Get Started</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-4 right-4 glass p-6 rounded-2xl space-y-4"
          >
            <Link to="/features" className="block text-lg font-medium text-slate-600" onClick={() => setIsOpen(false)}>Features</Link>
            <Link to="/pricing" className="block text-lg font-medium text-slate-600" onClick={() => setIsOpen(false)}>Pricing</Link>
            <hr className="border-slate-100" />
            {user ? (
              <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => { confirmLogout(); setIsOpen(false); }}>
                Logout
              </Button>
            ) : (
              <div className="space-y-3">
                <Button variant="ghost" className="w-full" onClick={() => { navigate('/login'); setIsOpen(false); }}>Login</Button>
                <Button className="w-full" onClick={() => { navigate('/signup'); setIsOpen(false); }}>Get Started</Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
