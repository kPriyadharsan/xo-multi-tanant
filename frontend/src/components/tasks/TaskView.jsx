import React, { useState, useEffect } from 'react';
import useTaskStore from '../../store/useTaskStore';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import { Button } from '../ui';
import { Search, Filter, Plus, SlidersHorizontal, Sparkles, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskView = () => {
  const { tasks, addTask, updateTask, updateTaskStatus, filters, setFilters, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalInitialStatus, setModalInitialStatus] = useState('todo');

  const openAddModal = (status = 'todo') => {
    setEditingTask(null);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask._id || editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title?.toLowerCase() || '').includes(filters.search.toLowerCase()) || 
                         (task.description?.toLowerCase() || '').includes(filters.search.toLowerCase());
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
              Workspace
            </span>
            <div className="h-px w-8 bg-slate-200 dark:bg-white/10" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tasks Board</span>
          </motion.div>
          
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Project <span className="text-emerald-500">Pipeline</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium max-w-md">
            Streamline your workflow with real-time task tracking and AI-powered priority insights.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search tasks, tags..."
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm text-sm"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
            {['all', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => setFilters({ priority: p })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                  filters.priority === p 
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/10' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <Button 
            className="flex items-center gap-2.5 px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-50 transition-all rounded-2xl font-black shadow-xl shadow-emerald-500/10 group" 
            onClick={() => openAddModal()}
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
            <span>New Task</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="relative"
      >
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -z-10" />
        
        <TaskBoard 
          tasks={filteredTasks} 
          onAddTask={openAddModal} 
          onEditTask={openEditModal}
          onUpdateStatus={updateTaskStatus}
        />
      </motion.div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTask}
        initialStatus={modalInitialStatus}
        initialTask={editingTask}
      />
    </div>
  );
};

export default TaskView;
