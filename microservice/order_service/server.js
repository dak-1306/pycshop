import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/buyer/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5007;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `[ORDER_SERVICE] ⭐ INCOMING REQUEST: ${req.method} ${
      req.path
    } - ${new Date().toISOString()}`
  );
  console.log(`[ORDER_SERVICE] 📋 Full URL: ${req.originalUrl}`);
  console.log(`[ORDER_SERVICE] 🔑 Headers:`, {
    "x-user-id": req.headers["x-user-id"],
    "x-user-role": req.headers["x-user-role"],
    "content-type": req.headers["content-type"],
    host: req.headers["host"],
  });
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[ORDER_SERVICE] 📦 Body keys:`, Object.keys(req.body));
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Order Service is running",
    service: "order_service",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Test POST endpoint
app.post("/test", (req, res) => {
  console.log(`[ORDER_SERVICE] 🧪 TEST POST received`);
  console.log(`[ORDER_SERVICE] 🧪 Headers:`, req.headers);
  console.log(`[ORDER_SERVICE] 🧪 Body:`, req.body);

  res.json({
    success: true,
    message: "Test POST endpoint working",
    receivedHeaders: req.headers,
    receivedBody: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/orders", orderRoutes);

// Debug route for root path
app.use("/", (req, res, next) => {
  console.log(
    `[ORDER_SERVICE] 🚨 ROOT PATH REQUEST: ${req.method} ${req.path}`
  );
  console.log(`[ORDER_SERVICE] 🚨 Original URL: ${req.originalUrl}`);
  if (req.path === "/" && req.method === "POST") {
    console.log(`[ORDER_SERVICE] 🚨 Redirecting root POST to /orders`);
    // Forward to orders route
    req.url = "/orders";
    return orderRoutes(req, res, next);
  }
  next();
});

// 404 handler
app.use((req, res) => {
  console.log(
    `[ORDER_SERVICE] 404: ${req.method} ${req.originalUrl} not found`
  );
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found in Order Service`,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("[ORDER_SERVICE] Unhandled Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[ORDER_SERVICE] Server running on port ${PORT}`);
  console.log(
    `[ORDER_SERVICE] Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log(
    `[ORDER_SERVICE] Database: ${process.env.DB_NAME}@${process.env.DB_HOST}`
  );
});

export default app;
