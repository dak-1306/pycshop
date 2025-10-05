import express from "express";
import dotenv from "dotenv";
import shopRoutes from "./routes/shopRoutes.js";
import {
  corsMiddleware,
  requestLogger,
  errorHandler,
} from "./middleware/auth.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.SHOP_SERVICE_PORT || 5003;

// Middleware
app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Shop Service is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Routes
app.use("/api/shops", shopRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint không tồn tại",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🏪 Shop Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/shops`);
});

export default app;
