import express from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  searchProducts,
  getProductReviews,
  getProductRatingStats,
  getSimilarProducts,
  getProductsByShopId,
} from "../../controller/buyer/getProduct.js";

const router = express.Router();

// Get all categories
router.get("/categories", getCategories);

// Search products
router.get("/search", searchProducts);

// Get product reviews by product ID
router.get("/:id/reviews", getProductReviews);

// Get product rating statistics
router.get("/:id/rating-stats", getProductRatingStats);

// Get similar products by product ID
router.get("/:id/similar", getSimilarProducts);

// Get products with pagination and filters
router.get("/", getProducts);

// Get all products by shop ID
router.get("/shop/:shopId", getProductsByShopId);

// Get product by ID (must be after other routes to avoid conflicts)
router.get("/:id", getProductById);

// Get product by ID shop (legacy route)
// router.get("/shop/:shopId/product/:productId", getProductsByShopId);

export default router;
