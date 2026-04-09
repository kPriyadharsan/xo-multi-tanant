import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [
    { id: 1, title: 'Team Meeting', message: 'Project sync in 10 mins', time: '2 mins ago', type: 'info', read: false },
    { id: 2, title: 'Task Completed', message: 'Sarah completed "Authentication Flow"', time: '1 hour ago', type: 'success', read: true },
    { id: 3, title: 'Critical Alert', message: 'Server latency is high', time: '3 hours ago', type: 'error', read: false }
  ],
  
  addNotification: (notification) => set((state) => ({
    notifications: [{ ...notification, id: Date.now(), time: 'Just now', read: false }, ...state.notifications]
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  
  clearAll: () => set({ notifications: [] })
}));

export default useNotificationStore;
