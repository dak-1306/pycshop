import express from "express";
import sellerAuthMiddleware from "../../middleware/sellerAuthMiddleware.js";
import {
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getCategories,
  addStock,
  getStockHistory,
} from "../../controller/seller/sellerController.js";

const router = express.Router();

// Product management routes (require seller role)
router.get("/products", sellerAuthMiddleware, getSellerProducts);
router.post("/products", sellerAuthMiddleware, addProduct);
router.get("/products/:id", sellerAuthMiddleware, getProductById);
router.put("/products/:id", sellerAuthMiddleware, updateProduct);
router.delete("/products/:id", sellerAuthMiddleware, deleteProduct);

// Stock management routes
router.post("/products/:id/stock", sellerAuthMiddleware, (req, res, next) => {
  console.log(
    `🔄 [SELLER_ROUTES] Handling POST /products/${req.params.id}/stock`
  );
  console.log(`🔄 [SELLER_ROUTES] Request body:`, req.body);
  console.log(`🔄 [SELLER_ROUTES] Request params:`, req.params);
  addStock(req, res, next);
});
router.get(
  "/products/:id/stock-history",
  sellerAuthMiddleware,
  getStockHistory
);

// Categories for product creation
router.get("/categories", sellerAuthMiddleware, getCategories);

export default router;
