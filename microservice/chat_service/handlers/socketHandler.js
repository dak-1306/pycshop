class SocketHandler {
  constructor(io) {
    this.io = io;
    this.connectedUsers = new Map(); // userId -> socketId
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`[SOCKET] User connected: ${socket.id}`);

      // User authentication and room joining
      socket.on("authenticate", (data) => {
        this.handleAuthentication(socket, data);
      });

      // Join conversation room
      socket.on("join_conversation", (data) => {
        this.handleJoinConversation(socket, data);
      });

      // Leave conversation room
      socket.on("leave_conversation", (data) => {
        this.handleLeaveConversation(socket, data);
      });

      // User typing indicator
      socket.on("typing_start", (data) => {
        this.handleTypingStart(socket, data);
      });

      socket.on("typing_stop", (data) => {
        this.handleTypingStop(socket, data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        this.handleDisconnection(socket);
      });

      // Handle connection errors
      socket.on("error", (error) => {
        console.error(`[SOCKET] Socket error for ${socket.id}:`, error);
      });
    });
  }

  handleAuthentication(socket, data) {
    try {
      const { userId, userRole } = data;

      if (!userId || !userRole) {
        socket.emit("auth_error", {
          message: "userId and userRole are required",
        });
        return;
      }

      // Store user info in socket
      socket.userId = parseInt(userId);
      socket.userRole = userRole;

      // Join user-specific room for direct notifications
      socket.join(`user_${userId}`);

      // Store socket connection
      this.connectedUsers.set(parseInt(userId), socket.id);

      console.log(
        `[SOCKET] User ${userId} (${userRole}) authenticated and joined room user_${userId}`
      );

      socket.emit("authenticated", {
        success: true,
        userId: parseInt(userId),
        userRole: userRole,
      });

      // Emit user online status to all their conversations
      this.broadcastUserStatus(parseInt(userId), "online");
    } catch (error) {
      console.error("[SOCKET] Authentication error:", error);
      socket.emit("auth_error", {
        message: "Authentication failed",
        error: error.message,
      });
    }
  }

  handleJoinConversation(socket, data) {
    try {
      const { conversationId } = data;

      if (!conversationId) {
        socket.emit("join_error", {
          message: "conversationId is required",
        });
        return;
      }

      if (!socket.userId) {
        socket.emit("join_error", {
          message: "User not authenticated",
        });
        return;
      }

      const conversationRoom = `conversation_${conversationId}`;
      socket.join(conversationRoom);

      console.log(
        `[SOCKET] User ${socket.userId} joined conversation ${conversationId}`
      );

      socket.emit("conversation_joined", {
        success: true,
        conversationId: parseInt(conversationId),
      });

      // Notify other users in the conversation that this user joined
      socket.to(conversationRoom).emit("user_joined_conversation", {
        userId: socket.userId,
        userRole: socket.userRole,
        conversationId: parseInt(conversationId),
      });
    } catch (error) {
      console.error("[SOCKET] Join conversation error:", error);
      socket.emit("join_error", {
        message: "Failed to join conversation",
        error: error.message,
      });
    }
  }

  handleLeaveConversation(socket, data) {
    try {
      const { conversationId } = data;

      if (!conversationId) {
        return;
      }

      const conversationRoom = `conversation_${conversationId}`;
      socket.leave(conversationRoom);

      console.log(
        `[SOCKET] User ${socket.userId} left conversation ${conversationId}`
      );

      socket.emit("conversation_left", {
        success: true,
        conversationId: parseInt(conversationId),
      });

      // Notify other users in the conversation that this user left
      socket.to(conversationRoom).emit("user_left_conversation", {
        userId: socket.userId,
        userRole: socket.userRole,
        conversationId: parseInt(conversationId),
      });
    } catch (error) {
      console.error("[SOCKET] Leave conversation error:", error);
    }
  }

  handleTypingStart(socket, data) {
    try {
      const { conversationId } = data;

      if (!conversationId || !socket.userId) {
        return;
      }

      const conversationRoom = `conversation_${conversationId}`;

      // Notify other users in the conversation that this user is typing
      socket.to(conversationRoom).emit("user_typing", {
        userId: socket.userId,
        userRole: socket.userRole,
        conversationId: parseInt(conversationId),
        isTyping: true,
      });

      console.log(
        `[SOCKET] User ${socket.userId} started typing in conversation ${conversationId}`
      );
    } catch (error) {
      console.error("[SOCKET] Typing start error:", error);
    }
  }

  handleTypingStop(socket, data) {
    try {
      const { conversationId } = data;

      if (!conversationId || !socket.userId) {
        return;
      }

      const conversationRoom = `conversation_${conversationId}`;

      // Notify other users in the conversation that this user stopped typing
      socket.to(conversationRoom).emit("user_typing", {
        userId: socket.userId,
        userRole: socket.userRole,
        conversationId: parseInt(conversationId),
        isTyping: false,
      });

      console.log(
        `[SOCKET] User ${socket.userId} stopped typing in conversation ${conversationId}`
      );
    } catch (error) {
      console.error("[SOCKET] Typing stop error:", error);
    }
  }

  handleDisconnection(socket) {
    try {
      if (socket.userId) {
        console.log(
          `[SOCKET] User ${socket.userId} disconnected: ${socket.id}`
        );

        // Remove from connected users
        this.connectedUsers.delete(socket.userId);

        // Broadcast user offline status
        this.broadcastUserStatus(socket.userId, "offline");
      } else {
        console.log(`[SOCKET] Anonymous user disconnected: ${socket.id}`);
      }
    } catch (error) {
      console.error("[SOCKET] Disconnection error:", error);
    }
  }

  broadcastUserStatus(userId, status) {
    try {
      // This could be extended to notify all conversations the user is part of
      // For now, we'll just emit to the user's room
      this.io.to(`user_${userId}`).emit("user_status_changed", {
        userId: userId,
        status: status,
        timestamp: new Date().toISOString(),
      });

      console.log(`[SOCKET] Broadcasted status '${status}' for user ${userId}`);
    } catch (error) {
      console.error("[SOCKET] Broadcast user status error:", error);
    }
  }

  // Method to send direct message to a specific user
  sendToUser(userId, event, data) {
    try {
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.io.to(`user_${userId}`).emit(event, data);
        console.log(`[SOCKET] Sent '${event}' to user ${userId}`);
        return true;
      } else {
        console.log(`[SOCKET] User ${userId} not connected`);
        return false;
      }
    } catch (error) {
      console.error(`[SOCKET] Send to user error:`, error);
      return false;
    }
  }

  // Method to send message to conversation room
  sendToConversation(conversationId, event, data) {
    try {
      this.io.to(`conversation_${conversationId}`).emit(event, data);
      console.log(`[SOCKET] Sent '${event}' to conversation ${conversationId}`);
      return true;
    } catch (error) {
      console.error(`[SOCKET] Send to conversation error:`, error);
      return false;
    }
  }

  // Method to get online users count
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  // Method to check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(parseInt(userId));
  }

  // Method to get all connected users
  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

export default SocketHandler;
