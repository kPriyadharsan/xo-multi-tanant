import { create } from 'zustand';
import { taskApi } from '../api/apiClient';
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
      console.error('Failed to fetch tasks:', error);
      toast.error('Could not load tasks from server');
    } finally {
      set({ loading: false });
    }
  },
  
  addTask: async (taskData) => {
    try {
      const response = await taskApi.create(taskData);
      set((state) => ({ tasks: [response.data.data, ...state.tasks] }));
      toast.success('Task created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  },
  
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await taskApi.update(taskId, { status });
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId || t._id === taskId ? response.data.data : t)
      }));
    } catch (error) {
      toast.error('Failed to update status');
    }
  },
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  deleteTask: async (taskId) => {
    try {
      await taskApi.delete(taskId);
      set((state) => ({
        tasks: state.tasks.filter(t => t.id !== taskId && t._id !== taskId)
      }));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  }
}));

export default useTaskStore;
