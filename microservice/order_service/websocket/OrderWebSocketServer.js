import http from "http";
import kafkaService from "../../shared/kafka/KafkaService.js";
import webSocketService from "../../shared/websocket/WebSocketService.js";

class OrderWebSocketServer {
  constructor(app) {
    this.app = app;
    this.server = null;
    this.consumer = null;
  }

  async initialize() {
    try {
      // Create HTTP server
      this.server = http.createServer(this.app);

      // Initialize WebSocket service
      webSocketService.initialize(this.server);

      // Setup Kafka consumer
      await this.setupKafkaConsumer();

      console.log("[ORDER_WS_SERVER] WebSocket server initialized");
      return this.server;
    } catch (error) {
      console.error("[ORDER_WS_SERVER] Failed to initialize:", error);
      throw error;
    }
  }

  async setupKafkaConsumer() {
    try {
      // Create consumer for order events
      this.consumer = await kafkaService.createConsumer(
        "order-websocket-service",
        ["order-events", "notification-events"]
      );

      // Process messages
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const messageValue = JSON.parse(message.value.toString());
            console.log(
              `[ORDER_WS_SERVER] Received message from topic ${topic}:`,
              {
                eventType: messageValue.eventType,
                source: messageValue.source,
              }
            );

            if (topic === "order-events") {
              await this.handleOrderEvent(messageValue);
            } else if (topic === "notification-events") {
              await this.handleNotificationEvent(messageValue);
            }
          } catch (error) {
            console.error(
              `[ORDER_WS_SERVER] Error processing message from topic ${topic}:`,
              error
            );
          }
        },
      });

      console.log("[ORDER_WS_SERVER] Kafka consumer setup completed");
    } catch (error) {
      console.error("[ORDER_WS_SERVER] Failed to setup Kafka consumer:", error);
      throw error;
    }
  }

  async handleOrderEvent(message) {
    const { eventType, data } = message;

    try {
      switch (eventType) {
        case "ORDER_CREATED":
          await this.handleOrderCreated(data);
          break;
        case "ORDER_UPDATED":
          await this.handleOrderUpdated(data);
          break;
        case "ORDER_CANCELLED":
          await this.handleOrderCancelled(data);
          break;
        default:
          console.log(`[ORDER_WS_SERVER] Unhandled order event: ${eventType}`);
      }
    } catch (error) {
      console.error(
        `[ORDER_WS_SERVER] Error handling order event ${eventType}:`,
        error
      );
    }
  }

  async handleOrderCreated(data) {
    const { orders, buyerId } = data;

    // Send real-time notifications
    webSocketService.handleOrderEvent("ORDER_CREATED", data);

    // Also send specific notifications to dashboard pages
    orders.forEach((order) => {
      // If seller is on their orders page, update the list immediately
      webSocketService.sendToSeller(order.sellerId, "refresh-orders-list", {
        newOrder: {
          orderId: order.orderId,
          buyerId: buyerId,
          total: order.total,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      });
    });
  }

  async handleOrderUpdated(data) {
    const { orderId, buyerId, sellerId, oldStatus, newStatus } = data;

    // Send real-time notifications
    webSocketService.handleOrderEvent("ORDER_UPDATED", data);

    // Update order status in real-time for users viewing the order
    webSocketService.sendToOrderParticipants(
      orderId,
      "order-status-realtime-update",
      {
        orderId,
        status: newStatus,
        previousStatus: oldStatus,
      }
    );

    // If buyer is on orders page, refresh the list
    webSocketService.sendToUser(buyerId, "refresh-orders-list", {
      updatedOrder: {
        orderId,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  async handleOrderCancelled(data) {
    const { orderId, buyerId, sellerIds, cancelledBy } = data;

    // Send real-time notifications
    webSocketService.handleOrderEvent("ORDER_CANCELLED", data);

    // Notify sellers if buyer cancelled
    if (cancelledBy === "buyer" && sellerIds) {
      sellerIds.forEach((sellerId) => {
        webSocketService.sendToSeller(sellerId, "refresh-orders-list", {
          cancelledOrder: {
            orderId,
            status: "cancelled",
            cancelledBy: "buyer",
            cancelledAt: new Date().toISOString(),
          },
        });
      });
    }
  }

  async handleNotificationEvent(message) {
    const { eventType, data } = message;

    try {
      switch (eventType) {
        case "NOTIFICATION_CREATED":
          webSocketService.handleNotificationEvent(
            "NOTIFICATION_CREATED",
            data
          );
          break;
        case "NOTIFICATION_READ":
          webSocketService.handleNotificationEvent("NOTIFICATION_READ", data);
          break;
        default:
          console.log(
            `[ORDER_WS_SERVER] Unhandled notification event: ${eventType}`
          );
      }
    } catch (error) {
      console.error(
        `[ORDER_WS_SERVER] Error handling notification event ${eventType}:`,
        error
      );
    }
  }

  async start(port = 5018) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, (error) => {
        if (error) {
          console.error(
            `[ORDER_WS_SERVER] Failed to start server on port ${port}:`,
            error
          );
          reject(error);
        } else {
          console.log(`[ORDER_WS_SERVER] Server started on port ${port}`);
          resolve(this.server);
        }
      });
    });
  }

  async stop() {
    try {
      if (this.consumer) {
        await this.consumer.disconnect();
        console.log("[ORDER_WS_SERVER] Kafka consumer disconnected");
      }

      if (this.server) {
        await new Promise((resolve) => {
          this.server.close(resolve);
        });
        console.log("[ORDER_WS_SERVER] HTTP server stopped");
      }

      await kafkaService.disconnect();
      console.log("[ORDER_WS_SERVER] Service stopped gracefully");
    } catch (error) {
      console.error("[ORDER_WS_SERVER] Error stopping service:", error);
    }
  }

  getStats() {
    return {
      webSocket: webSocketService.getStats(),
      server: {
        listening: this.server?.listening || false,
        port: this.server?.address()?.port || null,
      },
    };
  }
}

export default OrderWebSocketServer;
