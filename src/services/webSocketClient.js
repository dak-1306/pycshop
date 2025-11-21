import { io } from 'socket.io-client';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    this.listeners = new Map();
    this.orderRooms = new Set();
  }

  // Initialize connection
  connect() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[WEBSOCKET_CLIENT] No authentication token found');
        return false;
      }

      const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5008';
      
      this.socket = io(wsUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: this.reconnectInterval,
        reconnectionAttempts: this.maxReconnectAttempts
      });

      this.setupEventHandlers();
      
      console.log('[WEBSOCKET_CLIENT] Connecting to:', wsUrl);
      return true;
    } catch (error) {
      console.error('[WEBSOCKET_CLIENT] Failed to connect:', error);
      return false;
    }
  }

  // Setup event handlers
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WEBSOCKET_CLIENT] Connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Rejoin order rooms after reconnection
      this.orderRooms.forEach(orderId => {
        this.joinOrderRoom(orderId);
      });
      
      this.emit('websocket-connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WEBSOCKET_CLIENT] Disconnected:', reason);
      this.isConnected = false;
      this.emit('websocket-disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WEBSOCKET_CLIENT] Connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[WEBSOCKET_CLIENT] Max reconnection attempts reached');
        this.emit('websocket-connection-failed');
      }
    });

    // Handle real-time events
    this.socket.on('new-order', (data) => {
      console.log('[WEBSOCKET_CLIENT] New order received:', data);
      this.emit('new-order', data);
    });

    this.socket.on('order-created', (data) => {
      console.log('[WEBSOCKET_CLIENT] Order created:', data);
      this.emit('order-created', data);
    });

    this.socket.on('order-updated', (data) => {
      console.log('[WEBSOCKET_CLIENT] Order updated:', data);
      this.emit('order-updated', data);
    });

    this.socket.on('order-cancelled-by-buyer', (data) => {
      console.log('[WEBSOCKET_CLIENT] Order cancelled by buyer:', data);
      this.emit('order-cancelled-by-buyer', data);
    });

    this.socket.on('order-cancelled-by-seller', (data) => {
      console.log('[WEBSOCKET_CLIENT] Order cancelled by seller:', data);
      this.emit('order-cancelled-by-seller', data);
    });

    this.socket.on('order-status-update', (data) => {
      console.log('[WEBSOCKET_CLIENT] Order status update:', data);
      this.emit('order-status-update', data);
    });

    this.socket.on('refresh-orders-list', (data) => {
      console.log('[WEBSOCKET_CLIENT] Refresh orders list:', data);
      this.emit('refresh-orders-list', data);
    });

    this.socket.on('new-notification', (data) => {
      console.log('[WEBSOCKET_CLIENT] New notification:', data);
      this.emit('new-notification', data);
    });

    this.socket.on('notification-read', (data) => {
      console.log('[WEBSOCKET_CLIENT] Notification read:', data);
      this.emit('notification-read', data);
    });
  }

  // Join order room for real-time updates
  joinOrderRoom(orderId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('join-order-room', orderId);
    this.orderRooms.add(orderId);
    console.log(`[WEBSOCKET_CLIENT] Joined order room: ${orderId}`);
  }

  // Leave order room
  leaveOrderRoom(orderId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('leave-order-room', orderId);
    this.orderRooms.delete(orderId);
    console.log(`[WEBSOCKET_CLIENT] Left order room: ${orderId}`);
  }

  // Handle page focus/visibility
  handlePageFocus() {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('page-focus', {
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    });
  }

  // Event listener management
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);
  }

  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  // Emit event to listeners
  emit(eventName, data) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WEBSOCKET_CLIENT] Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.orderRooms.clear();
      this.listeners.clear();
      console.log('[WEBSOCKET_CLIENT] Disconnected manually');
    }
  }

  // Reconnect
  reconnect() {
    if (this.socket) {
      this.disconnect();
    }
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  // Get connection stats
  getStats() {
    return {
      connected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      orderRooms: Array.from(this.orderRooms),
      listenersCount: this.listeners.size
    };
  }
}

// Singleton instance
const webSocketClient = new WebSocketClient();

// Auto-connect when token is available
if (localStorage.getItem('token')) {
  webSocketClient.connect();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && webSocketClient.isSocketConnected()) {
    webSocketClient.handlePageFocus();
  }
});

// Handle authentication changes
window.addEventListener('storage', (e) => {
  if (e.key === 'token') {
    if (e.newValue && !webSocketClient.isSocketConnected()) {
      // Token added, connect
      webSocketClient.connect();
    } else if (!e.newValue && webSocketClient.isSocketConnected()) {
      // Token removed, disconnect
      webSocketClient.disconnect();
    }
  }
});

export default webSocketClient;
