import { Kafka } from "kafkajs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pycshop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Kafka configuration
const kafka = new Kafka({
  clientId: "shop-rating-consumer",
  brokers: [process.env.KAFKA_BROKERS || "localhost:9092"],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

const consumer = kafka.consumer({ groupId: "shop-rating-group" });

class ShopRatingConsumer {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 5000; // 5 seconds
    this.isConnected = false;
  }

  async initialize() {
    let attempt = 0;
    while (attempt < this.retryAttempts) {
      try {
        console.log(
          `[KAFKA] Connection attempt ${attempt + 1}/${this.retryAttempts}`
        );

        await consumer.connect();
        await consumer.subscribe({ topic: "shop-rating-update" });

        console.log("✅ [KAFKA] Shop rating consumer connected and subscribed");
        this.isConnected = true;

        await consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            try {
              const data = JSON.parse(message.value.toString());
              console.log(`📨 [KAFKA] Received message:`, data);
              await this.handleReviewCreated(data);
            } catch (error) {
              console.error("❌ [KAFKA] Error processing message:", error);
              // Don't throw error here to prevent consumer from crashing
            }
          },
        });

        // If we reach here, connection was successful
        return;
      } catch (error) {
        attempt++;
        console.error(
          `❌ [KAFKA] Connection attempt ${attempt} failed:`,
          error.message
        );

        if (attempt < this.retryAttempts) {
          console.log(
            `⏳ [KAFKA] Retrying in ${this.retryDelay / 1000} seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        } else {
          console.error(
            "💥 [KAFKA] Failed to initialize consumer after all attempts"
          );
          throw error;
        }
      }
    }
  }

  async handleReviewCreated(data) {
    if (data.eventType !== "REVIEW_CREATED") {
      console.log(`⚠️ [KAFKA] Skipping non-review event: ${data.eventType}`);
      return;
    }

    console.log(
      `🔄 [KAFKA] Processing review created event for shop ${data.shopId}, product ${data.productId}`
    );

    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        console.log(`📊 [DB] Transaction started (attempt ${attempt + 1})`);

        // Calculate average rating for the shop
        const [ratingResult] = await connection.execute(
          `
          SELECT AVG(dg.TyLe) AS average_rating
  FROM danhgiasanpham dg
  JOIN sanpham sp ON dg.ID_SanPham = sp.ID_SanPham
  WHERE sp.ID_SanPham IN (
      SELECT sp2.ID_SanPham
      FROM sanpham sp2
      JOIN nguoidung nd2 ON nd2.ID_NguoiDung = sp2.ID_NguoiBan
      WHERE nd2.ID_CuaHang = ?
  );

        `,
          [data.shopId]
        );

        const averageRating = ratingResult[0].average_rating || 0;

        // Update shop rating
        await connection.execute(
          `
          UPDATE cuahang 
          SET DanhGiaTB = ?, NgayCapNhat = NOW()
          WHERE ID_CuaHang = ?
        `,
          [averageRating, data.shopId]
        );

        // Update or insert into product rating cache for the specific product
        // Calculate complete rating statistics including star distribution
        const [productRatingResult] = await connection.execute(
          `
         SELECT 
  COUNT(*) AS total_reviews,
  SUM(TyLe = 1) AS count_1_star,
  SUM(TyLe = 2) AS count_2_star,
  SUM(TyLe = 3) AS count_3_star,
  SUM(TyLe = 4) AS count_4_star,
  SUM(TyLe = 5) AS count_5_star,
  COALESCE(ROUND(AVG(TyLe), 1), 0) AS average_rating
FROM danhgiasanpham
WHERE ID_SanPham = ?;

          `,
          [data.productId]
        );

        const stats = productRatingResult[0];
        const productAvgRating = stats.average_rating || 0;
        const productTotalReviews = stats.total_reviews || 0;
        const count1Star = stats.count_1_star || 0;
        const count2Star = stats.count_2_star || 0;
        const count3Star = stats.count_3_star || 0;
        const count4Star = stats.count_4_star || 0;
        const count5Star = stats.count_5_star || 0;

        // Check if cache record exists for this product
        const [existingCache] = await connection.execute(
          `SELECT ID_SanPham FROM product_rating_cache WHERE ID_SanPham = ?`,
          [data.productId]
        );

        if (existingCache.length > 0) {
          // Update existing cache record with complete star distribution
          await connection.execute(
            `
            UPDATE product_rating_cache 
            SET 
              average_rating = ?, 
              total_reviews = ?,
              count_1_star = ?,
              count_2_star = ?,
              count_3_star = ?,
              count_4_star = ?,
              count_5_star = ?,
              last_updated = NOW()
            WHERE ID_SanPham = ?
            `,
            [
              productAvgRating,
              productTotalReviews,
              count1Star,
              count2Star,
              count3Star,
              count4Star,
              count5Star,
              data.productId,
            ]
          );
        } else {
          // Insert new cache record with complete star distribution
          await connection.execute(
            `
            INSERT INTO product_rating_cache 
            (ID_SanPham, average_rating, total_reviews, count_1_star, count_2_star, count_3_star, count_4_star, count_5_star, last_updated) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `,
            [
              data.productId,
              productAvgRating,
              productTotalReviews,
              count1Star,
              count2Star,
              count3Star,
              count4Star,
              count5Star,
            ]
          );
        }

        await connection.commit();
        console.log(`✅ [DB] Transaction committed successfully`);

        console.log(
          `✅ [SHOP] Updated shop ${data.shopId} rating to ${averageRating}`
        );
        console.log(
          `✅ [CACHE] Updated product ${data.productId} cache: ${productAvgRating}/5 (${productTotalReviews} reviews)`
        );
        console.log(
          `⭐ [CACHE] Star distribution - 1⭐: ${count1Star}, 2⭐: ${count2Star}, 3⭐: ${count3Star}, 4⭐: ${count4Star}, 5⭐: ${count5Star}`
        );

        // Success - break out of retry loop
        return;
      } catch (error) {
        await connection.rollback();
        attempt++;

        console.error(
          `❌ [DB] Transaction failed (attempt ${attempt}/${maxRetries}):`,
          error.message
        );

        if (attempt < maxRetries) {
          console.log(`⏳ [DB] Retrying in 2 seconds...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.error(
            `💥 [DB] All retry attempts failed for shop ${data.shopId}, product ${data.productId}`
          );
          throw error;
        }
      } finally {
        connection.release();
      }
    }
  }

  async disconnect() {
    try {
      await consumer.disconnect();
      await pool.end();
      console.log("Shop rating consumer disconnected");
    } catch (error) {
      console.error("Error disconnecting consumer:", error);
    }
  }
}

const shopRatingConsumer = new ShopRatingConsumer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down shop rating consumer...");
  await shopRatingConsumer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down shop rating consumer...");
  await shopRatingConsumer.disconnect();
  process.exit(0);
});

// Start the consumer
const startConsumer = async () => {
  try {
    await shopRatingConsumer.initialize();
    console.log("Shop rating consumer started successfully");
  } catch (error) {
    console.error("Failed to start shop rating consumer:", error);
    process.exit(1);
  }
};

startConsumer();
