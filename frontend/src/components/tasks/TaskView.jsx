import React, { useState, useEffect } from 'react';
import useTaskStore from '../../store/useTaskStore';
import TaskBoard from './TaskBoard';
import TaskModal from './TaskModal';
import { Button, Input } from '../ui';
import { Search, Filter, Plus, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskView = () => {
  const { tasks, addTask, filters, setFilters, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState('todo');

  const openAddModal = (status = 'todo') => {
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tasks</h2>
          <p className="text-slate-500 mt-1">Manage and track your team's progress</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search tasks, descriptions..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all shadow-sm"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
            />
          </div>
          
          <select 
            value={filters.priority}
            onChange={(e) => setFilters({ priority: e.target.value })}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-600 transition-all shadow-sm text-sm font-medium text-slate-600"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <Button className="flex items-center gap-2 px-6" onClick={() => openAddModal()}>
            <Plus size={20} /> Create Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <TaskBoard tasks={filteredTasks} onAddTask={openAddModal} />

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTask}
        initialStatus={modalInitialStatus}
      />
    </div>
  );
};

export default TaskView;
