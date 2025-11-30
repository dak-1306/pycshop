import { io } from "socket.io-client";

class ChatWebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.listeners = new Map();
    this.conversationRooms = new Set();
    this.currentUserId = null;
    this.currentUserRole = null;
  }

  // Initialize connection to chat service
  connect() {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !user.id) {
        console.warn(
          "[CHAT_WEBSOCKET] No authentication token or user ID found"
        );
        return false;
      }

      this.currentUserId = user.id || user.ID_NguoiDung;
      this.currentUserRole = user.role || user.VaiTro || "buyer";

      const wsUrl = import.meta.env.VITE_CHAT_WS_URL || "http://localhost:5011";

      this.socket = io(wsUrl, {
        auth: {
          token: token,
          userId: this.currentUserId,
          userRole: this.currentUserRole,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: this.reconnectInterval,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupEventHandlers();

      console.log("[CHAT_WEBSOCKET] Connecting to chat service:", wsUrl);
      console.log(
        "[CHAT_WEBSOCKET] User ID:",
        this.currentUserId,
        "Role:",
        this.currentUserRole
      );
      return true;
    } catch (error) {
      console.error("[CHAT_WEBSOCKET] Failed to connect:", error);
      return false;
    }
  }

  // Setup event handlers
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("[CHAT_WEBSOCKET] Connected successfully");
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Authenticate with server
      this.authenticate();

      // Rejoin conversation rooms after reconnection
      this.conversationRooms.forEach((conversationId) => {
        this.joinConversation(conversationId);
      });

      this.emit("websocket-connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[CHAT_WEBSOCKET] Disconnected:", reason);
      this.isConnected = false;
      this.emit("websocket-disconnected", { reason });
    });

    this.socket.on("connect_error", (error) => {
      console.error("[CHAT_WEBSOCKET] Connection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("[CHAT_WEBSOCKET] Max reconnection attempts reached");
        this.emit("websocket-connection-failed");
      }
    });

    // Authentication events
    this.socket.on("authenticated", (data) => {
      console.log("[CHAT_WEBSOCKET] Authenticated:", data);
      this.emit("authenticated", data);
    });

    this.socket.on("auth_error", (data) => {
      console.error("[CHAT_WEBSOCKET] Authentication error:", data);
      this.emit("auth-error", data);
    });

    // Chat events
    this.socket.on("new_message", (data) => {
      console.log("[CHAT_WEBSOCKET] New message received:", data);
      this.emit("new-message", data);
    });

    this.socket.on("message_read", (data) => {
      console.log("[CHAT_WEBSOCKET] Message read:", data);
      this.emit("message-read", data);
    });

    this.socket.on("conversation_joined", (data) => {
      console.log("[CHAT_WEBSOCKET] Conversation joined:", data);
      this.emit("conversation-joined", data);
    });

    this.socket.on("conversation_left", (data) => {
      console.log("[CHAT_WEBSOCKET] Conversation left:", data);
      this.emit("conversation-left", data);
    });

    this.socket.on("user_joined_conversation", (data) => {
      console.log("[CHAT_WEBSOCKET] User joined conversation:", data);
      this.emit("user-joined-conversation", data);
    });

    this.socket.on("user_left_conversation", (data) => {
      console.log("[CHAT_WEBSOCKET] User left conversation:", data);
      this.emit("user-left-conversation", data);
    });

    // Typing indicators
    this.socket.on("user_typing", (data) => {
      console.log("[CHAT_WEBSOCKET] User typing:", data);
      this.emit("user-typing", data);
    });

    this.socket.on("user_stopped_typing", (data) => {
      console.log("[CHAT_WEBSOCKET] User stopped typing:", data);
      this.emit("user-stopped-typing", data);
    });

    // Online status
    this.socket.on("user_online", (data) => {
      console.log("[CHAT_WEBSOCKET] User online:", data);
      this.emit("user-online", data);
    });

    this.socket.on("user_offline", (data) => {
      console.log("[CHAT_WEBSOCKET] User offline:", data);
      this.emit("user-offline", data);
    });
  }

  // Authenticate with server
  authenticate() {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("authenticate", {
      userId: this.currentUserId,
      userRole: this.currentUserRole,
    });

    console.log("[CHAT_WEBSOCKET] Authentication sent");
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("join_conversation", {
      conversationId: parseInt(conversationId),
    });

    this.conversationRooms.add(conversationId);
    console.log(`[CHAT_WEBSOCKET] Joined conversation: ${conversationId}`);
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("leave_conversation", {
      conversationId: parseInt(conversationId),
    });

    this.conversationRooms.delete(conversationId);
    console.log(`[CHAT_WEBSOCKET] Left conversation: ${conversationId}`);
  }

  // Send typing indicator
  startTyping(conversationId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("typing_start", {
      conversationId: parseInt(conversationId),
    });
  }

  // Stop typing indicator
  stopTyping(conversationId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("typing_stop", {
      conversationId: parseInt(conversationId),
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
      this.listeners.get(eventName).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(
            `[CHAT_WEBSOCKET] Error in event listener for ${eventName}:`,
            error
          );
        }
      });
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.socket && this.isConnected;
  }

  // Get current user info
  getCurrentUser() {
    return {
      userId: this.currentUserId,
      userRole: this.currentUserRole,
    };
  }

  // Get connected conversations
  getConnectedConversations() {
    return Array.from(this.conversationRooms);
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      // Leave all conversation rooms
      this.conversationRooms.forEach((conversationId) => {
        this.leaveConversation(conversationId);
      });

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.conversationRooms.clear();
      this.listeners.clear();
      console.log("[CHAT_WEBSOCKET] Disconnected manually");
    }
  }

  // Reconnect
  reconnect() {
    if (this.socket) {
      this.disconnect();
    }
    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }
}

// Singleton instance
const chatWebSocketClient = new ChatWebSocketClient();

export default chatWebSocketClient;
