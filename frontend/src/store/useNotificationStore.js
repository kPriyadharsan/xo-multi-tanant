import { create } from 'zustand';
import api from '../api/apiClient';
import socket from '../api/socket';
import toast from 'react-hot-toast';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications');
      if (data.success) {
        set({ notifications: data.data });
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      set({ loading: false });
    }
  },

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),

  markAsRead: async (id) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map(n => n._id === id ? { ...n, read: true } : n)
    }));
    
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (error) {
      console.error('Mark read error:', error);
      // Revert optimistic update
      set((state) => ({
         notifications: state.notifications.map(n => n._id === id ? { ...n, read: false } : n)
      }));
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
       notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));

    try {
      await api.put('/notifications/all/read');
    } catch (error) {
      console.error('Mark all read error:', error);
    }
  },

  clearAll: async () => {
    // Keep a backup for reversion
    const oldNotifications = get().notifications;
    set({ notifications: [] });

    try {
      await api.delete('/notifications/all');
    } catch (error) {
      console.error('Clear all error:', error);
      set({ notifications: oldNotifications });
    }
  },

  setupSocket: () => {
    // Remove if already listening
    socket.off('newNotification');

    socket.on('newNotification', (notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications]
      }));

      // Fire a toast for the new notification if we want
      if (notification.type === 'error') {
         toast.error(notification.title);
      } else if (notification.type === 'success') {
         toast.success(notification.title);
      } else {
         toast(notification.title, { icon: '🔔' });
      }
    });
  }
}));

export default useNotificationStore;
