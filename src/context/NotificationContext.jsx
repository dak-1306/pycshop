import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '../hooks/useToast.js';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // Add a new notification to the UI notification system (toast-like)
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      title: 'Thông báo',
      message: '',
      duration: 5000,
      timestamp: new Date(),
      ...notification,
    };

    // Show as toast notification for immediate feedback
    const toastMessage = newNotification.title && newNotification.message 
      ? `${newNotification.title}: ${newNotification.message}`
      : newNotification.message || newNotification.title;

    switch (newNotification.type) {
      case 'success':
        showSuccess(toastMessage, newNotification.duration);
        break;
      case 'error':
        showError(toastMessage, newNotification.duration);
        break;
      case 'warning':
        showWarning(toastMessage, newNotification.duration);
        break;
      case 'info':
      default:
        showInfo(toastMessage, newNotification.duration);
        break;
    }

    // Also add to the state for components that might use it
    setNotifications(prev => [newNotification, ...prev]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [showSuccess, showError, showWarning, showInfo]);

  // Remove a notification from the UI
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Refresh notifications (placeholder for real-time updates)
  const refreshNotifications = useCallback(async () => {
    // This would typically fetch from the server
    // For now, it's a placeholder that could trigger a re-fetch
    console.log('Refreshing notifications...');
  }, []);

  // Update unread count
  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  const value = {
    // UI notifications (toast-like)
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Server notifications
    refreshNotifications,
    unreadCount,
    updateUnreadCount,
    
    // Toast methods for direct access
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
