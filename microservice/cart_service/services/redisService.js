import Redis from "ioredis";
import { CartModel } from "../models/cartModel.js";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Handle Redis connection events
redis.on("connect", () => {
  console.log("[REDIS] Connected to Redis server");
});

redis.on("error", (err) => {
  console.error("[REDIS] Redis connection error:", err);
});

redis.on("ready", () => {
  console.log("[REDIS] Redis is ready");
});

// Add item to cart in Redis
export const addItemToRedis = async (
  userId,
  productId,
  quantity,
  productData = {}
) => {
  try {
    const key = `cart:${userId}`;
    const productKey = `product:${productId}`;

    // Store product info separately for easy retrieval
    if (Object.keys(productData).length > 0) {
      await redis.hset(
        `cart_products:${userId}`,
        productKey,
        JSON.stringify(productData)
      );
    }

    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
    const currentQty = await redis.hget(key, productId);
    let newQty;

    if (currentQty) {
      // Nếu đã có thì cộng thêm
      newQty = parseInt(currentQty) + parseInt(quantity);
      await redis.hset(key, productId, newQty);
      console.log(
        `[REDIS] Updated product ${productId} quantity from ${currentQty} -> ${newQty} for user ${userId}`
      );
    } else {
      // Nếu chưa có thì thêm mới
      newQty = parseInt(quantity);
      await redis.hset(key, productId, newQty);
      console.log(
        `[REDIS] Added new product ${productId} (quantity=${newQty}) for user ${userId}`
      );
    }

    // Set TTL = 7 days
    await redis.expire(key, 7 * 24 * 60 * 60);
    await redis.expire(`cart_products:${userId}`, 7 * 24 * 60 * 60);

    //Đánh dấu user này cần đồng bộ cart
    await redis.sadd("cart:pending_sync_users", userId);

    console.log(
      `[REDIS] Added ${quantity} of product ${productId} to cart for user ${userId}`
    );
    return true;
  } catch (error) {
    console.error("[REDIS] Error adding item to cart:", error);
    throw error;
  }
};

// Get cart from Redis with MySQL fallback
export const getCartFromRedis = async (userId) => {
  try {
    const key = `cart:${userId}`;
    const productKey = `cart_products:${userId}`;

    const cartItems = await redis.hgetall(key);
    const productData = await redis.hgetall(productKey);

    // If Redis has no cart data, try to load from MySQL
    if (!cartItems || Object.keys(cartItems).length === 0) {
      console.log(
        `[REDIS] No cart data in Redis for user ${userId}, loading from MySQL...`
      );

      const mysqlCart = await CartModel.loadFromDatabase(userId);

      if (mysqlCart && Object.keys(mysqlCart).length > 0) {
        console.log(
          `[REDIS] Found cart in MySQL for user ${userId}, restoring to Redis...`
        );

        // Restore cart to Redis
        await restoreCartToRedis(userId, mysqlCart);

        return mysqlCart;
      }

      // No cart found in either Redis or MySQL
      console.log(`[REDIS] No cart found for user ${userId} in Redis or MySQL`);
      return {};
    }

    // Combine cart quantities with product data
    const cart = {};
    for (const [productId, quantity] of Object.entries(cartItems)) {
      const productInfo = productData[`product:${productId}`];
      cart[productId] = {
        quantity: parseInt(quantity),
        product: productInfo ? JSON.parse(productInfo) : null,
      };
    }

    console.log(
      `[REDIS] Retrieved cart for user ${userId}:`,
      Object.keys(cart).length,
      "items"
    );
    return cart;
  } catch (error) {
    console.error("[REDIS] Error getting cart:", error);
    throw error;
  }
};

// Update item quantity in cart
export const updateItemInRedis = async (userId, productId, quantity) => {
  try {
    const key = `cart:${userId}`;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await redis.hdel(key, productId);
      await redis.hdel(`cart_products:${userId}`, `product:${productId}`);
      console.log(
        `[REDIS] Removed product ${productId} from cart for user ${userId}`
      );
    } else {
      // Update quantity
      await redis.hset(key, productId, quantity);
      console.log(
        `[REDIS] Updated product ${productId} quantity to ${quantity} for user ${userId}`
      );
    }

    // Refresh TTL
    await redis.expire(key, 7 * 24 * 60 * 60);
    await redis.expire(`cart_products:${userId}`, 7 * 24 * 60 * 60);

    //Đánh dấu user này cần đồng bộ cart
    await redis.sadd("cart:pending_sync_users", userId);

    return true;
  } catch (error) {
    console.error("[REDIS] Error updating item in cart:", error);
    throw error;
  }
};

