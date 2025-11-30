import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import smartDB from "../db/index.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5008;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:3000",
      "http://localhost:8080",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id",
      "x-user-role",
    ],
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/notifications", notificationRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🔔 Notification Service API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "GET /notifications/health",
      notifications: "GET /notifications",
      unreadCount: "GET /notifications/unread-count",
      markAsRead: "PUT /notifications/:id/read",
      markAllAsRead: "PUT /notifications/mark-all-read",
      deleteNotification: "DELETE /notifications/:id",
      createNotification: "POST /notifications/create",
      createOrderNotification: "POST /notifications/order",
    },
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[NOTIFICATION_SERVICE] ❌ Global Error:`, err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Database connection and server start
async function startServer() {
  try {
    // Test database connection
    await smartDB.execute("SELECT 1");

    // Start server
    app.listen(PORT, () => {
      console.log(`[NOTIFICATION_SERVICE] 🔔 Server running`);
      console.log(
        `[NOTIFICATION_SERVICE] 🗄️ Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`
      );
      console.log(
        `[NOTIFICATION_SERVICE] 🌐 Health check: http://localhost:${PORT}/notifications/health`
      );
      console.log(
        `[NOTIFICATION_SERVICE] 🔗 API endpoint: http://localhost:${PORT}/notifications`
      );
    });
  } catch (error) {
    console.error(`[NOTIFICATION_SERVICE] ❌ Failed to start server:`, error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log(
    "[NOTIFICATION_SERVICE] 🛑 SIGTERM received, shutting down gracefully"
  );
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log(
    "[NOTIFICATION_SERVICE] 🛑 SIGINT received, shutting down gracefully"
  );
  process.exit(0);
});

// Start the server
startServer();
