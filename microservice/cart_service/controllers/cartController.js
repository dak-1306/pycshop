import {
  addItemToRedis,
  getCartFromRedis,
  updateItemInRedis,
  removeItemFromRedis,
  clearCart,
  getCartItemCount,
  getCartTotalQuantity,
} from "../services/redisService.js";
import { sendCartUpdate, sendCartCheckout } from "../services/kafkaProducer.js";
import { CartModel } from "../models/cartModel.js";

// Load cart from MySQL when Redis is empty
const loadCartFromMySQL = async (userId) => {
  return await CartModel.loadFromDatabase(userId);
};

// Restore cart from MySQL to Redis
const restoreCartToRedis = async (userId, cart) => {
  try {
    for (const [productId, itemData] of Object.entries(cart)) {
      await addItemToRedis(
        userId,
        productId,
        itemData.quantity,
        itemData.product || {}
      );
    }
    console.log(
      `[CART_CONTROLLER] Restored ${
        Object.keys(cart).length
      } items to Redis for user ${userId}`
    );
  } catch (error) {
    console.error("[CART_CONTROLLER] Error restoring cart to Redis:", error);
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, productData = {} } = req.body;
    const userId = req.headers["x-user-id"];
    console.log(
      `[CART_CONTROLLER] addToCart called with productId: ${productId}, quantity: ${quantity}, userId: ${userId}`
    );
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Add item to Redis
    await addItemToRedis(userId, productId, quantity, productData);

    // // Send Kafka event for sync
    // await sendCartUpdate(userId, "add", { productId, quantity, productData });

    // Get updated cart count
    const itemCount = await getCartItemCount(userId);

    console.log(
      `[CART_CONTROLLER] Added ${quantity} of product ${productId} to cart for user ${userId}`
    );

    res.json({
      success: true,
      message: "Thêm vào giỏ thành công!",
      data: {
        productId,
        quantity,
        totalItems: itemCount,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm vào giỏ hàng",
      error: error.message,
    });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity cannot be negative",
      });
    }

    // Update item in Redis
    await updateItemInRedis(userId, productId, quantity);

    // Send Kafka event for sync
    const action = quantity === 0 ? "remove" : "update";
    // await sendCartUpdate(userId, action, { productId, quantity });

    // Get updated cart count
    const itemCount = await getCartItemCount(userId);

    console.log(
      `[CART_CONTROLLER] Updated product ${productId} quantity to ${quantity} for user ${userId}`
    );

    res.json({
      success: true,
      message:
        quantity === 0
          ? "Đã xóa sản phẩm khỏi giỏ hàng"
          : "Đã cập nhật số lượng",
      data: {
        productId,
        quantity,
        totalItems: itemCount,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật giỏ hàng",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Remove item from Redis
    await removeItemFromRedis(userId, productId);

    // // Send Kafka event for sync
    // await sendCartUpdate(userId, "remove", { productId });

    // Get updated cart count
    const itemCount = await getCartItemCount(userId);

    console.log(
      `[CART_CONTROLLER] Removed product ${productId} from cart for user ${userId}`
    );

    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      data: {
        productId,
        totalItems: itemCount,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error removing from cart:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      error: error.message,
    });
  }
};

// View cart
export const viewCart = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"] || req.params.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Get cart from Redis first
    let cart = await getCartFromRedis(userId);
    let itemCount = await getCartItemCount(userId);

    // If Redis cart is empty, try to load from MySQL
    if (!cart || Object.keys(cart).length === 0) {
      console.log(
        `[CART_CONTROLLER] Redis cart empty for user ${userId}, loading from MySQL...`
      );
      cart = await loadCartFromMySQL(userId);
      itemCount = Object.keys(cart).length; // Count unique products, not total quantity

      // If we found cart in MySQL, restore it to Redis
      if (cart && Object.keys(cart).length > 0) {
        console.log(
          `[CART_CONTROLLER] Restoring ${
            Object.keys(cart).length
          } items to Redis for user ${userId}`
        );
        await restoreCartToRedis(userId, cart);
      }
    }

    console.log(
      `[CART_CONTROLLER] Retrieved cart for user ${userId} with ${itemCount} items`
    );

    res.json({
      success: true,
      data: {
        cart: cart || {},
        totalItems: itemCount,
        userId,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error viewing cart:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải giỏ hàng",
      error: error.message,
    });
  }
};

// Get cart item count (unique products)
export const getCartCount = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    let itemCount = await getCartItemCount(userId);

    // If Redis count is 0, check MySQL
    if (itemCount === 0) {
      console.log(
        `[CART_CONTROLLER] Redis count is 0 for user ${userId}, checking MySQL...`
      );
      const cart = await loadCartFromMySQL(userId);
      itemCount = Object.keys(cart).length; // Count unique products, not total quantity

      // If we found cart in MySQL, restore it to Redis
      if (cart && Object.keys(cart).length > 0) {
        console.log(
          `[CART_CONTROLLER] Restoring cart to Redis for count check, user ${userId}`
        );
        await restoreCartToRedis(userId, cart);
      }
    }

    res.json({
      success: true,
      data: {
        totalItems: itemCount,
        userId,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error getting cart count:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy số lượng sản phẩm trong giỏ hàng",
      error: error.message,
    });
  }
};

// Get cart total quantity (sum of all product quantities)
export const getCartTotalQuantityController = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    let totalQuantity = await getCartTotalQuantity(userId);

    // If Redis total is 0, check MySQL
    if (totalQuantity === 0) {
      console.log(
        `[CART_CONTROLLER] Redis total is 0 for user ${userId}, checking MySQL...`
      );
      const cart = await loadCartFromMySQL(userId);
      totalQuantity = Object.values(cart).reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );

      // If we found cart in MySQL, restore it to Redis
      if (cart && Object.keys(cart).length > 0) {
        console.log(
          `[CART_CONTROLLER] Restoring cart to Redis for quantity check, user ${userId}`
        );
        await restoreCartToRedis(userId, cart);
      }
    }

    res.json({
      success: true,
      data: {
        totalQuantity,
        userId,
      },
    });
  } catch (error) {
    console.error(
      "[CART_CONTROLLER] Error getting cart total quantity:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tổng số lượng sản phẩm trong giỏ hàng",
      error: error.message,
    });
  }
};

// Clear cart
export const clearCartController = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Clear cart in Redis
    await clearCart(userId);

    // Send Kafka event for sync
    await sendCartUpdate(userId, "clear");

    console.log(`[CART_CONTROLLER] Cleared cart for user ${userId}`);

    res.json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
      data: {
        totalItems: 0,
        userId,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa giỏ hàng",
      error: error.message,
    });
  }
};

// Checkout
export const checkout = async (req, res) => {
  try {
    const { orderData = {} } = req.body;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Get current cart
    const cartItems = await getCartFromRedis(userId);

    if (!cartItems || Object.keys(cartItems).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    // Send checkout event to Kafka
    await sendCartCheckout(userId, cartItems, orderData);

    // Clear cart after checkout
    await clearCart(userId);

    // Send cart clear event
    await sendCartUpdate(userId, "checkout");

    console.log(
      `[CART_CONTROLLER] User ${userId} checked out with ${
        Object.keys(cartItems).length
      } items`
    );

    res.json({
      success: true,
      message: "Đặt hàng thành công, giỏ hàng đã được làm trống!",
      data: {
        orderItems: cartItems,
        orderData,
        userId,
      },
    });
  } catch (error) {
    console.error("[CART_CONTROLLER] Error during checkout:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đặt hàng",
      error: error.message,
    });
  }
};
