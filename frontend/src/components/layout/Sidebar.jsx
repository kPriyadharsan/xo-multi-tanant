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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 h-screen themed-bg border-r themed-border z-50 flex flex-col transition-all duration-300 ease-in-out shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] ${
            isOpen ? 'w-[280px] translate-x-0' : 'w-[280px] md:w-[80px] -translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
             <div className="min-w-[40px] w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Zap size={22} fill="currentColor" />
             </div>
             <div className={`overflow-hidden transition-all duration-300 flex-1 whitespace-nowrap ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
               <span className="text-xl font-black themed-text tracking-tight">
                  TaskFlow
               </span>
             </div>
          </div>
          <button 
            onClick={toggle} 
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors hidden md:block"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden
                ${isActive 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                  : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}
              `}
            >
              <item.icon size={22} className={`min-w-[22px] transition-transform ${!isOpen && 'mx-auto group-hover:scale-110'}`} />
              <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isOpen ? 'w-40 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 md:-translate-x-0'}`}>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 mt-auto">
          <div className={`p-4 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 transition-all duration-300 ${!isOpen && 'px-2'}`}>
            <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
              <div className="min-w-[48px] w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 ring-4 ring-white dark:ring-slate-900 shadow-sm flex items-center justify-center font-bold overflow-hidden text-emerald-600 dark:text-emerald-400">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.[0] || 'U').toUpperCase()
                )}
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <div className="whitespace-nowrap">
                  <p className="text-sm font-black themed-text truncate leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-bold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-widest truncate">{user?.role || 'Member'}</p>
                </div>
              </div>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-20 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
               <button
                 onClick={confirmLogout}
                 className="flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-all font-bold text-sm shadow-sm active:scale-95 whitespace-nowrap"
               >
                 <LogOut size={18} />
                 <span>Logout</span>
               </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
