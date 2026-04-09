import { create } from 'zustand';
import { logApi } from '../api/apiClient';

const useLogStore = create((set) => ({
  logs: [],
  loading: false,
  
  fetchLogs: async () => {
    set({ loading: true });
    try {
      const response = await logApi.getAll();
      set({ logs: response.data.data });
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      set({ loading: false });
    }
  }
}));

export default useLogStore;
