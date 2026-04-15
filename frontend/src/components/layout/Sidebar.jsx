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

      <motion.aside
        initial={false}
        animate={{ 
            width: isOpen ? 280 : 80,
            x: 0 
        }}
        className={`fixed left-0 top-0 h-screen themed-bg border-r themed-border z-50 flex flex-col transition-all duration-500 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-x-hidden shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)]`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center px-6 justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Zap size={22} fill="currentColor" />
             </div>
             {isOpen && (
               <motion.span 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="text-xl font-black text-slate-900 tracking-tight"
                >
                    TaskFlow
                </motion.span>
             )}
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
                flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}
              `}
            >
              <item.icon size={22} className={isOpen ? 'min-w-[22px]' : 'mx-auto group-hover:scale-110 transition-transform'} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-sm tracking-tight"
                >
                    {item.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Card */}
        <div className="p-4 mt-auto">
          <div className={`p-4 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all duration-300 ${!isOpen && 'px-2'}`}>
            <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 ring-4 ring-white shadow-sm flex items-center justify-center font-bold overflow-hidden text-indigo-600">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (user?.name?.[0] || 'U').toUpperCase()
                )}
              </div>
              {isOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-widest truncate">{user?.role || 'Member'}</p>
                </div>
              )}
            </div>
            
            {isOpen && (
               <button
                 onClick={confirmLogout}
                 className="mt-6 flex items-center justify-center gap-3 w-full py-3 rounded-2xl bg-white border border-slate-200 text-pink-600 hover:bg-pink-50 hover:border-pink-100 transition-all font-bold text-sm shadow-sm active:scale-95"
               >
                 <LogOut size={18} />
                 <span>Logout</span>
               </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
