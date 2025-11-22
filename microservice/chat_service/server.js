import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chatRoutes.js";
import SocketHandler from "./handlers/socketHandler.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5011;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000", // API Gateway
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-role"],
  credentials: true,
};

// Socket.IO setup
const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

// Initialize Socket Handler
const socketHandler = new SocketHandler(io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Store io instance and socketHandler in app for use in routes
app.set("io", io);
app.set("socketHandler", socketHandler);

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `[CHAT_SERVICE] ${req.method} ${
      req.originalUrl
    } - ${new Date().toISOString()}`
  );
  console.log(`[CHAT_SERVICE] Headers:`, {
    "x-user-id": req.headers["x-user-id"],
    "x-user-role": req.headers["x-user-role"],
    "content-type": req.headers["content-type"],
  });
  next();
});

// API Routes
app.use("/api/chat", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Chat Service is running",
    service: "chat_service",
    port: PORT,
    timestamp: new Date().toISOString(),
    onlineUsers: socketHandler.getOnlineUsersCount(),
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("[CHAT_SERVICE] Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Chat Service - Route not found",
    requestedUrl: req.originalUrl,
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`[CHAT_SERVICE] Server running on port ${PORT}`);
  console.log(
    `[CHAT_SERVICE] Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log(
    `[CHAT_SERVICE] Socket.IO initialized with CORS origins:`,
    corsOptions.origin
  );
});

export default app;
