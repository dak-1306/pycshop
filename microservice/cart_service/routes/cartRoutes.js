import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  viewCart,
  getCartCount,
  getCartTotalQuantityController,
  clearCartController,
  checkout,
} from "../controllers/cartController.js";

const router = express.Router();

// Add item to cart
router.post("/add", addToCart);

// Update item quantity in cart
router.put("/update", updateCartItem);

// Remove item from cart
router.delete("/remove/:productId", removeFromCart);

// View cart (support both authenticated and param-based access)
router.get("/view", viewCart);
router.get("/view/:userId", viewCart);

// Get cart item count (unique products)
router.get("/count", getCartCount);

// Get cart total quantity (sum of all quantities)
router.get("/total-quantity", getCartTotalQuantityController);

// Clear entire cart
router.delete("/clear", clearCartController);

// Checkout
router.post("/checkout", checkout);

// Health check for cart service
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Cart service is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
