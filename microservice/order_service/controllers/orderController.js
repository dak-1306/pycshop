import { OrderModel } from "../models/OrderModel.js";
import { ExternalServiceClient } from "../services/externalService.js";

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const {
      items,
      address,
      paymentMethod,
      note,
      subtotal,
      shippingFee,
      voucherDiscount,
      total,
    } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Danh sách sản phẩm không hợp lệ",
      });
    }

    if (!address || !address.name || !address.phone || !address.street) {
      return res.status(400).json({
        success: false,
        message: "Thông tin địa chỉ không đầy đủ",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn phương thức thanh toán",
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tổng giá trị đơn hàng không hợp lệ",
      });
    }

    // Validate items
    for (const item of items) {
      if (
        !item.id ||
        !item.quantity ||
        !item.price ||
        item.quantity <= 0 ||
        item.price <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Thông tin sản phẩm không hợp lệ",
        });
      }
    }

    console.log(`[ORDER_CONTROLLER] Creating order for user ${userId}:`, {
      itemCount: items.length,
      total: total,
      paymentMethod: paymentMethod,
    });

    // Tạo đơn hàng
    const orderData = {
      userId,
      items,
      address,
      paymentMethod,
      note: note || "",
      subtotal: subtotal || 0,
      shippingFee: shippingFee || 0,
      voucherDiscount: voucherDiscount || 0,
      total,
    };

    const result = await OrderModel.createOrder(orderData);

    console.log(`[ORDER_CONTROLLER] Order created successfully:`, result);

    // Post-order processing (async, don't block response)
    setImmediate(async () => {
      try {
        // Clear user's cart
        await ExternalServiceClient.clearUserCart(userId);

        // Send order notification
        await ExternalServiceClient.sendOrderNotification(userId, {
          orderId: result.orderId,
          total: total,
        });

        // Update product inventory
        await ExternalServiceClient.updateProductInventory(items);

        console.log(
          `[ORDER_CONTROLLER] Post-order processing completed for order ${result.orderId}`
        );
      } catch (error) {
        console.error(
          "[ORDER_CONTROLLER] Error in post-order processing:",
          error
        );
        // Don't fail the order if post-processing fails
      }
    });

    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: {
        orderId: result.orderId,
        totalAmount: total,
        paymentMethod: paymentMethod,
      },
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
};

// Lấy thông tin đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.headers["x-user-id"];

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    console.log(
      `[ORDER_CONTROLLER] Getting order ${orderId} for user ${userId}`
    );

    const order = await OrderModel.getOrderById(orderId, userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error getting order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message,
    });
  }
};

// Lấy danh sách đơn hàng của người dùng
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    console.log(
      `[ORDER_CONTROLLER] Getting orders for user ${userId}, page ${page}`
    );

    const result = await OrderModel.getUserOrders(userId, page, limit);

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error getting user orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.headers["x-user-id"];

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID và status là bắt buộc",
      });
    }

    const validStatuses = ["pending", "confirmed", "shipped", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    console.log(
      `[ORDER_CONTROLLER] Updating order ${orderId} status to ${status}`
    );

    const updated = await OrderModel.updateOrderStatus(orderId, status, userId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc không có quyền cập nhật",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      data: {
        orderId: orderId,
        newStatus: status,
      },
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

// Hủy đơn hàng
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    console.log(
      `[ORDER_CONTROLLER] Cancelling order ${orderId} for user ${userId}`
    );

    await OrderModel.cancelOrder(orderId, userId);

    res.json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: {
        orderId: orderId,
        status: "cancelled",
      },
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error cancelling order:", error);

    if (
      error.message.includes("không tồn tại") ||
      error.message.includes("Không thể hủy")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID và payment status là bắt buộc",
      });
    }

    const validPaymentStatuses = ["paid", "unpaid"];
    if (!validPaymentStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thanh toán không hợp lệ",
      });
    }

    console.log(
      `[ORDER_CONTROLLER] Updating payment status for order ${orderId} to ${status}`
    );

    const updated = await OrderModel.updatePaymentStatus(orderId, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: {
        orderId: orderId,
        paymentStatus: status,
      },
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error updating payment status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái thanh toán",
      error: error.message,
    });
  }
};
