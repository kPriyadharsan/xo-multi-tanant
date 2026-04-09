import React from 'react';
import TaskCard from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskBoard = ({ tasks, onAddTask }) => {
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-indigo-500' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
      {columns.map(column => (
        <div key={column.id} className="flex flex-col h-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${column.color}`} />
              <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">
                {column.title}
                <span className="ml-2 text-slate-400 font-medium">
                  ({tasks.filter(t => t.status === column.id).length})
                </span>
              </h3>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <AnimatePresence mode="popLayout">
              {tasks
                .filter(t => t.status === column.id)
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </AnimatePresence>

            <button
              onClick={() => onAddTask(column.id)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              <span className="text-sm font-semibold">Add Task</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
