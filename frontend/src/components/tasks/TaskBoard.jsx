import React from 'react';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskBoard = ({ tasks, onAddTask, onEditTask, onUpdateStatus }) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-500', glow: 'shadow-slate-500/10' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-indigo-500', glow: 'shadow-indigo-500/10' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-500', glow: 'shadow-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full min-h-[600px] items-start">
      {columns.map((column, i) => (
        <motion.div 
          key={column.id} 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col h-full bg-slate-50/40 rounded-[2.5rem] p-6 border border-slate-100/50 backdrop-blur-sm shadow-inner"
        >
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${column.color} shadow-lg ${column.glow}`} />
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">
                {column.title}
                <span className="ml-3 text-slate-400 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-100">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </h3>
            </div>
            <button className="text-slate-400 hover:text-slate-900 p-2 rounded-xl hover:bg-white transition-all shadow-sm">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 min-h-[300px]">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileActive={{ scale: 0.98 }}
              onClick={() => onAddTask(column.id)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-500/50 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-bold">New Task</span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskBoard;

export default TaskBoard;
