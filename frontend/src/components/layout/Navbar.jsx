import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import { CheckCircle2, Menu, X, Zap, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, confirmLogout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 ${
        scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`glass px-8 py-3 rounded-[2rem] flex items-center justify-between border-white/20 shadow-xl transition-all duration-500 ${
            scrolled ? 'bg-white/80 backdrop-blur-xl' : 'bg-transparent'
        }`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tighter themed-text">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 hover:scale-105 transition-all">Product</Link>
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 hover:scale-105 transition-all">Solutions</Link>
            <Link to="/" className="text-sm font-bold text-slate-500 hover:text-indigo-600 hover:scale-105 transition-all">Pricing</Link>
            
            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-600/5 border border-indigo-600/10">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden cursor-pointer shadow-lg shadow-indigo-600/20" onClick={() => navigate('/dashboard')}>
                          {user.profileImage ? (
                              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                              (user.name[0]).toUpperCase()
                          )}
                      </div>
                      <span className="text-sm font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                  </div>
                  <Button variant="primary" className="shadow-indigo-600/20" onClick={() => navigate('/dashboard')}>Dashboard</Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-sm font-bold text-slate-900 hover:text-indigo-600 px-4">Login</Link>
                  <Button 
                    variant="primary" 
                    className="shadow-indigo-600/20 py-3 px-8"
                    onClick={() => navigate('/signup')}
                   >
                    Join TaskFlow
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-3 rounded-2xl glass border-white/40 text-slate-900" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-32 left-8 right-8 glass p-10 rounded-[2.5rem] space-y-8 border-white/20 shadow-2xl"
          >
            <div className="space-y-6 text-center">
                <Link to="/" className="block text-2xl font-black text-slate-900" onClick={() => setIsOpen(false)}>Product</Link>
                <Link to="/" className="block text-2xl font-black text-slate-900" onClick={() => setIsOpen(false)}>Solutions</Link>
                <Link to="/" className="block text-2xl font-black text-slate-900" onClick={() => setIsOpen(false)}>Pricing</Link>
            </div>

            <hr className="border-slate-100" />
            
            <div className="flex justify-center gap-4">
                <button onClick={toggleTheme} className="w-full py-4 glass rounded-2xl flex items-center justify-center gap-2 font-bold">
                    {isDark ? <Sun size={20} /> : <Moon size={20} />} {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>

            {user ? (
               <div className="space-y-4">
                  <Button className="w-full py-5 text-xl font-black" onClick={() => { navigate('/dashboard'); setIsOpen(false); }}>Dashboard</Button>
                  <Button variant="secondary" className="w-full py-5 text-xl font-black border-pink-100 text-pink-600 h" onClick={() => { confirmLogout(); setIsOpen(false); }}>Logout</Button>
               </div>
            ) : (
              <div className="space-y-4">
                <Button variant="secondary" className="w-full py-5 text-xl font-black glass" onClick={() => { navigate('/login'); setIsOpen(false); }}>Login</Button>
                <Button className="w-full py-5 text-xl font-black shadow-indigo-600/20" onClick={() => { navigate('/signup'); setIsOpen(false); }}>Get Started</Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
