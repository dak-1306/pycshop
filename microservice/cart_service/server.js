import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./routes/cartRoutes.js";
import { startKafkaConsumer } from "./services/kafkaConsumer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/cart", cartRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Cart Service",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Cart Service Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Start server and Kafka consumer
const startServer = async () => {
  try {
    // Start Kafka consumer for cart synchronization
    console.log("[CART_SERVICE] Starting Kafka consumer...");
    await startKafkaConsumer();
    console.log("[CART_SERVICE] Kafka consumer started successfully");

    app.listen(PORT, () => {
      console.log(`[CART_SERVICE] Server running on port ${PORT}`);
      console.log(
        `[CART_SERVICE] Health check: http://localhost:${PORT}/health`
      );
    });
  } catch (error) {
    console.error("[CART_SERVICE] Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
