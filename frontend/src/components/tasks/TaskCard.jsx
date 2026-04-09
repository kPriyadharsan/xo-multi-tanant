import React from 'react';
import { Card } from '../ui';
import { 
  Calendar, 
  CheckSquare, 
  MessageSquare, 
  MoreHorizontal,
  Flag,
  Tag,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onUpdateStatus }) => {
  const priorityColors = {
    high: 'text-pink-600 bg-pink-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-emerald-600 bg-emerald-50'
  };

  const statusColors = {
    todo: 'border-slate-200',
    'in-progress': 'border-indigo-200 bg-indigo-50/20',
    completed: 'opacity-70 grayscale'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="mb-4"
    >
      <Card className={`p-5 hover:shadow-lg transition-shadow border-l-4 ${statusColors[task.status]} ${
        task.priority === 'high' ? 'border-l-pink-500' : 
        task.priority === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
      }`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            {task.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Tag size={8} /> {tag}
              </span>
            ))}
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <h4 className="font-bold text-slate-900 mb-1 leading-tight">{task.title}</h4>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>

        {/* Task Progress (Subtasks) */}
        {task.subtasks.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5 uppercase">
              <span>Progress</span>
              <span>{task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500" 
                style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1 text-xs font-medium">
              <Calendar size={14} /> 
              <span>{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex -space-x-2">
            {task.assignedTo.length > 0 ? (
              task.assignedTo.map((name, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600" title={name}>
                  {name[0]}
                </div>
              ))
            ) : (
                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                    <Users size={12} />
                </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
