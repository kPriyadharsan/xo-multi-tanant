import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationPanel from './NotificationPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useNotificationStore from '../../store/useNotificationStore';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { user } = useAuth();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main 
        className={`transition-all duration-300 min-h-screen ${
          isSidebarOpen ? 'md:pl-[260px]' : 'md:pl-[80px]'
        }`}
      >
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500">
                <Menu size={24} />
             </button>
             <span className="text-xl font-bold font-indigo-600">TaskFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
             <Search size={18} />
             <input type="text" placeholder="Quick search..." className="bg-transparent outline-none text-sm w-64" />
             <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm font-bold text-slate-400">⌘K</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-xs font-bold leading-none">{user?.tenantId || 'Pro Plan'}</span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-400">
              <button 
                className="relative hover:text-indigo-600 transition-colors p-2"
                onClick={() => setIsNotifOpen(true)}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-pink-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button className="hover:text-indigo-600 transition-colors p-2">
                <Settings size={22} />
              </button>
            </div>
          </div>
        </header>

        <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

        {/* Content Area */}
        <section className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
