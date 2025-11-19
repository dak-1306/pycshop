// Service to communicate with Cart Service
class CartService {
  constructor() {
    this.baseUrl = process.env.CART_SERVICE_URL || "http://localhost:5004";
  }

  // Clear user's cart after successful order
  async clearUserCart(userId) {
    try {
      console.log(`[CART_SERVICE] Clearing cart for user ${userId}`);

      const response = await fetch(`${this.baseUrl}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId.toString(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[CART_SERVICE] Failed to clear cart. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Cart service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[CART_SERVICE] Successfully cleared cart for user ${userId}`
      );

      return {
        success: true,
        message: "Cart cleared successfully",
        data,
      };
    } catch (error) {
      console.error(
        `[CART_SERVICE] Error clearing cart for user ${userId}:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with cart service",
        error: error.message,
      };
    }
  }

  // Remove specific items from cart (alternative approach if needed)
  async removeItemsFromCart(userId, productIds) {
    try {
      console.log(
        `[CART_SERVICE] Removing ${productIds.length} items from cart for user ${userId}`
      );

      const results = [];

      for (const productId of productIds) {
        try {
          const response = await fetch(
            `${this.baseUrl}/api/cart/remove/${productId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "x-user-id": userId.toString(),
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            results.push({ productId, success: true, data });
            console.log(
              `[CART_SERVICE] Removed product ${productId} from cart`
            );
          } else {
            const errorData = await response.json().catch(() => ({}));
            results.push({ productId, success: false, error: errorData });
            console.error(
              `[CART_SERVICE] Failed to remove product ${productId}:`,
              errorData
            );
          }
        } catch (error) {
          results.push({ productId, success: false, error: error.message });
          console.error(
            `[CART_SERVICE] Error removing product ${productId}:`,
            error
          );
        }
      }

      const successCount = results.filter((r) => r.success).length;

      return {
        success: successCount === productIds.length,
        message: `Removed ${successCount}/${productIds.length} items from cart`,
        results,
      };
    } catch (error) {
      console.error(`[CART_SERVICE] Error removing items from cart:`, error);
      return {
        success: false,
        message: "Failed to communicate with cart service",
        error: error.message,
      };
    }
  }

  // Check cart service health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/cart/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        return {
          success: false,
          message: `Health check failed with status ${response.status}`,
        };
      }
    } catch (error) {
      console.error("[CART_SERVICE] Health check failed:", error);
      return {
        success: false,
        message: "Failed to reach cart service",
        error: error.message,
      };
    }
  }
}

export default new CartService();
