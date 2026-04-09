import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';
import useNotificationStore from '../../store/useNotificationStore';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, clearAll } = useNotificationStore();

  const typeIcons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertCircle className="text-pink-500" size={18} />,
    info: <Info className="text-indigo-500" size={18} />
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[55] bg-slate-900/10 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[60] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-slate-900" />
                <h3 className="font-bold text-slate-900 text-lg">Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter(n => !n.read).length} New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearAll} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 group" title="Clear All">
                  <Trash2 size={18} className="group-hover:text-pink-600 transition-colors" />
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      n.read ? 'bg-white border-slate-100' : 'bg-indigo-50/30 border-indigo-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{typeIcons[n.type]}</div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5" />}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-10">
                  <Bell size={48} className="mb-4" />
                  <p className="text-sm font-bold">All caught up!</p>
                  <p className="text-xs mt-1">No new notifications</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
               <button className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  View Notification History
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
