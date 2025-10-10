import { Kafka } from 'kafkajs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pycshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Kafka configuration
const kafka = new Kafka({
  clientId: 'shop-rating-consumer',
  brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const consumer = kafka.consumer({ groupId: 'shop-rating-group' });

class ShopRatingConsumer {
  async initialize() {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: 'shop-rating-update' });
      
      console.log('Shop rating consumer connected and subscribed');
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value.toString());
            await this.handleReviewCreated(data);
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
      });
    } catch (error) {
      console.error('Failed to initialize consumer:', error);
      throw error;
    }
  }

  async handleReviewCreated(data) {
    if (data.eventType !== 'REVIEW_CREATED') {
      return;
    }

    console.log(`Processing review created event for shop ${data.shopId}`);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate average rating for the shop
      const [ratingResult] = await connection.execute(`
        SELECT AVG(dg.TyLe) as average_rating
        FROM danhgiasanpham dg
        INNER JOIN sanpham sp ON dg.ID_SanPham = sp.ID_SanPham
        WHERE sp.ID_CuaHang = ?
      `, [data.shopId]);

      const averageRating = ratingResult[0].average_rating || 0;

      // Update shop rating
      await connection.execute(`
        UPDATE cuahang 
        SET DanhGiaTB = ?, NgayCapNhat = NOW()
        WHERE ID_CuaHang = ?
      `, [averageRating, data.shopId]);

      await connection.commit();
      
      console.log(`Updated shop ${data.shopId} rating to ${averageRating}`);
    } catch (error) {
      await connection.rollback();
      console.error(`Error updating shop ${data.shopId} rating:`, error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async disconnect() {
    try {
      await consumer.disconnect();
      await pool.end();
      console.log('Shop rating consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting consumer:', error);
    }
  }
}

const shopRatingConsumer = new ShopRatingConsumer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down shop rating consumer...');
  await shopRatingConsumer.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down shop rating consumer...');
  await shopRatingConsumer.disconnect();
  process.exit(0);
});

// Start the consumer
const startConsumer = async () => {
  try {
    await shopRatingConsumer.initialize();
    console.log('Shop rating consumer started successfully');
  } catch (error) {
    console.error('Failed to start shop rating consumer:', error);
    process.exit(1);
  }
};

startConsumer();
