import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, toggle }) => {
  const { confirmLogout, user } = useAuth();

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-3 top-3 bottom-3 z-50 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          backdrop-blur-3xl bg-white/70 dark:bg-slate-900/70 border border-white/50 dark:border-white/10
          rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
          ${isOpen ? 'w-[256px] translate-x-0' : 'w-[256px] md:w-[72px] -translate-x-[calc(100%+0.75rem)] md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-5 justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="min-w-[38px] w-[38px] h-[38px] rounded-[14px] bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-36 opacity-100' : 'w-0 opacity-0'}`}>
              <span className="text-[17px] font-extrabold text-slate-800 dark:text-white tracking-tight whitespace-nowrap">
                TaskFlow
              </span>
            </div>
          </div>
          <button
            onClick={toggle}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 transition-all hidden md:flex items-center justify-center"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-slate-200/60 dark:bg-white/5 flex-shrink-0" />

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-3.5 px-3.5 py-3 rounded-[14px] transition-all duration-200 group overflow-hidden relative
                ${isActive
                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-black/4 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={20}
                    className={`min-w-[20px] transition-all ${!isOpen ? 'mx-auto' : ''} ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                  />
                  <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isOpen ? 'w-36 opacity-100' : 'w-0 opacity-0'}`}>
                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-slate-200/60 dark:bg-white/5 flex-shrink-0" />

        {/* User Profile Card */}
        <div className="p-3 flex-shrink-0">
          <div className={`p-3 rounded-[18px] bg-black/3 dark:bg-white/5 transition-all duration-300 ${!isOpen ? 'px-2' : ''}`}>
            <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center' : ''}`}>
              <div className="min-w-[40px] w-10 h-10 rounded-[12px] bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md flex items-center justify-center font-bold overflow-hidden text-white text-sm flex-shrink-0">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.[0] || 'U').toUpperCase()
                )}
              </div>
              <div className={`overflow-hidden transition-all duration-300 flex-1 min-w-0 ${isOpen ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}>
                <p className="text-[13px] font-semibold text-slate-800 dark:text-white truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate mt-0.5">{user?.role || 'Member'}</p>
              </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-16 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
              <button
                onClick={confirmLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[12px] text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-semibold active:scale-95 whitespace-nowrap"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
