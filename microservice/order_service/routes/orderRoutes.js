import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// Middleware để log requests
router.use((req, res, next) => {
  console.log(`[ORDER_ROUTES] ${req.method} ${req.path}`, {
    userId: req.headers["x-user-id"],
    userRole: req.headers["x-user-role"],
    hasBody: req.method !== "GET" && Object.keys(req.body || {}).length > 0,
  });
  next();
});

// Health check (must be before /:orderId)
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Order Service is running",
    service: "order_service",
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint (must be before /:orderId)
router.post("/test", (req, res) => {
  console.log(`[ORDER_ROUTES] 🧪 TEST POST received`);
  console.log(`[ORDER_ROUTES] 🧪 Headers:`, req.headers);
  console.log(`[ORDER_ROUTES] 🧪 Body:`, req.body);

  res.json({
    success: true,
    message: "Test POST endpoint working via routes",
    receivedHeaders: req.headers,
    receivedBody: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Tạo đơn hàng mới
router.post("/", createOrder);

// Lấy danh sách đơn hàng của user
router.get("/", getUserOrders);

// Lấy thông tin chi tiết đơn hàng (must be last)
router.get("/:orderId", getOrderById);

export default router;
