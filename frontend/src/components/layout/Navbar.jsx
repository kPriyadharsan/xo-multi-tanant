import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import { Menu, X, Zap, Moon, Sun, ArrowRight, Sparkles } from 'lucide-react';
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
        <div className={`px-6 py-3.5 rounded-[2.5rem] flex items-center justify-between shadow-2xl transition-all duration-500 border ${
          scrolled
            ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border-white/40 dark:border-white/10 shadow-emerald-500/5'
            : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-white/5 shadow-none'
        }`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl blur-[6px] opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <Zap size={22} fill="currentColor" className="text-emerald-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">
                TaskFlow
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-[0.2em] leading-none mt-1 uppercase">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1 mr-4">
               {['Platform', 'Solutions', 'Pricing', 'Docs'].map(item => (
                 <Link key={item} to={`/${item.toLowerCase()}`} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/5">
                   {item}
                 </Link>
               ))}
            </nav>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-all group"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-[12px] font-black overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (user.name[0]).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user.name.split(' ')[0]}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Sign in
                </Link>
                <Button
                  variant="primary"
                  className="py-3 px-6 text-sm font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
                  onClick={() => navigate('/signup')}
                >
                  Start free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white transition-all active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="md:hidden mx-6 mt-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-white/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2 mb-4">
              {['Platform', 'Solutions', 'Pricing', 'Docs'].map(item => (
                 <Link key={item} to={`/${item.toLowerCase()}`} onClick={() => setIsOpen(false)} className="px-6 py-4 text-lg font-bold text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-between group">
                   {item}
                   <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                 </Link>
              ))}
            </div>

            <div className="h-px bg-slate-100 dark:bg-white/10 w-full mb-4" />

            <button
              onClick={toggleTheme}
              className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </button>

            {user ? (
              <div className="space-y-4">
                <Button
                  className="w-full py-5 text-base font-black rounded-2xl"
                  onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                >
                  Go to Dashboard
                </Button>
                <button
                  className="w-full py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/5 rounded-2xl transition-all"
                  onClick={() => { confirmLogout(); setIsOpen(false); }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  variant="secondary"
                  className="w-full py-5 text-base font-bold rounded-2xl border-slate-200 dark:border-white/10"
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                >
                  Sign in
                </Button>
                <Button
                  className="w-full py-5 text-base font-black rounded-2xl shadow-xl shadow-emerald-500/20"
                  onClick={() => { navigate('/signup'); setIsOpen(false); }}
                >
                  Get started for free
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
