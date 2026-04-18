import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import { Menu, X, Zap, Moon, Sun } from 'lucide-react';
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
      scrolled ? 'py-3' : 'py-6'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className={`px-6 py-3 rounded-[2rem] flex items-center justify-between shadow-xl transition-all duration-500 border ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-white/50 dark:border-white/10'
            : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/30 dark:border-white/5'
        }`}>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[12px] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-[20px] font-extrabold tracking-tight text-slate-900 dark:text-white">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-[12px] text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2.5 px-3 py-2 rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/15 transition-all"
                  onClick={() => navigate('/dashboard')}
                >
                  <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-[11px] font-bold overflow-hidden shadow-sm">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (user.name[0]).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white leading-none">{user.name.split(' ')[0]}</span>
                </div>
                <Button variant="primary" className="py-2.5 px-5 text-sm shadow-emerald-500/20" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-[12px] hover:bg-black/4 dark:hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Button
                  variant="primary"
                  className="py-2.5 px-5 text-sm shadow-emerald-500/20 hover:-translate-y-0.5 transition-all"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 rounded-[12px] bg-black/5 dark:bg-white/10 text-slate-700 dark:text-white"
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
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="md:hidden mx-6 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-6 rounded-[2rem] shadow-2xl space-y-4"
          >
            <button
              onClick={toggleTheme}
              className="w-full py-3 rounded-[14px] bg-black/4 dark:bg-white/5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user ? (
              <div className="space-y-3">
                <Button
                  className="w-full py-4 text-base font-semibold"
                  onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="secondary"
                  className="w-full py-4 text-base font-semibold text-rose-600 border-rose-100 dark:border-rose-500/20"
                  onClick={() => { confirmLogout(); setIsOpen(false); }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="secondary"
                  className="w-full py-4 text-base font-semibold"
                  onClick={() => { navigate('/login'); setIsOpen(false); }}
                >
                  Login
                </Button>
                <Button
                  className="w-full py-4 text-base font-semibold shadow-emerald-500/20"
                  onClick={() => { navigate('/signup'); setIsOpen(false); }}
                >
                  Get Started
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
