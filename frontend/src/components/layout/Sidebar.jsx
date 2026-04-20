import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggle }) => {
  const { confirmLogout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: CheckSquare, label: 'My Tasks', path: '/dashboard/tasks' },
    { icon: BarChart3, label: 'Activity', path: '/dashboard/activity' },
    { icon: Users, label: 'Team', path: '/dashboard/team' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggle}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-4 top-4 bottom-4 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          backdrop-blur-3xl bg-white/80 dark:bg-slate-900/80 border border-white/50 dark:border-white/10
          rounded-[2.5rem] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)]
          ${isOpen ? 'w-[280px] translate-x-0' : 'w-[280px] md:w-[88px] -translate-x-[calc(100%+1rem)] md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[14px] blur opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative min-w-[42px] w-[42px] h-[42px] rounded-[14px] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl shadow-emerald-500/10">
                <Zap size={22} fill="currentColor" className="text-emerald-500" />
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'w-36 opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-[20px] font-black text-slate-900 dark:text-white tracking-tighter whitespace-nowrap">
                TaskFlow
              </span>
            </div>
          </div>
          <button
            onClick={toggle}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hidden md:flex items-center justify-center border border-transparent hover:border-slate-200 dark:hover:border-white/10"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                  ${isActive
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                
                <item.icon
                  size={20}
                  className={`relative z-10 min-w-[20px] transition-transform duration-300 group-hover:scale-110 
                    ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''} ${!isOpen ? 'mx-auto' : ''}`}
                />
                
                <div className={`relative z-10 overflow-hidden transition-all duration-500 whitespace-nowrap ${isOpen ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                  <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-semibold'}`}>
                    {item.label}
                  </span>
                </div>

                {isActive && isOpen && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="relative z-10 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] ml-auto" 
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Pro Banner */}
        {isOpen && (
          <div className="px-5 mb-4">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-emerald-500/20">
              <Sparkles className="absolute -right-2 -top-2 w-16 h-16 text-white/10 group-hover:scale-125 transition-transform duration-500" />
              <p className="text-[11px] font-black uppercase tracking-widest opacity-80 mb-1">Upgrade</p>
              <p className="text-sm font-bold leading-tight mb-3">Get advanced AI analytics</p>
              <button className="w-full py-2 bg-white text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Profile Area */}
        <div className="p-4 flex-shrink-0">
          <div className={`p-4 rounded-[2rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] transition-all duration-300 ${!isOpen ? 'px-2' : ''}`}>
            <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
              <div className="relative flex-shrink-0">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl blur-[2px] opacity-40" />
                <div className="relative min-w-[44px] w-[44px] h-[44px] rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center font-bold overflow-hidden text-slate-800 dark:text-white text-sm">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (user?.name?.[0] || 'U').toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              
              <div className={`overflow-hidden transition-all duration-500 flex-1 min-w-0 ${isOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate">{user?.role || 'Member'}</p>
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <button
                    onClick={confirmLogout}
                    className="flex items-center justify-center gap-2.5 w-full mt-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all text-[13px] font-bold active:scale-95 border border-transparent hover:border-rose-500/20"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
