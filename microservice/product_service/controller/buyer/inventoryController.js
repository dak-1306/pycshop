import InventoryModel from "../../models/buyer/inventoryModel.js";

// Cập nhật tồn kho sau khi đặt hàng (API cho order service)
export const updateInventoryAfterOrder = async (req, res) => {
  try {
    const { orderItems, orderId } = req.body;

    console.log(
      `[INVENTORY_CONTROLLER] Received inventory update request for order ${orderId}:`,
      {
        itemCount: orderItems?.length || 0,
        orderItems: orderItems?.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }
    );

    // Validation
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array",
      });
    }

    // Validate từng item
    for (const item of orderItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must have valid productId and quantity",
        });
      }
    }

    // Kiểm tra tồn kho trước khi cập nhật
    const availabilityCheck = await InventoryModel.checkInventoryAvailability(
      orderItems
    );

    if (!availabilityCheck.allAvailable) {
      const unavailableItems = availabilityCheck.results.filter(
        (item) => !item.available
      );
      return res.status(400).json({
        success: false,
        message: "Some items are not available",
        unavailableItems: unavailableItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          reason: item.reason,
          currentStock: item.currentStock,
          requestedQuantity: item.requestedQuantity,
        })),
      });
    }

    // Cập nhật tồn kho
    const result = await InventoryModel.updateInventoryAfterOrder(orderItems);

    console.log(
      `[INVENTORY_CONTROLLER] Successfully updated inventory for order ${orderId}`
    );

    res.json({
      success: true,
      message: "Inventory updated successfully",
      data: {
        orderId,
        updatedItems: result.updates.length,
        updates: result.updates,
      },
    });
  } catch (error) {
    console.error("[INVENTORY_CONTROLLER] Error updating inventory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update inventory",
      error: error.message,
    });
  }
};

// Kiểm tra tính khả dụng của tồn kho
export const checkInventoryAvailability = async (req, res) => {
  try {
    const { items } = req.body;

    console.log(
      `[INVENTORY_CONTROLLER] Checking inventory availability for ${
        items?.length || 0
      } items`
    );

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required and must be an array",
      });
    }

    const result = await InventoryModel.checkInventoryAvailability(items);

    res.json({
      success: true,
      data: {
        allAvailable: result.allAvailable,
        items: result.results,
      },
    });
  } catch (error) {
    console.error(
      "[INVENTORY_CONTROLLER] Error checking inventory availability:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to check inventory availability",
      error: error.message,
    });
  }
};

// Lấy lịch sử thay đổi tồn kho của sản phẩm
export const getInventoryHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log(
      `[INVENTORY_CONTROLLER] Getting inventory history for product ${productId}`
    );

    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    const result = await InventoryModel.getInventoryHistory(
      parseInt(productId),
      parseInt(page),
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(
      "[INVENTORY_CONTROLLER] Error getting inventory history:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to get inventory history",
      error: error.message,
    });
  }
};

// Rollback tồn kho (cho trường hợp hủy đơn hàng)
export const rollbackInventory = async (req, res) => {
  try {
    const { orderItems, orderId, reason } = req.body;

    console.log(
      `[INVENTORY_CONTROLLER] Rolling back inventory for order ${orderId}, reason: ${reason}`
    );

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required for rollback",
      });
    }

    const result = await InventoryModel.rollbackInventory(orderItems);

    console.log(
      `[INVENTORY_CONTROLLER] Successfully rolled back inventory for order ${orderId}`
    );

    res.json({
      success: true,
      message: "Inventory rollback completed",
      data: {
        orderId,
        reason,
        rolledBackItems: orderItems.length,
      },
    });
  } catch (error) {
    console.error(
      "[INVENTORY_CONTROLLER] Error rolling back inventory:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to rollback inventory",
      error: error.message,
    });
  }
};
