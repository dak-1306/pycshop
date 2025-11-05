import { Kafka } from "kafkajs";
import { pool } from "../db/mysql.js";
import { getCartFromRedis } from "./redisService.js";
import redis from "./redisService.js";

const kafka = new Kafka({
  clientId: "cart-service-consumer",
  brokers: [process.env.KAFKA_BROKERS || "127.0.0.1:9092"],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({
  groupId: "cart-sync-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log("[KAFKA_CONSUMER] Connected successfully");

    // Subscribe to topics
    await consumer.subscribe({
      topics: ["cart_update", "cart_sync", "cart_checkout"],
    });
    console.log(
      "[KAFKA_CONSUMER] Subscribed to topics: cart_update, cart_sync, cart_checkout"
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageValue = JSON.parse(message.value.toString());
          const { userId, action, productData } = messageValue;

          console.log(
            `[KAFKA_CONSUMER] Processing message: topic=${topic}, action=${action}, userId=${userId}`
          );

          switch (topic) {
            case "cart_update":
              await handleCartUpdate(userId, action, productData);
              break;
            case "cart_sync":
              await handleCartSync(userId);
              break;
            case "cart_checkout":
              await handleCartCheckout(messageValue);
              break;
            default:
              console.log(`[KAFKA_CONSUMER] Unknown topic: ${topic}`);
          }
        } catch (error) {
          console.error("[KAFKA_CONSUMER] Error processing message:", error);
        }
      },
    });

    // Start auto-sync scheduler
    startAutoSync();
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error starting consumer:", error);
    throw error;
  }
};

// Handle cart update events
const handleCartUpdate = async (userId, action, productData) => {
  try {
    // Get current cart from Redis
    const cart = await getCartFromRedis(userId);

    // Sync to MySQL
    await syncCartToMySQL(userId, cart);

    console.log(
      `[KAFKA_CONSUMER] Cart update synced for user ${userId}, action: ${action}`
    );
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error handling cart update:", error);
  }
};

// Handle cart sync events
const handleCartSync = async (userId) => {
  try {
    const cart = await getCartFromRedis(userId);
    await syncCartToMySQL(userId, cart);

    console.log(`[KAFKA_CONSUMER] Cart synced for user ${userId}`);
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error handling cart sync:", error);
  }
};

// Handle cart checkout events
const handleCartCheckout = async (messageData) => {
  try {
    const { userId, cartItems, orderData } = messageData;

    // Log checkout event (could be used for analytics)
    console.log(
      `[KAFKA_CONSUMER] User ${userId} checked out with ${
        Object.keys(cartItems || {}).length
      } items`
    );

    // Here you could trigger order creation, inventory updates, etc.
    // For now, just sync the cleared cart to MySQL
    await syncCartToMySQL(userId, {});
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error handling cart checkout:", error);
  }
};

// Sync cart from Redis to MySQL
const syncCartToMySQL = async (userId, cart) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if cart exists in MySQL
    const [cartRows] = await connection.query(
      "SELECT ID_GioHang FROM giohang WHERE ID_NguoiMua = ?",
      [userId]
    );

    let cartId = cartRows.length ? cartRows[0].ID_GioHang : null;

    // Create cart if doesn't exist
    if (!cartId) {
      const [result] = await connection.query(
        "INSERT INTO giohang (ID_NguoiMua) VALUES (?)",
        [userId]
      );
      cartId = result.insertId;
      console.log(
        `[KAFKA_CONSUMER] Created new cart ${cartId} for user ${userId}`
      );
    }

    // Clear existing cart items
    await connection.query("DELETE FROM sanphamtronggio WHERE ID_GioHang = ?", [
      cartId,
    ]);

    // Insert current cart items
    let totalQuantity = 0;
    for (const [productId, itemData] of Object.entries(cart)) {
      const quantity = itemData.quantity || 0;
      if (quantity > 0) {
        await connection.query(
          "INSERT INTO sanphamtronggio (ID_GioHang, ID_SanPham, SoLuong) VALUES (?, ?, ?)",
          [cartId, productId, quantity]
        );
        totalQuantity += quantity;
      }
    }

    // Update cart timestamp to indicate last sync
    await connection.query(
      "UPDATE giohang SET ThoiGianTao = CURRENT_TIMESTAMP WHERE ID_GioHang = ?",
      [cartId]
    );

    await connection.commit();
    console.log(
      `[KAFKA_CONSUMER] Synced ${
        Object.keys(cart).length
      } items to MySQL for user ${userId}`
    );
  } catch (error) {
    await connection.rollback();
    console.error("[KAFKA_CONSUMER] Error syncing cart to MySQL:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Auto-sync scheduler - sync all active carts every 5 minutes
let syncInterval;

const startAutoSync = () => {
  // Sync every 5 minutes (300,000 milliseconds)
  syncInterval = setInterval(async () => {
    try {
      console.log("[KAFKA_CONSUMER] Starting auto-sync of all active carts...");
      await syncAllActiveCarts();
    } catch (error) {
      console.error("[KAFKA_CONSUMER] Error in auto-sync:", error);
    }
  }, 5 * 60 * 1000);

  console.log("[KAFKA_CONSUMER] Auto-sync scheduler started (every 5 minutes)");
};

const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("[KAFKA_CONSUMER] Auto-sync scheduler stopped");
  }
};

// Sync all carts that have been active (have items in Redis)
const syncAllActiveCarts = async () => {
  try {
    // Get all Redis keys that match cart pattern
    const keys = await redis.keys("cart:*");

    let syncedCount = 0;
    for (const key of keys) {
      try {
        const userId = key.split(":")[1];
        if (userId) {
          const cart = await getCartFromRedis(userId);

          // Only sync if cart has items
          if (Object.keys(cart).length > 0) {
            await syncCartToMySQL(userId, cart);
            syncedCount++;
          }
        }
      } catch (error) {
        console.error(`[KAFKA_CONSUMER] Error syncing cart ${key}:`, error);
      }
    }

    console.log(
      `[KAFKA_CONSUMER] Auto-sync completed: ${syncedCount} active carts synced`
    );
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error in syncAllActiveCarts:", error);
  }
};

// Graceful shutdown
export const stopKafkaConsumer = async () => {
  try {
    // Stop auto-sync first
    stopAutoSync();

    await consumer.disconnect();
    console.log("[KAFKA_CONSUMER] Disconnected successfully");
  } catch (error) {
    console.error("[KAFKA_CONSUMER] Error disconnecting:", error);
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  console.log("[KAFKA_CONSUMER] Received SIGINT, shutting down gracefully");
  stopAutoSync();
  await stopKafkaConsumer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("[KAFKA_CONSUMER] Received SIGTERM, shutting down gracefully");
  stopAutoSync();
  await stopKafkaConsumer();
  process.exit(0);
});

export default consumer;
