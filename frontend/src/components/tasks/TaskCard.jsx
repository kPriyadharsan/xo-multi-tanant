import React from 'react';
import { Card } from '../ui';
import { 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  MoreHorizontal,
  Flag,
  Tag,
  Users,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = React.memo(({ task, onEdit, onUpdateStatus }) => {
  const priorityConfig = {
    high: { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' },
    medium: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' },
    low: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' }
  };

  const p = priorityConfig[task.priority] || priorityConfig.low;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group mb-5"
    >
      <div className={`relative p-5 rounded-[2rem] transition-all duration-300 border bg-white dark:bg-slate-900 shadow-sm group-hover:shadow-2xl group-hover:shadow-emerald-500/5 ${
        task.status === 'completed' ? 'opacity-80 grayscale-[0.5]' : ''
      } ${
        task.status === 'in-progress' ? 'border-emerald-500/30' : 'border-slate-200/60 dark:border-white/10'
      }`}>
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-px bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.bg} ${p.color} ${p.border}`}>
              {task.priority}
            </span>
            {task.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase border border-transparent">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        <div className="cursor-pointer" onClick={() => onEdit(task)}>
           <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              {task.title}
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
           </h4>
           <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-5 font-medium leading-relaxed">
             {task.description || 'No description provided.'}
           </p>
        </div>

        {/* Progress Strip */}
        {task.subtasks?.length > 0 && (
          <div className="mb-5">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-widest">
              <span>Progress</span>
              <span>{Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-transparent">
              <Clock size={12} />
              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
              {task.assignedTo?.length > 0 ? (
                task.assignedTo.map((user, i) => (
                  <div key={user._id || i} className="relative group/avatar">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg blur-[1px] opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    <div className="relative w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[11px] font-black text-emerald-700 dark:text-emerald-400 overflow-hidden shadow-sm" title={user.name}>
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        (user.name?.[0] || 'U').toUpperCase()
                      )}
                    </div>
                  </div>
                ))
              ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                      <Users size={12} />
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
