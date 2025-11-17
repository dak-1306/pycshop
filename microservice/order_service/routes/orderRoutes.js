import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Middleware để log requests
router.use((req, res, next) => {
  console.log(`[ORDER_ROUTES] ${req.method} ${req.path}`, {
    userId: req.headers["x-user-id"],
    body: req.method !== "GET" ? req.body : undefined,
  });
  next();
});

// Tạo đơn hàng mới
router.post("/", createOrder);

// Lấy danh sách đơn hàng của user
router.get("/", getUserOrders);

// Lấy thông tin chi tiết đơn hàng
router.get("/:orderId", getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:orderId/status", updateOrderStatus);

// Hủy đơn hàng
router.delete("/:orderId", cancelOrder);

// Cập nhật trạng thái thanh toán
router.put("/:orderId/payment", updatePaymentStatus);

export default router;
