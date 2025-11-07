import { sendCartSync } from "./kafkaProducer.js";
import redis, { getCartFromRedis } from "./redisService.js";

export const scheduleRedisToKafkaSync = () => {
  setInterval(async () => {
    try {
      const users = await redis.smembers("cart:pending_sync_users");
      for (const userId of users) {
        const cart = await getCartFromRedis(userId);
        if (Object.keys(cart).length > 0) {
          await sendCartSync(userId, cart);
          console.log(`[SYNC JOB] Synced cart for user ${userId}`);
        }
      }
      // clear after sync
      if (users.length > 0) await redis.del("cart:pending_sync_users");
    } catch (err) {
      console.error("[SYNC JOB] Error syncing carts:", err);
    }
  }, 5 * 60 * 1000); // 5 phút
  console.log(
    "[SYNC JOB] Redis to Kafka sync scheduler started (every 5 minutes)"
  );
};
