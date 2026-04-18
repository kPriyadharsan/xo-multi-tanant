import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Info, Trash2, Check } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, clearAll, markAllAsRead } = useNotificationStore();

  const typeIcons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertCircle className="text-pink-500" size={18} />,
    info: <Info className="text-indigo-500" size={18} />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle click-away backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-transparent"
          />
          
          {/* Floating Apple-style Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-6 top-24 w-full max-w-[380px] max-h-[80vh] rounded-[2rem] z-[60] flex flex-col shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/40 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between bg-white/40 dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl">
                    <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-[15px] tracking-tight">Notification Center</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border border-indigo-600/20">
                    {notifications.filter(n => !n.read).length} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={markAllAsRead} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors" title="Mark All as Read">
                  <Check size={16} />
                </button>
                <button onClick={clearAll} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors" title="Clear All">
                  <Trash2 size={16} />
                </button>
                <button onClick={onClose} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors ml-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <motion.div
                    key={n._id || n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => markAsRead(n._id || n.id)}
                    className={`relative p-4 rounded-2xl transition-all cursor-pointer shadow-sm border ${
                      n.read 
                        ? 'bg-white/50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50' 
                        : 'bg-white dark:bg-slate-800 border-indigo-500/20 dark:border-indigo-500/30 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${n.read ? 'bg-slate-100 dark:bg-slate-700' : 'bg-indigo-50 dark:bg-indigo-500/10'}`}>
                         {typeIcons[n.type] || <Info className="text-indigo-500" size={16} />}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`text-[14px] truncate ${n.read ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-900 dark:text-white font-semibold'}`}>{n.title}</p>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">{n.message}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 font-medium tracking-wide uppercase">{n.createdAt ? dayjs(n.createdAt).fromNow() : n.time}</p>
                      </div>
                      {!n.read && (
                         <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center py-12">
                  <div className="w-16 h-16 bg-slate-200/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                     <Bell size={24} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">You're all caught up</p>
                  <p className="text-[13px] mt-1 text-slate-500 dark:text-slate-400">No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
