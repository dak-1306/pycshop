import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart count from API
  const fetchCartCount = async () => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch("http://localhost:5000/cart/count", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.data?.totalItems || 0);
        console.log("Fetched cart count:", data);
      } else {
        console.error("Failed to fetch cart count:", response.status);
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, productData = {}) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to add items to cart");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
          productData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update cart count from response
        setCartCount(data.data?.totalItems || cartCount + quantity);
        return data;
      } else {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to update cart");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/cart/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.data?.totalItems || 0);
        return data;
      } else {
        throw new Error("Failed to update cart item");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to remove items from cart");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/cart/remove/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.data?.totalItems || 0);
        return data;
      } else {
        throw new Error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCartCount(0);
        return await response.json();
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  // Fetch cart count when authentication changes
  useEffect(() => {
    fetchCartCount();
  }, [isAuthenticated]);

  const value = {
    cartCount,
    isLoading,
    fetchCartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
