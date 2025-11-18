import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import promotionRoutes from "./routes/promotionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5009;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[PROMOTION_SERVICE] ${req.method} ${
      req.path
    } - ${new Date().toISOString()}`
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[PROMOTION_SERVICE] Request body:`, req.body);
  }
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Promotion service is running",
    timestamp: new Date().toISOString(),
  });
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const { default: smartDB } = await import("../db/index.js");

    // Test basic query
    await smartDB.execute("SELECT 1");

    // Test voucher table
    const [voucherCount] = await smartDB.executeRead(
      "SELECT COUNT(*) as count FROM phieugiamgia"
    );

    res.json({
      success: true,
      message: "Database connection successful",
      data: {
        totalVouchers: voucherCount[0].count,
        connection: "OK",
      },
    });
  } catch (error) {
    console.error("[PROMOTION_SERVICE] Database test error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/promotions", promotionRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("[PROMOTION_SERVICE] Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
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

// Start server
app.listen(PORT, () => {
  console.log(`[PROMOTION_SERVICE] Server running on port ${PORT}`);
  console.log(
    `[PROMOTION_SERVICE] Environment: ${process.env.NODE_ENV || "development"}`
  );
});

export default app;
