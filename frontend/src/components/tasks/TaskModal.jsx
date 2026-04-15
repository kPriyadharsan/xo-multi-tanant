import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Layout, AlignLeft, Flag, Tag, Users as UsersIcon, Sparkles, Loader2 } from 'lucide-react';
import { Button, Input, Card } from '../ui';
import api from '../../api/apiClient';
import { generateTaskAI } from '../../api/aiService';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, onSave, initialStatus = 'todo', initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: initialStatus,
    priority: 'medium',
    tags: [],
    assignedTo: []
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [members, setMembers] = useState([]);

  React.useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || initialStatus,
        priority: initialTask.priority || 'medium',
        tags: initialTask.tags || [],
        subtasks: initialTask.subtasks || [],
        dueDate: initialTask.dueDate || null,
        assignedTo: initialTask.assignedTo?.map(u => typeof u === 'object' ? u._id : u) || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: initialStatus,
        priority: 'medium',
        tags: [],
        subtasks: [],
        dueDate: null,
        assignedTo: []
      });
    }
  }, [initialTask, initialStatus, isOpen]);

  React.useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get('/users');
        if (data.success) {
          setMembers(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch members');
      }
    };
    if (isOpen) fetchMembers();
  }, [isOpen]);

  const handleAiGenerate = async () => {
    if (!formData.title && !formData.description) {
        toast.error("Please provide a title or brief description for the AI to work with.");
        return;
    }
    
    setIsAiLoading(true);
    const loadingToast = toast.loading("Gemini AI is crafting your task...");
    
    try {
        const result = await generateTaskAI(formData.title || formData.description);
        setFormData({
            ...formData,
            title: result.title || formData.title,
            description: result.description || formData.description,
            priority: result.priority || formData.priority,
            tags: [...new Set([...formData.tags, ...(result.tags || [])])]
        });
        toast.success("Task enhanced by AI!", { id: loadingToast });
    } catch (err) {
        toast.error("AI enhancement failed. Please try again.", { id: loadingToast });
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl themed-bg border themed-border rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b themed-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center">
              <Layout size={20} />
            </div>
            <h2 className="text-xl font-bold themed-text">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-all disabled:opacity-50"
            >
                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Generate with AI
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); onClose(); }} className="p-8">
          <div className="space-y-6">
            <Input
              label="Task Title"
              placeholder="e.g., Implement Sidebar UI"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-200 bg-white/50 min-h-[120px]"
                placeholder="Describe what needs to be done..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
                  <Flag size={14} /> Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                        formData.priority === p 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
                  <Tag size={14} /> Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold flex items-center gap-2">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Press Enter to add tags"
                  className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Status</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white text-sm"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
                    <Calendar size={14} /> Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white text-sm"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
                <Layout size={14} /> Subtasks
              </label>
              <div className="space-y-2 mb-3">
                {formData.subtasks?.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg group">
                    <button 
                        type="button"
                        onClick={() => {
                            const newSubtasks = [...formData.subtasks];
                            newSubtasks[idx].completed = !newSubtasks[idx].completed;
                            setFormData({ ...formData, subtasks: newSubtasks });
                        }}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${sub.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 hover:border-indigo-400'}`}
                    >
                        {sub.completed && <X size={10} className="rotate-45" />}
                    </button>
                    <span className={`text-sm flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>{sub.title}</span>
                    <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, subtasks: formData.subtasks.filter((_, i) => i !== idx) })}
                        className="text-slate-400 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  className="flex-1 px-4 py-2 text-sm rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white"
                  id="subtask-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val) {
                        setFormData({ 
                            ...formData, 
                            subtasks: [...(formData.subtasks || []), { title: val, completed: false }] 
                        });
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                        const input = document.getElementById('subtask-input');
                        const val = input.value.trim();
                        if (val) {
                            setFormData({ 
                                ...formData, 
                                subtasks: [...(formData.subtasks || []), { title: val, completed: false }] 
                            });
                            input.value = '';
                        }
                    }}
                >
                    Add
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1 flex items-center gap-2">
                <UsersIcon size={14} /> Assign To
              </label>
              <div className="flex flex-wrap gap-2">
                {members.map(m => (
                  <button
                    key={m._id}
                    type="button"
                    onClick={() => {
                      const isAssigned = formData.assignedTo.includes(m._id);
                      if (isAssigned) {
                        setFormData({ ...formData, assignedTo: formData.assignedTo.filter(id => id !== m._id) });
                      } else {
                        setFormData({ ...formData, assignedTo: [...formData.assignedTo, m._id] });
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-medium ${
                      formData.assignedTo.includes(m._id)
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                      formData.assignedTo.includes(m._id) ? 'bg-white/20' : 'bg-slate-100'
                    }`}>
                      {m.name[0]}
                    </div>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="px-10">
                {initialTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;
