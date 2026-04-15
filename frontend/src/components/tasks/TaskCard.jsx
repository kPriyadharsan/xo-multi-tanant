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

const TaskCard = React.memo(({ task, onEdit, onUpdateStatus }) => {
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
      className="group mb-4"
    >
      <Card className={`p-5 hover:shadow-lg transition-shadow border-l-4 ${statusColors[task.status]} ${
        task.priority === 'high' ? 'border-l-pink-500' : 
        task.priority === 'medium' ? 'border-l-amber-500' : 'border-l-emerald-500'
      }`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap gap-2">
            {task.tags?.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Tag size={8} /> {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                title="Edit Task"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <h4 className="font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => onEdit(task)}>{task.title}</h4>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>

        {/* Task Progress (Subtasks) */}
        {task.subtasks?.length > 0 && (
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
          <div className="flex items-center gap-2">
             <select 
                value={task.status}
                onChange={(e) => onUpdateStatus(task._id || task.id, e.target.value)}
                className="text-[10px] font-bold uppercase bg-slate-50 border-none rounded-lg px-2 py-1 text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-slate-100 transition-colors"
             >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
             </select>
          </div>

          <div className="flex items-center gap-4">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">
                <Calendar size={12} />
                <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            )}
            <div className="flex -space-x-2">
            {task.assignedTo?.length > 0 ? (
              task.assignedTo.map((user, i) => (
                <div key={user._id || i} className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600 overflow-hidden" title={user.name || 'User'}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    (user.name?.[0] || 'U').toUpperCase()
                  )}
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
});

export default TaskCard;
