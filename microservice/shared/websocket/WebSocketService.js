import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket info
    this.userRoles = new Map(); // userId -> role (buyer/seller)
  }

  // Initialize WebSocket server
  initialize(httpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"],
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    console.log("[WEBSOCKET] Service initialized");
    return this.io;
  }

  // Setup authentication middleware
  setupMiddleware() {
    this.io.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth.token ||
          socket.handshake.headers.authorization?.replace("Bearer ", "");

        if (!token) {
          return next(new Error("Authentication token required"));
        }

        // Verify JWT token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        );
        socket.userId = decoded.userId || decoded.id;
        socket.userRole = decoded.role || "buyer";
        socket.userEmail = decoded.email;

        console.log(
          `[WEBSOCKET] User authenticated: ${socket.userId} (${socket.userRole})`
        );
        next();
      } catch (error) {
        console.error("[WEBSOCKET] Authentication failed:", error.message);
        next(new Error("Invalid authentication token"));
      }
    });
  }

  // Setup event handlers
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(
        `[WEBSOCKET] User connected: ${socket.userId} (${socket.userRole})`
      );

      // Store user connection
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        socket: socket,
        role: socket.userRole,
        email: socket.userEmail,
        connectedAt: new Date().toISOString(),
      });

      this.userRoles.set(socket.userId, socket.userRole);

      // Join user to their personal room
      socket.join(`user:${socket.userId}`);

      // Join role-based rooms
      socket.join(`role:${socket.userRole}`);

      // If seller, join seller room
      if (socket.userRole === "seller") {
        socket.join(`seller:${socket.userId}`);
      }

      // Handle custom events
      socket.on("join-order-room", (orderId) => {
        socket.join(`order:${orderId}`);
        console.log(
          `[WEBSOCKET] User ${socket.userId} joined order room: ${orderId}`
        );
      });

      socket.on("leave-order-room", (orderId) => {
        socket.leave(`order:${orderId}`);
        console.log(
          `[WEBSOCKET] User ${socket.userId} left order room: ${orderId}`
        );
      });

      // Handle page focus/visibility
      socket.on("page-focus", (data) => {
        socket.emit("sync-notifications");
      });

      // Handle disconnect
      socket.on("disconnect", (reason) => {
        console.log(
          `[WEBSOCKET] User disconnected: ${socket.userId} (${reason})`
        );
        this.connectedUsers.delete(socket.userId);
        this.userRoles.delete(socket.userId);
      });

      // Send welcome message
      socket.emit("connected", {
        userId: socket.userId,
        role: socket.userRole,
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Send notification to specific user
  sendToUser(userId, eventName, data) {
    const room = `user:${userId}`;
    this.io.to(room).emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    console.log(`[WEBSOCKET] Sent ${eventName} to user ${userId}`);
  }

  // Send notification to seller
  sendToSeller(sellerId, eventName, data) {
    const room = `seller:${sellerId}`;
    this.io.to(room).emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    console.log(`[WEBSOCKET] Sent ${eventName} to seller ${sellerId}`);
  }

  // Send to all users in an order
  sendToOrderParticipants(orderId, eventName, data) {
    const room = `order:${orderId}`;
    this.io.to(room).emit(eventName, {
      ...data,
      orderId,
      timestamp: new Date().toISOString(),
    });

    console.log(
      `[WEBSOCKET] Sent ${eventName} to order ${orderId} participants`
    );
  }

  // Send to all users with specific role
  sendToRole(role, eventName, data) {
    const room = `role:${role}`;
    this.io.to(room).emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    console.log(`[WEBSOCKET] Sent ${eventName} to all ${role}s`);
  }

  // Broadcast to all connected users
  broadcast(eventName, data) {
    this.io.emit(eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });

    console.log(`[WEBSOCKET] Broadcasted ${eventName} to all users`);
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get user role
  getUserRole(userId) {
    return this.userRoles.get(userId);
  }

  // Handle order events
  handleOrderEvent(eventType, orderData) {
    switch (eventType) {
      case "ORDER_CREATED":
        this.handleOrderCreated(orderData);
        break;
      case "ORDER_UPDATED":
        this.handleOrderUpdated(orderData);
        break;
      case "ORDER_CANCELLED":
        this.handleOrderCancelled(orderData);
        break;
      default:
        console.log(`[WEBSOCKET] Unhandled order event: ${eventType}`);
    }
  }

  // Handle new order created
  handleOrderCreated(orderData) {
    const { orders, buyerId } = orderData;

    orders.forEach((order) => {
      // Notify seller about new order
      this.sendToSeller(order.sellerId, "new-order", {
        orderId: order.orderId,
        buyerId: buyerId,
        total: order.total,
        itemCount: order.itemCount,
        message: "Bạn có đơn hàng mới!",
      });

      // Notify buyer about order confirmation
      this.sendToUser(buyerId, "order-created", {
        orderId: order.orderId,
        status: "pending",
        message: "Đơn hàng của bạn đã được tạo thành công!",
      });
    });
  }

  // Handle order status updated
  handleOrderUpdated(orderData) {
    const { orderId, buyerId, sellerId, oldStatus, newStatus } = orderData;

    // Notify buyer about status change
    this.sendToUser(buyerId, "order-updated", {
      orderId,
      oldStatus,
      newStatus,
      message: `Đơn hàng #${orderId} đã được cập nhật trạng thái: ${newStatus}`,
    });

    // Notify seller if needed
    if (sellerId) {
      this.sendToSeller(sellerId, "order-status-changed", {
        orderId,
        oldStatus,
        newStatus,
        message: `Đơn hàng #${orderId} đã được cập nhật`,
      });
    }

    // Notify all participants in the order room
    this.sendToOrderParticipants(orderId, "order-status-update", {
      orderId,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  }

  // Handle order cancelled
  handleOrderCancelled(orderData) {
    const { orderId, buyerId, sellerId, cancelledBy } = orderData;

    if (cancelledBy === "buyer") {
      // Buyer cancelled - notify seller
      this.sendToSeller(sellerId, "order-cancelled-by-buyer", {
        orderId,
        message: `Đơn hàng #${orderId} đã bị khách hàng hủy`,
      });
    } else if (cancelledBy === "seller") {
      // Seller cancelled - notify buyer
      this.sendToUser(buyerId, "order-cancelled-by-seller", {
        orderId,
        message: `Đơn hàng #${orderId} đã bị người bán hủy`,
      });
    }

    // Notify all participants
    this.sendToOrderParticipants(orderId, "order-cancelled", {
      orderId,
      cancelledBy,
      cancelledAt: new Date().toISOString(),
    });
  }

  // Handle notification events
  handleNotificationEvent(eventType, notificationData) {
    switch (eventType) {
      case "NOTIFICATION_CREATED":
        this.handleNotificationCreated(notificationData);
        break;
      case "NOTIFICATION_READ":
        this.handleNotificationRead(notificationData);
        break;
      default:
        console.log(`[WEBSOCKET] Unhandled notification event: ${eventType}`);
    }
  }

  // Handle new notification
  handleNotificationCreated(notificationData) {
    const { userId, notification } = notificationData;

    this.sendToUser(userId, "new-notification", {
      notification,
      message: "Bạn có thông báo mới!",
    });
  }

  // Handle notification read
  handleNotificationRead(notificationData) {
    const { userId, notificationId } = notificationData;

    this.sendToUser(userId, "notification-read", {
      notificationId,
      readAt: new Date().toISOString(),
    });
  }

  // Get service stats
  getStats() {
    return {
      connectedUsers: this.connectedUsers.size,
      totalRooms: this.io.sockets.adapter.rooms.size,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
