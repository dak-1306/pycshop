import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
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
  // Image management functions
  uploadProductImages,
  getProductImages,
  deleteProductImage,
  // Order management functions
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from "../../controller/seller/sellerController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Cấu hình multer để xử lý upload file
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 15, // Max 15 files
    fieldSize: 2 * 1024 * 1024, // 2MB for field values (for imageOrder array)
    fieldNameSize: 100, // 100 bytes for field names
    fields: 50, // Max number of non-file fields
  },
});

// Product management routes (require seller role)
router.get("/products", sellerAuthMiddleware, getSellerProducts);
router.post("/products", sellerAuthMiddleware, addProduct);
router.get("/products/:id", sellerAuthMiddleware, getProductById);
router.put(
  "/products/:id",
  sellerAuthMiddleware,
  upload.array("newImages", 15),
  updateProduct
);
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

// Image management routes - chỉ giữ endpoint cần thiết
router.get("/products/:id/images", sellerAuthMiddleware, getProductImages);
router.post(
  "/products/:productId/upload-images",
  sellerAuthMiddleware,
  upload.array("images", 15),
  uploadProductImages
);
router.delete(
  "/products/:id/images/:imageId",
  sellerAuthMiddleware,
  deleteProductImage
);

// Route để serve static files (ảnh)
router.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

// Categories for product creation
router.get("/categories", sellerAuthMiddleware, getCategories);

// Order management routes (require seller role) - Temporarily bypassed for testing
router.get(
  "/orders",
  (req, res, next) => {
    req.user = { id: 1, role: "seller" };
    next();
  },
  getSellerOrders
);
router.get("/orders/stats", sellerAuthMiddleware, getOrderStats);
router.get("/orders/:id", sellerAuthMiddleware, getOrderById);
router.put("/orders/:id/status", sellerAuthMiddleware, updateOrderStatus);

export default router;
