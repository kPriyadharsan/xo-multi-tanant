import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

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
              <button className="relative hover:text-indigo-600 transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
              </button>
              <button className="hover:text-indigo-600 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
