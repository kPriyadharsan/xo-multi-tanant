import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/apiClient';
import socket from '../api/socket';

const AuthContext = createContext(null);

// Helper to check if a JWT token is expired
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // treat malformed tokens as expired
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        if (isTokenExpired(token)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          try {
            // Attempt to fetch fresh user data from server
            const { data } = await api.get('/auth/me');
            if (data.success) {
              setUser(data.data);
              localStorage.setItem('user', JSON.stringify(data.data));
            }
          } catch (err) {
            console.error('Failed to verify token:', err.message);
            // If the server says 401, the interceptor will handle it
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Socket management
  useEffect(() => {
    if (user && user.organization) {
      const orgId = typeof user.organization === 'object' ? user.organization._id : user.organization;
      socket.connect();
      socket.emit('joinOrganization', orgId);
      
      // Import dynamic to avoid circular dependencies if any
      const setup = async () => {
         const { default: useTaskStore } = await import('../store/useTaskStore');
         useTaskStore.getState().setupSocket();
      };
      setup();

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogoutModal(false);
    socket.disconnect();
    // Force a clean redirect to login or landing
    window.location.href = '/';
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser,
      loading, 
      showLogoutModal, 
      confirmLogout, 
      cancelLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
