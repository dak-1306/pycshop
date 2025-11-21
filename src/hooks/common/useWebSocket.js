import { useEffect, useCallback, useRef } from "react";
import webSocketClient from "../../services/webSocketClient.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";

export const useWebSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const eventListenersRef = useRef(new Map());

  // Connect/disconnect based on auth status
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!webSocketClient.isSocketConnected()) {
        webSocketClient.connect();
      }
    } else {
      webSocketClient.disconnect();
    }

    return () => {
      // Cleanup event listeners when component unmounts
      eventListenersRef.current.forEach((callback, eventName) => {
        webSocketClient.off(eventName, callback);
      });
      eventListenersRef.current.clear();
    };
  }, [isAuthenticated, user]);

  // Subscribe to event
  const subscribe = useCallback((eventName, callback) => {
    // Remove existing listener if any
    if (eventListenersRef.current.has(eventName)) {
      webSocketClient.off(eventName, eventListenersRef.current.get(eventName));
    }

    // Add new listener
    webSocketClient.on(eventName, callback);
    eventListenersRef.current.set(eventName, callback);

    // Return unsubscribe function
    return () => {
      webSocketClient.off(eventName, callback);
      eventListenersRef.current.delete(eventName);
    };
  }, []);

  // Unsubscribe from event
  const unsubscribe = useCallback((eventName) => {
    if (eventListenersRef.current.has(eventName)) {
      webSocketClient.off(eventName, eventListenersRef.current.get(eventName));
      eventListenersRef.current.delete(eventName);
    }
  }, []);

  // Join order room
  const joinOrderRoom = useCallback((orderId) => {
    webSocketClient.joinOrderRoom(orderId);
  }, []);

  // Leave order room
  const leaveOrderRoom = useCallback((orderId) => {
    webSocketClient.leaveOrderRoom(orderId);
  }, []);

  // Get connection status
  const isConnected = useCallback(() => {
    return webSocketClient.isSocketConnected();
  }, []);

  return {
    subscribe,
    unsubscribe,
    joinOrderRoom,
    leaveOrderRoom,
    isConnected,
    client: webSocketClient,
  };
};

// Hook for order-related real-time updates
export const useOrderWebSocket = (callbacks = {}) => {
  const { subscribe, unsubscribe, joinOrderRoom, leaveOrderRoom } =
    useWebSocket();
  const { addNotification } = useNotification();

  useEffect(() => {
    const unsubscribers = [];

    // Subscribe to new orders (for sellers)
    if (callbacks.onNewOrder) {
      const unsub = subscribe("new-order", (data) => {
        callbacks.onNewOrder(data);
        addNotification({
          type: "success",
          title: "Đơn hàng mới!",
          message: data.message || "Bạn có đơn hàng mới!",
          duration: 5000,
        });
      });
      unsubscribers.push(unsub);
    }

    // Subscribe to order created (for buyers)
    if (callbacks.onOrderCreated) {
      const unsub = subscribe("order-created", (data) => {
        callbacks.onOrderCreated(data);
        addNotification({
          type: "success",
          title: "Đặt hàng thành công!",
          message: data.message || "Đơn hàng của bạn đã được tạo thành công!",
          duration: 5000,
        });
      });
      unsubscribers.push(unsub);
    }

    // Subscribe to order updates
    if (callbacks.onOrderUpdated) {
      const unsub = subscribe("order-updated", (data) => {
        callbacks.onOrderUpdated(data);
        addNotification({
          type: "info",
          title: "Cập nhật đơn hàng",
          message: data.message || `Đơn hàng #${data.orderId} đã được cập nhật`,
          duration: 5000,
        });
      });
      unsubscribers.push(unsub);
    }

    // Subscribe to order cancellations
    if (callbacks.onOrderCancelled) {
      const unsub1 = subscribe("order-cancelled-by-buyer", (data) => {
        callbacks.onOrderCancelled({ ...data, cancelledBy: "buyer" });
        addNotification({
          type: "warning",
          title: "Đơn hàng bị hủy",
          message:
            data.message || `Đơn hàng #${data.orderId} đã bị khách hàng hủy`,
          duration: 5000,
        });
      });

      const unsub2 = subscribe("order-cancelled-by-seller", (data) => {
        callbacks.onOrderCancelled({ ...data, cancelledBy: "seller" });
        addNotification({
          type: "warning",
          title: "Đơn hàng bị hủy",
          message:
            data.message || `Đơn hàng #${data.orderId} đã bị người bán hủy`,
          duration: 5000,
        });
      });

      unsubscribers.push(unsub1, unsub2);
    }

    // Subscribe to orders list refresh
    if (callbacks.onRefreshOrdersList) {
      const unsub = subscribe("refresh-orders-list", (data) => {
        callbacks.onRefreshOrdersList(data);
      });
      unsubscribers.push(unsub);
    }

    // Subscribe to real-time status updates
    if (callbacks.onOrderStatusUpdate) {
      const unsub = subscribe("order-status-update", (data) => {
        callbacks.onOrderStatusUpdate(data);
      });
      unsubscribers.push(unsub);
    }

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [subscribe, addNotification, callbacks]);

  return {
    joinOrderRoom,
    leaveOrderRoom,
  };
};

// Hook for notification-related real-time updates
export const useNotificationWebSocket = (callbacks = {}) => {
  const { subscribe } = useWebSocket();
  const { addNotification, refreshNotifications } = useNotification();

  useEffect(() => {
    const unsubscribers = [];

    // Subscribe to new notifications
    const unsubNewNotification = subscribe("new-notification", (data) => {
      if (callbacks.onNewNotification) {
        callbacks.onNewNotification(data);
      }

      // Add to UI notification system
      addNotification({
        type: "info",
        title: "Thông báo mới",
        message:
          data.notification?.NoiDung || data.message || "Bạn có thông báo mới",
        duration: 5000,
      });

      // Refresh notifications list
      refreshNotifications();
    });

    // Subscribe to notification read events
    const unsubNotificationRead = subscribe("notification-read", (data) => {
      if (callbacks.onNotificationRead) {
        callbacks.onNotificationRead(data);
      }
      refreshNotifications();
    });

    unsubscribers.push(unsubNewNotification, unsubNotificationRead);

    // Cleanup function
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [subscribe, addNotification, refreshNotifications, callbacks]);

  return {};
};

export default useWebSocket;
