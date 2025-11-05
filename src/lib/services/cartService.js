// Cart Service for Frontend
const API_BASE_URL = "http://localhost:5000";

class CartService {
  // Get auth headers
  static getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Add item to cart
  static async addToCart(productId, quantity = 1, productData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          productId,
          quantity,
          productData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add to cart");
      }

      return result;
    } catch (error) {
      console.error("CartService - addToCart error:", error);
      throw error;
    }
  }

  // Update item quantity
  static async updateCartItem(productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update cart item");
      }

      return result;
    } catch (error) {
      console.error("CartService - updateCartItem error:", error);
      throw error;
    }
  }

  // Remove item from cart
  static async removeFromCart(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to remove from cart");
      }

      return result;
    } catch (error) {
      console.error("CartService - removeFromCart error:", error);
      throw error;
    }
  }

  // Get cart
  static async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/view`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get cart");
      }

      return result;
    } catch (error) {
      console.error("CartService - getCart error:", error);
      throw error;
    }
  }

  // Get cart count
  static async getCartCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/count`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get cart count");
      }

      return result.data.totalItems || 0;
    } catch (error) {
      console.error("CartService - getCartCount error:", error);
      return 0; // Return 0 on error to avoid breaking UI
    }
  }

  // Clear cart
  static async clearCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to clear cart");
      }

      return result;
    } catch (error) {
      console.error("CartService - clearCart error:", error);
      throw error;
    }
  }

  // Checkout
  static async checkout(orderData = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ orderData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to checkout");
      }

      return result;
    } catch (error) {
      console.error("CartService - checkout error:", error);
      throw error;
    }
  }

  // Transform cart data for frontend display
  static transformCartForDisplay(cartData) {
    const items = [];

    if (cartData && cartData.cart) {
      for (const [productId, itemData] of Object.entries(cartData.cart)) {
        if (itemData.quantity > 0 && itemData.product) {
          items.push({
            id: productId,
            quantity: itemData.quantity,
            ...itemData.product,
          });
        }
      }
    }

    return {
      items,
      totalItems: cartData.totalItems || 0,
    };
  }
}

export default CartService;
