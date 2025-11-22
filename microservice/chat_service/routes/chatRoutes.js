import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import ChatController from "../controllers/chatController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Tạo thư mục upload nếu chưa tồn tại
const uploadDir = path.join(__dirname, "../uploads/chat");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer cho upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `chat-${uniqueSuffix}${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Chỉ chấp nhận file ảnh
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

// ==================== ROUTES ====================

// Tạo hội thoại mới
router.post("/conversations", ChatController.createConversation);

// Lấy danh sách hội thoại của user
router.get("/conversations", ChatController.getConversations);

// Lấy tin nhắn trong hội thoại
router.get(
  "/conversations/:conversationId/messages",
  ChatController.getMessages
);

// Gửi tin nhắn text
router.post(
  "/conversations/:conversationId/messages",
  ChatController.sendMessage
);

// Gửi tin nhắn ảnh
router.post(
  "/conversations/:conversationId/messages/image",
  upload.single("image"),
  ChatController.sendImageMessage
);

// Đánh dấu tin nhắn đã đọc
router.put("/conversations/:conversationId/read", ChatController.markAsRead);

// Lấy thống kê chat
router.get("/statistics", ChatController.getStatistics);

// ==================== INTERNAL APIS ====================
// Các API này được gọi từ các service khác (order_service, notification_service)

// Gửi tin nhắn chào mừng khi có đơn hàng mới
router.post("/internal/order-welcome", ChatController.sendOrderWelcomeMessage);

// Gửi tin nhắn cập nhật trạng thái đơn hàng
router.post("/internal/order-status", ChatController.sendOrderStatusMessage);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Chat service is healthy",
    timestamp: new Date().toISOString(),
    service: "chat_service",
    port: process.env.PORT || 5011,
  });
});

// Error handling middleware cho multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: "File upload error: " + error.message,
    });
  }

  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({
      success: false,
      message: "Only image files are allowed",
    });
  }

  next(error);
});

export default router;
