import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(
    `[ORDER_SERVICE] ${req.method} ${req.path} - ${new Date().toISOString()}`
  );
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Order service is running",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/orders", orderRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("[ORDER_SERVICE] Error:", error);
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
  console.log(`[ORDER_SERVICE] Server running on port ${PORT}`);
  console.log(
    `[ORDER_SERVICE] Environment: ${process.env.NODE_ENV || "development"}`
  );
});

export default app;
