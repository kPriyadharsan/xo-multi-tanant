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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggle }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: CheckSquare, label: 'My Tasks', path: '/dashboard/tasks' },
    { icon: BarChart3, label: 'Activity', path: '/dashboard/activity' },
    { icon: Users, label: 'Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 80 }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-40 hidden md:flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <span className="text-xl font-bold text-indigo-600">TaskFlow</span>
        )}
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) => `
              flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <item.icon size={22} className={isOpen ? 'min-w-[22px]' : 'mx-auto'} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 mb-4 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`flex items-center gap-4 w-full px-3 py-3 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors ${!isOpen && 'justify-center'}`}
        >
          <LogOut size={22} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
