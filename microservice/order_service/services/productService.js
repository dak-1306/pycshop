// Service to communicate with Product Service for inventory management
class ProductService {
  constructor() {
    this.baseUrl = process.env.PRODUCT_SERVICE_URL || "http://localhost:5002";
  }

  // Update inventory after successful order
  async updateInventoryAfterOrder(orderId, orderItems) {
    try {
      console.log(
        `[PRODUCT_SERVICE] Updating inventory for order ${orderId} with ${orderItems.length} items`
      );

      const response = await fetch(
        `${this.baseUrl}/inventory/update-after-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            orderItems: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PRODUCT_SERVICE] Failed to update inventory. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Product service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PRODUCT_SERVICE] Successfully updated inventory for order ${orderId}`
      );

      return {
        success: true,
        message: "Inventory updated successfully",
        data,
      };
    } catch (error) {
      console.error(
        `[PRODUCT_SERVICE] Error updating inventory for order ${orderId}:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with product service",
        error: error.message,
      };
    }
  }

  // Check inventory availability before creating order
  async checkInventoryAvailability(orderItems) {
    try {
      console.log(
        `[PRODUCT_SERVICE] Checking inventory availability for ${orderItems.length} items`
      );

      const response = await fetch(
        `${this.baseUrl}/inventory/check-availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: orderItems.map((item) => ({
              productId: item.productId || item.id, // Support both formats
              quantity: item.quantity,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PRODUCT_SERVICE] Failed to check inventory availability. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Product service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PRODUCT_SERVICE] Inventory availability check completed. All available: ${data.data.allAvailable}`
      );

      return {
        success: true,
        allAvailable: data.data.allAvailable,
        items: data.data.items,
        data,
      };
    } catch (error) {
      console.error(
        `[PRODUCT_SERVICE] Error checking inventory availability:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with product service",
        error: error.message,
      };
    }
  }

  // Rollback inventory (for order cancellation scenarios)
  async rollbackInventory(orderId, orderItems, reason = "Order cancelled") {
    try {
      console.log(
        `[PRODUCT_SERVICE] Rolling back inventory for order ${orderId}, reason: ${reason}`
      );

      const response = await fetch(`${this.baseUrl}/inventory/rollback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          reason,
          orderItems: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PRODUCT_SERVICE] Failed to rollback inventory. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Product service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PRODUCT_SERVICE] Successfully rolled back inventory for order ${orderId}`
      );

      return {
        success: true,
        message: "Inventory rollback completed",
        data,
      };
    } catch (error) {
      console.error(
        `[PRODUCT_SERVICE] Error rolling back inventory for order ${orderId}:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with product service",
        error: error.message,
      };
    }
  }

  // Get inventory history for a product
  async getInventoryHistory(productId, page = 1, limit = 20) {
    try {
      console.log(
        `[PRODUCT_SERVICE] Getting inventory history for product ${productId}`
      );

      const response = await fetch(
        `${this.baseUrl}/inventory/history/${productId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `[PRODUCT_SERVICE] Failed to get inventory history. Status: ${response.status}`,
          errorData
        );
        return {
          success: false,
          message: `Product service responded with status ${response.status}`,
          error: errorData,
        };
      }

      const data = await response.json();
      console.log(
        `[PRODUCT_SERVICE] Successfully retrieved inventory history for product ${productId}`
      );

      return {
        success: true,
        data: data.data,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error(
        `[PRODUCT_SERVICE] Error getting inventory history for product ${productId}:`,
        error
      );
      return {
        success: false,
        message: "Failed to communicate with product service",
        error: error.message,
      };
    }
  }

  // Check product service health
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/inventory/health`, {
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
      console.error("[PRODUCT_SERVICE] Health check failed:", error);
      return {
        success: false,
        message: "Failed to reach product service",
        error: error.message,
      };
    }
  }
}

export default new ProductService();
