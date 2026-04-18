import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useNotificationStore from '../../store/useNotificationStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main
        className={`transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] min-h-screen ${
          isSidebarOpen ? 'md:pl-[calc(256px+24px)]' : 'md:pl-[calc(72px+24px)]'
        }`}
      >
        {/* Apple-style Floating Top Header */}
        <header className="sticky top-0 z-30 px-6 pt-4 pb-2">
          <div className="flex items-center justify-between h-16 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border border-white/50 dark:border-white/10 rounded-[20px] px-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-none">

            {/* Left: Mobile menu / Search */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 transition-all md:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="hidden md:flex items-center gap-3 text-slate-400 bg-black/4 dark:bg-white/5 px-4 py-2.5 rounded-[14px] border border-transparent focus-within:border-emerald-500/30 focus-within:bg-white dark:focus-within:bg-slate-800 transition-all duration-300 w-64">
                <Search size={16} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                />
                <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded-md font-bold text-slate-400 hidden sm:block">⌘K</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Role badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider leading-none">{user?.role || 'Member'}</span>
              </div>

              {/* Notification Bell */}
              <button
                className="relative p-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
                onClick={() => setIsNotifOpen(v => !v)}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] flex items-center justify-center rounded-full font-black border-2 border-white dark:border-slate-900"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              {/* Settings */}
              <Link
                to="/dashboard/settings"
                className="p-2.5 rounded-[12px] hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all flex items-center"
              >
                <Settings size={20} />
              </Link>

              {/* Avatar */}
              <div className="ml-1 w-9 h-9 rounded-[12px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-md overflow-hidden cursor-pointer">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.[0] || 'U').toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

        {/* Content Area */}
        <section className="px-6 py-4 max-w-[1600px] mx-auto min-h-[calc(100vh-100px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
