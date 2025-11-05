import {
  addItemToRedis,
  getCartFromRedis,
  updateItemInRedis,
  removeItemFromRedis,
  clearCart,
  getCartItemCount,
} from "../services/redisService.js";
import { sendCartUpdate, sendCartCheckout } from "../services/kafkaProducer.js";

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

    // Get cart from Redis
    const cart = await getCartFromRedis(userId);
    const itemCount = await getCartItemCount(userId);

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

// Get cart item count
export const getCartCount = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const itemCount = await getCartItemCount(userId);

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
