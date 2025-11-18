import express from "express";
import PromotionController from "../controllers/promotionController.js";

const router = express.Router();

// Middleware để parse JSON
router.use(express.json());

// Health check
router.get("/health", PromotionController.healthCheck);

// Public routes (có thể cần auth middleware)
router.get("/available", PromotionController.getAvailableVouchers);
router.post("/validate", PromotionController.validateVoucher);
router.get("/voucher/:code", PromotionController.getVoucherByCode);

// Internal service routes (được gọi từ các service khác)
router.post("/use", PromotionController.useVoucher);

// Admin routes (cần admin auth middleware)
router.post("/admin/create", PromotionController.createVoucher);
router.get("/admin/all", PromotionController.getAllVouchers);

// Error handling middleware
router.use((error, req, res, next) => {
  console.error("[PROMOTION_ROUTES] Error:", error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

export default router;
