import { create } from 'zustand';
import { taskApi } from '../api/apiClient';
import socket from '../api/socket';
import toast from 'react-hot-toast';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  filters: {
    status: 'all',
    priority: 'all',
    search: ''
  },
  
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const response = await taskApi.getAll();
      set({ tasks: response.data.data });
    } catch (error) {
      const msg = error.response?.status === 503
        ? 'Database unavailable. Please check your connection and try again.'
        : 'Could not load tasks from server';
      console.error('Failed to fetch tasks:', error.message);
      toast.error(msg);
    } finally {
      set({ loading: false });
    }
  },

  setupSocket: () => {
    socket.off('taskCreated');
    socket.off('taskUpdated');
    socket.off('taskDeleted');

    socket.on('taskCreated', (task) => {
      set((state) => ({ tasks: [task, ...state.tasks] }));
    });

    socket.on('taskUpdated', (updatedTask) => {
      set((state) => ({
        tasks: state.tasks.map(t => (t._id === updatedTask._id || t.id === updatedTask._id) ? updatedTask : t)
      }));
    });

    socket.on('taskDeleted', (taskId) => {
      set((state) => ({
        tasks: state.tasks.filter(t => t._id !== taskId && t.id !== taskId)
      }));
    });
  },
  
  addTask: async (taskData) => {
    try {
      const response = await taskApi.create(taskData);
      // We don't update state here manually if socket is active, 
      // but keeping it for immediate feedback or if socket fails.
      // Actually, for immediate feedback it's better to update, 
      // the socket listener should handle duplicates if needed.
      // But let's assume socket might be faster or safer.
      // To avoid double items, let's just use the server response and let socket update others.
      set((state) => {
          if (state.tasks.some(t => t._id === response.data.data._id)) return state;
          return { tasks: [response.data.data, ...state.tasks] };
      });
      toast.success('Task created successfully');
    } catch (error) {
      const msg = error.response?.status === 503
        ? 'Database unavailable. Please try again in a moment.'
        : error.response?.data?.message || 'Failed to create task';
      toast.error(msg);
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    const previousTasks = get().tasks;
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map(t => (t.id === taskId || t._id === taskId) ? { ...t, status } : t)
    }));

    try {
      const response = await taskApi.update(taskId, { status });
      set((state) => ({
        tasks: state.tasks.map(t => (t.id === taskId || t._id === taskId) ? response.data.data : t)
      }));
    } catch (error) {
      console.error('Update Task Status Error:', error);
      set({ tasks: previousTasks });
      toast.error('Failed to update status');
    }
  },

  updateTask: async (taskId, taskData) => {
    // We don't do full optimistic update here as taskData might be complex
    try {
      const response = await taskApi.update(taskId, taskData);
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId || t._id === taskId ? response.data.data : t)
      }));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  },
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  deleteTask: async (taskId) => {
    const previousTasks = get().tasks;
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== taskId && t._id !== taskId)
    }));

    try {
      await taskApi.delete(taskId);
      toast.success('Task deleted');
    } catch (error) {
      console.error('Delete Task Error:', error);
      set({ tasks: previousTasks });
      toast.error('Failed to delete task');
    }
  }
}));

export default useTaskStore;
