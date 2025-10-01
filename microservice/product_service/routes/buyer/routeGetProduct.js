import express from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  searchProducts,
} from "../../controller/buyer/getProduct.js";

const router = express.Router();

// Get all categories
router.get("/categories", getCategories);

// Search products
router.get("/search", searchProducts);

// Get products with pagination and filters
router.get("/", getProducts);

// Get product by ID (must be after other routes to avoid conflicts)
router.get("/:id", getProductById);

export default router;
