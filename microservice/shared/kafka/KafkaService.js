import { Kafka } from "kafkajs";

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: "pycshop-app",
      brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
    });

    this.producer = this.kafka.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });

    this.consumer = null;
    this.isProducerConnected = false;
  }

  // Initialize producer
  async initProducer() {
    try {
      if (!this.isProducerConnected) {
        await this.producer.connect();
        this.isProducerConnected = true;
        console.log("[KAFKA] Producer connected successfully");
      }
    } catch (error) {
      console.error("[KAFKA] Failed to connect producer:", error);
      throw error;
    }
  }

  // Create consumer for specific group
  async createConsumer(groupId, topics = []) {
    try {
      const consumer = this.kafka.consumer({
        groupId,
        sessionTimeout: 30000,
        rebalanceTimeout: 60000,
        heartbeatInterval: 3000,
      });

      await consumer.connect();

      if (topics.length > 0) {
        await consumer.subscribe({
          topics: topics,
          fromBeginning: false,
        });
      }

      console.log(`[KAFKA] Consumer connected for group: ${groupId}`);
      return consumer;
    } catch (error) {
      console.error(
        `[KAFKA] Failed to create consumer for group ${groupId}:`,
        error
      );
      throw error;
    }
  }

  // Send message to topic
  async sendMessage(topic, message, key = null) {
    try {
      await this.initProducer();

      const kafkaMessage = {
        topic,
        messages: [
          {
            key: key,
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
          },
        ],
      };

      const result = await this.producer.send(kafkaMessage);
      console.log(`[KAFKA] Message sent to topic ${topic}:`, {
        partition: result[0].partition,
        offset: result[0].offset,
        key: key,
      });

      return result;
    } catch (error) {
      console.error(`[KAFKA] Failed to send message to topic ${topic}:`, error);
      throw error;
    }
  }

  // Send order event
  async sendOrderEvent(eventType, orderData) {
    const topic = "order-events";
    const message = {
      eventType, // 'ORDER_CREATED', 'ORDER_UPDATED', 'ORDER_CANCELLED'
      timestamp: new Date().toISOString(),
      data: orderData,
      source: "ORDER_SERVICE",
    };

    return await this.sendMessage(
      topic,
      message,
      orderData.orderId?.toString()
    );
  }

  // Send notification event
  async sendNotificationEvent(eventType, notificationData) {
    const topic = "notification-events";
    const message = {
      eventType, // 'NOTIFICATION_CREATED', 'NOTIFICATION_READ'
      timestamp: new Date().toISOString(),
      data: notificationData,
      source: "NOTIFICATION_SERVICE",
    };

    return await this.sendMessage(
      topic,
      message,
      notificationData.userId?.toString()
    );
  }

  // Disconnect
  async disconnect() {
    try {
      if (this.isProducerConnected) {
        await this.producer.disconnect();
        this.isProducerConnected = false;
      }
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      console.log("[KAFKA] Disconnected successfully");
    } catch (error) {
      console.error("[KAFKA] Error during disconnect:", error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      const metadata = await admin.fetchTopicMetadata();
      await admin.disconnect();

      return {
        status: "healthy",
        topics: metadata.topics.map((t) => t.name),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Singleton instance
const kafkaService = new KafkaService();

export default kafkaService;
