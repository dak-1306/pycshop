import express from "express";
import sellerAuthMiddleware from "../../middleware/sellerAuthMiddleware.js";
import {
  getShopInfo,
  updateShopInfo,
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

// Shop management routes
router.get("/shop", sellerAuthMiddleware, getShopInfo);
router.put("/shop", sellerAuthMiddleware, updateShopInfo);

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
