import express from "express";
import {
  updateInventoryAfterOrder,
  checkInventoryAvailability,
  getInventoryHistory,
  rollbackInventory,
} from "../../controller/buyer/inventoryController.js";

const router = express.Router();

// Update inventory after order (for microservices communication)
router.post("/update-after-order", updateInventoryAfterOrder);

// Check inventory availability before order
router.post("/check-availability", checkInventoryAvailability);

// Get inventory history for a product
router.get("/history/:productId", getInventoryHistory);

// Rollback inventory (for order cancellation)
router.post("/rollback", rollbackInventory);

// Health check for inventory service
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Inventory service is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
