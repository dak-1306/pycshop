import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

import productRoutes from "./routes/buyer/routeGetProduct.js";
import sellerRoutes from "./routes/seller/SellerRoutes.js";

const app = express();

// CORS configuration with security
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000",
      "http://localhost:5000",
      "http://localhost:5173", // Vite dev server
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

console.log("🔒 [PRODUCT] CORS allowed origins:", allowedOrigins);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" })); // Tăng giới hạn JSON payload
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Tăng giới hạn URL encoded
app.use(morgan("dev"));

// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// Request logging
app.use((req, res, next) => {
  console.log(`📦 [PRODUCT] ${req.method} ${req.originalUrl}`);
  if (req.query && Object.keys(req.query).length > 0) {
    console.log(`📋 [PRODUCT] Query params:`, req.query);
  }
  next();
});

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
  console.log(`📦 Product Service running at http://localhost:${PORT}`);
  console.log(`🔍 Available endpoints:`);
  console.log(`   GET  /health                 - Health check`);
  console.log(`   GET  /categories             - Get all categories`);
  console.log(`   GET  /?page=1&limit=20       - Get products with pagination`);
  console.log(`   GET  /?category=1            - Get products by category`);
  console.log(`   GET  /search?q=keyword       - Search products`);
  console.log(`   GET  /:id                    - Get product by ID`);
  console.log(`🏪 Seller endpoints:`);
  console.log(`   GET  /seller/categories      - Get categories`);
  console.log(`   GET  /seller/products        - Get seller products`);
  console.log(`   POST /seller/products        - Add product`);
  console.log(`   PUT  /seller/products/:id    - Update product`);
  console.log(`   DELETE /seller/products/:id  - Delete product`);
});