// Remove item from cart
export const removeItemFromRedis = async (userId, productId) => {
  try {
    const key = `cart:${userId}`;
    await redis.hdel(key, productId);
    await redis.hdel(`cart_products:${userId}`, `product:${productId}`);

    //Đánh dấu user cần sync
    await redis.sadd("cart:pending_sync_users", userId);

    console.log(
      `[REDIS] Removed product ${productId} from cart for user ${userId}`
    );
    return true;
  } catch (error) {
    console.error("[REDIS] Error removing item from cart:", error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (userId) => {
  try {
    await redis.del(`cart:${userId}`);
    await redis.del(`cart_products:${userId}`);

    //Đánh dấu user cần sync
    await redis.sadd("cart:pending_sync_users", userId);

    console.log(`[REDIS] Cleared cart for user ${userId}`);
    return true;
  } catch (error) {
    console.error("[REDIS] Error clearing cart:", error);
    throw error;
  }
};

// Get cart item count (number of unique products, not total quantity) with MySQL fallback
export const getCartItemCount = async (userId) => {
  try {
    const key = `cart:${userId}`;
    const cartItems = await redis.hgetall(key);

    // If Redis has cart data, return count
    if (cartItems && Object.keys(cartItems).length > 0) {
      const uniqueProductCount = Object.keys(cartItems).length;
      console.log(
        `[REDIS] Cart item count for user ${userId}: ${uniqueProductCount} unique products`
      );
      return uniqueProductCount;
    }

    // If Redis is empty, try MySQL fallback
    console.log(
      `[REDIS] Redis count is 0 for user ${userId}, checking MySQL...`
    );

    const mysqlCart = await CartModel.loadFromDatabase(userId);
    const mysqlCount = Object.keys(mysqlCart).length;

    // If MySQL has cart data, restore to Redis
    if (mysqlCart && mysqlCount > 0) {
      console.log(
        `[REDIS] Found ${mysqlCount} items in MySQL for user ${userId}, restoring to Redis...`
      );
      await restoreCartToRedis(userId, mysqlCart);
    }

    console.log(
      `[REDIS] Cart item count for user ${userId}: ${mysqlCount} unique products (from MySQL)`
    );
    return mysqlCount;
  } catch (error) {
    console.error("[REDIS] Error getting cart item count:", error);
    throw error;
  }
};

// Get cart total quantity (sum of all product quantities) with MySQL fallback
export const getCartTotalQuantity = async (userId) => {
  try {
    const key = `cart:${userId}`;
    const cartItems = await redis.hgetall(key);

    // If Redis has cart data, calculate total
    if (cartItems && Object.keys(cartItems).length > 0) {
      const totalQuantity = Object.values(cartItems).reduce(
        (total, quantity) => {
          return total + parseInt(quantity);
        },
        0
      );

      console.log(
        `[REDIS] Cart total quantity for user ${userId}: ${totalQuantity} items`
      );
      return totalQuantity;
    }

    // If Redis is empty, try MySQL fallback
    console.log(
      `[REDIS] Redis total is 0 for user ${userId}, checking MySQL...`
    );

    const mysqlCart = await CartModel.loadFromDatabase(userId);
    const mysqlTotalQuantity = Object.values(mysqlCart).reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    // If MySQL has cart data, restore to Redis
    if (mysqlCart && Object.keys(mysqlCart).length > 0) {
      console.log(
        `[REDIS] Found cart in MySQL for user ${userId}, restoring to Redis...`
      );
      await restoreCartToRedis(userId, mysqlCart);
    }

    console.log(
      `[REDIS] Cart total quantity for user ${userId}: ${mysqlTotalQuantity} items (from MySQL)`
    );
    return mysqlTotalQuantity;
  } catch (error) {
    console.error("[REDIS] Error getting cart total quantity:", error);
    throw error;
  }
};

// Helper function to restore cart from MySQL to Redis (without triggering sync)
export const restoreCartToRedis = async (userId, cart) => {
  try {
    const key = `cart:${userId}`;
    const productKey = `cart_products:${userId}`;

    // Clear existing Redis data
    await redis.del(key);
    await redis.del(productKey);

    // Restore cart items
    for (const [productId, itemData] of Object.entries(cart)) {
      if (itemData.quantity > 0) {
        // Set cart quantity
        await redis.hset(key, productId, itemData.quantity);

        // Set product data if available
        if (itemData.product) {
          await redis.hset(
            productKey,
            `product:${productId}`,
            JSON.stringify(itemData.product)
          );
        }
      }
    }

    // Set TTL = 7 days
    if (Object.keys(cart).length > 0) {
      await redis.expire(key, 7 * 24 * 60 * 60);
      await redis.expire(productKey, 7 * 24 * 60 * 60);
    }

    console.log(
      `[REDIS] Restored ${
        Object.keys(cart).length
      } items to Redis for user ${userId}`
    );
  } catch (error) {
    console.error("[REDIS] Error restoring cart to Redis:", error);
    throw error;
  }
};

export default redis;
