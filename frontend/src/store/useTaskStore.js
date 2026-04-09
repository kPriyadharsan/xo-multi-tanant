import { create } from 'zustand';

const useTaskStore = create((set) => ({
  tasks: [
    { 
      id: '1', 
      title: 'Initialize repository', 
      description: 'Set up the base project structure', 
      status: 'completed', 
      priority: 'high', 
      tags: ['setup'],
      subtasks: [{ id: 's1', title: 'git init', completed: true }],
      assignedTo: ['Admin'],
      createdAt: new Date().toISOString()
    },
    { 
      id: '2', 
      title: 'Design system', 
      description: 'Implement Tailwind 4 theme', 
      status: 'in-progress', 
      priority: 'medium', 
      tags: ['ui', 'design'],
      subtasks: [{ id: 's2', title: 'Color palette', completed: true }, { id: 's3', title: 'Glassmorphism', completed: false }],
      assignedTo: ['Admin'],
      createdAt: new Date().toISOString()
    },
    { 
      id: '3', 
      title: 'Auth Flow', 
      description: 'Connect login and signup pages', 
      status: 'todo', 
      priority: 'high', 
      tags: ['auth'],
      subtasks: [],
      assignedTo: [],
      createdAt: new Date().toISOString()
    }
  ],
  filters: {
    status: 'all',
    priority: 'all',
    search: ''
  },
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), subtasks: [], assignedTo: [] }] 
  })),
  
  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId)
  }))
}));

export default useTaskStore;
