import express from "express";
import NotificationController from "../controllers/NotificationController.js";

const router = express.Router();

// Health check
router.get("/health", NotificationController.healthCheck);

// User notification routes (cần authentication)
router.get("/", NotificationController.getNotifications);
router.get("/unread-count", NotificationController.getUnreadCount);
router.put("/:notificationId/read", NotificationController.markAsRead);
router.put("/mark-all-read", NotificationController.markAllAsRead);
router.delete("/:notificationId", NotificationController.deleteNotification);

// Internal API routes (dành cho các service khác gọi)
router.post("/create", NotificationController.createNotification);
router.post("/order", NotificationController.createOrderNotification);

// Các routes cho payment và report sẽ thêm sau này
// router.post("/payment", NotificationController.createPaymentNotification);
// router.post("/report", NotificationController.createReportNotification);

export default router;
