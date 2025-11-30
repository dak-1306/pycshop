import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

import productRoutes from "./routes/buyer/routeGetProduct.js";
import sellerRoutes from "./routes/seller/SellerRoutes.js";
import inventoryRoutes from "./routes/buyer/inventoryRoutes.js";

const app = express();

// CORS configuration with security
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173", // Vite dev server
      "http://localhost:5174", // Vite dev server alternate port
      "http://127.0.0.1:5500",
      "http://127.0.0.1:3000",
      "http://localhost:8080",
      "null", // file:// protocol shows as null origin
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn JSON payload
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Tăng giới hạn URL encoded
app.use(morgan("dev"));

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Product Service",
    timestamp: new Date().toISOString(),
  });
});

// Routes - Mount seller routes BEFORE buyer routes to avoid conflicts
app.use("/seller", sellerRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/", productRoutes);

// 404 handler - sử dụng catch-all route thay vì wildcard *
app.use((req, res) => {
  console.log(`❌ [PRODUCT] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: "Product API endpoint not found",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("💥 [PRODUCT] Error:", err);
  res.status(500).json({
    success: false,
    message: "Product service error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`📦 Product Service running`);
});
