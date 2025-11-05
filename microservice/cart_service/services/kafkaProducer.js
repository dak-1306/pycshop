import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "cart-service",
  brokers: [process.env.KAFKA_BROKERS || "127.0.0.1:9092"],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionTimeout: 30000,
});

let isProducerConnected = false;

// Connect producer
const connectProducer = async () => {
  if (!isProducerConnected) {
    try {
      await producer.connect();
      isProducerConnected = true;
      console.log("[KAFKA_PRODUCER] Connected successfully");
    } catch (error) {
      console.error("[KAFKA_PRODUCER] Connection failed:", error);
      throw error;
    }
  }
};

// Send cart update event
export const sendCartUpdate = async (
  userId,
  action = "update",
  productData = null
) => {
  try {
    await connectProducer();

    const message = {
      userId,
      action, // "add", "update", "remove", "clear"
      productData,
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "cart_update",
      messages: [
        {
          key: userId.toString(),
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });

    console.log(
      `[KAFKA_PRODUCER] Sent cart update for user ${userId}, action: ${action}`
    );
    return true;
  } catch (error) {
    console.error("[KAFKA_PRODUCER] Error sending cart update:", error);
    // Don't throw error to avoid breaking cart operations
    return false;
  }
};

// Send cart checkout event
export const sendCartCheckout = async (userId, cartItems, orderData = {}) => {
  try {
    await connectProducer();

    const message = {
      userId,
      action: "checkout",
      cartItems,
      orderData,
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "cart_checkout",
      messages: [
        {
          key: userId.toString(),
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });

    console.log(`[KAFKA_PRODUCER] Sent cart checkout for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[KAFKA_PRODUCER] Error sending cart checkout:", error);
    return false;
  }
};

// Send cart sync event (for periodic sync)
export const sendCartSync = async (userId) => {
  try {
    await connectProducer();

    const message = {
      userId,
      action: "sync",
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "cart_sync",
      messages: [
        {
          key: userId.toString(),
          value: JSON.stringify(message),
          timestamp: Date.now().toString(),
        },
      ],
    });

    console.log(`[KAFKA_PRODUCER] Sent cart sync for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[KAFKA_PRODUCER] Error sending cart sync:", error);
    return false;
  }
};

// Graceful shutdown
export const disconnectProducer = async () => {
  try {
    if (isProducerConnected) {
      await producer.disconnect();
      isProducerConnected = false;
      console.log("[KAFKA_PRODUCER] Disconnected successfully");
    }
  } catch (error) {
    console.error("[KAFKA_PRODUCER] Error disconnecting:", error);
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  console.log("[KAFKA_PRODUCER] Received SIGINT, shutting down gracefully");
  await disconnectProducer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("[KAFKA_PRODUCER] Received SIGTERM, shutting down gracefully");
  await disconnectProducer();
  process.exit(0);
});

export default producer;
