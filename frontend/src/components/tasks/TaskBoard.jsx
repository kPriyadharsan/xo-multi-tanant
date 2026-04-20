import React from 'react';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskBoard = ({ tasks, onAddTask, onEditTask, onUpdateStatus }) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-400', glow: 'shadow-slate-500/10' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-emerald-500', glow: 'shadow-emerald-500/10' },
    { id: 'completed', title: 'Completed', color: 'bg-teal-500', glow: 'shadow-teal-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full min-h-[600px] items-start">
      {columns.map((column, i) => (
        <motion.div 
          key={column.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col h-full bg-slate-50/40 dark:bg-white/[0.02] rounded-[2.5rem] p-7 border border-slate-200/50 dark:border-white/[0.05] backdrop-blur-3xl shadow-inner relative group/column"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${column.color} shadow-lg ${column.glow} animate-pulse`} />
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-[11px] tracking-[0.25em]">
                {column.title}
                <span className="ml-3 text-[10px] text-slate-400 dark:text-slate-500 font-black bg-white dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/10 shadow-sm leading-none inline-block align-middle">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </h3>
            </div>
            <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 rounded-xl hover:bg-white dark:hover:bg-white/10 transition-all opacity-0 group-hover/column:opacity-100">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Cards Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-5 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {tasks
                .filter(t => t.status === column.id)
                .map(task => (
                  <TaskCard 
                    key={task._id || task.id} 
                    task={task} 
                    onEdit={onEditTask} 
                    onUpdateStatus={onUpdateStatus} 
                  />
                ))}
            </AnimatePresence>

            {/* Quick Add Button */}
            <motion.button
              whileHover={{ scale: 1.01, y: -2 }}
              whileActive={{ scale: 0.98 }}
              onClick={() => onAddTask(column.id)}
              className="w-full py-5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-white/5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 group/btn"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-colors">
                <Plus size={14} className="group-hover/btn:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">Add Task</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskBoard;
