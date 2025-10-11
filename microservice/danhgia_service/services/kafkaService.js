import { Kafka } from "kafkajs";

// Initialize Kafka client
const kafka = new Kafka({
  clientId: "review-service",
  brokers: ["localhost:9092"], // Adjust this to your Kafka broker
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const producer = kafka.producer();

let isKafkaConnected = false;

const kafkaService = {
  // Initialize Kafka producer
  initialize: async () => {
    try {
      await producer.connect();
      console.log("✅ Kafka producer connected successfully");
      isKafkaConnected = true;
      return true;
    } catch (error) {
      console.log(
        "⚠️  Kafka not available - running without shop rating auto-update"
      );
      isKafkaConnected = false;
      // Don't throw error - service should work without Kafka
      return false;
    }
  },

  // Send message when new review is created
  sendReviewCreatedMessage: async (reviewData) => {
    if (!isKafkaConnected) {
      console.log(
        "⚠️  Kafka not connected - skipping shop rating update message"
      );
      return;
    }

    try {
      const message = {
        topic: "shop-rating-update",
        messages: [
          {
            key: `shop-${reviewData.shopId}`,
            value: JSON.stringify({
              eventType: "REVIEW_CREATED",
              shopId: reviewData.shopId,
              productId: reviewData.productId,
              reviewId: reviewData.reviewId,
              rating: reviewData.rating,
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      };

      await producer.send(message);
      console.log(`Review created message sent for shop ${reviewData.shopId}`);
    } catch (error) {
      console.error("Failed to send review created message:", error);
      // Don't throw error - review creation should succeed even if Kafka fails
    }
  },

  // Graceful shutdown
  disconnect: async () => {
    if (!isKafkaConnected) {
      return;
    }

    try {
      await producer.disconnect();
      console.log("Kafka producer disconnected");
      isKafkaConnected = false;
    } catch (error) {
      console.error("Error disconnecting Kafka producer:", error);
    }
  },
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await kafkaService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await kafkaService.disconnect();
  process.exit(0);
});

export default kafkaService;
