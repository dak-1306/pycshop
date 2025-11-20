import OrderModel from "../models/OrderModel.js";
import CartService from "../services/cartService.js";
import ProductService from "../services/productService.js";
import PromotionService from "../services/promotionService.js";

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(`[ORDER_CONTROLLER] createOrder called by userId: ${userId}`);

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
      // Thông tin voucher từ frontend
      voucher,
    } = req.body;

    console.log(`[ORDER_CONTROLLER] Processing order:`, {
      userId,
      itemCount: items?.length || 0,
      total,
      paymentMethod,
      hasVoucher: !!voucher,
      voucherCode: voucher?.code,
      voucherDiscount,
    });

    // Validation cơ bản
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

    // Validate từng item
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

    // Validate voucher nếu có
    let validatedVoucher = null;
    if (voucher && voucher.code) {
      console.log(`[ORDER_CONTROLLER] Validating voucher: ${voucher.code}`);
      const voucherValidation = await PromotionService.validateVoucher(
        voucher.code,
        subtotal
      );

      if (!voucherValidation.success) {
        console.error(
          `[ORDER_CONTROLLER] Failed to validate voucher:`,
          voucherValidation.message
        );
        return res.status(500).json({
          success: false,
          message: "Không thể xác thực mã giảm giá. Vui lòng thử lại sau.",
          error: voucherValidation.error,
        });
      }

      if (!voucherValidation.valid) {
        console.warn(`[ORDER_CONTROLLER] Invalid voucher:`, voucher.code);
        return res.status(400).json({
          success: false,
          message:
            voucherValidation.message ||
            "Mã giảm giá không hợp lệ hoặc đã hết hạn",
        });
      }

      validatedVoucher = voucherValidation.data.voucher;
      console.log(`[ORDER_CONTROLLER] Voucher validated successfully:`, {
        code: validatedVoucher.code,
        discount: validatedVoucher.discountPercent,
        minOrder: validatedVoucher.minOrderValue,
      });
    }

    // Kiểm tra tồn kho trước khi tạo đơn hàng
    console.log(
      `[ORDER_CONTROLLER] Checking inventory availability before creating order`
    );
    const inventoryCheck = await ProductService.checkInventoryAvailability(
      items
    );

    if (!inventoryCheck.success) {
      console.error(
        `[ORDER_CONTROLLER] Failed to check inventory:`,
        inventoryCheck.message
      );
      return res.status(500).json({
        success: false,
        message: "Không thể kiểm tra tồn kho. Vui lòng thử lại sau.",
        error: inventoryCheck.error,
      });
    }

    if (!inventoryCheck.allAvailable) {
      const unavailableItems = inventoryCheck.items.filter(
        (item) => !item.available
      );
      console.warn(
        `[ORDER_CONTROLLER] Some items are not available:`,
        unavailableItems
      );
      return res.status(400).json({
        success: false,
        message: "Một số sản phẩm không đủ hàng hoặc không khả dụng",
        unavailableItems: unavailableItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          reason: item.reason,
          currentStock: item.currentStock,
          requestedQuantity: item.requestedQuantity,
        })),
      });
    }

    console.log(
      `[ORDER_CONTROLLER] All items are available. Proceeding with order creation.`
    );

    // Chuẩn bị dữ liệu cho database
    const orderData = {
      userId: parseInt(userId),
      totalAmount: total,
      paymentMethod: paymentMethod,
      shippingAddress: `${address.name}, ${address.phone}, ${address.street}`,
      items: items.map((item) => ({
        productId: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    console.log(`[ORDER_CONTROLLER] Calling OrderModel.createOrder with:`, {
      userId: orderData.userId,
      totalAmount: orderData.totalAmount,
      itemsCount: orderData.items.length,
    });

    // Tạo đơn hàng
    const result = await OrderModel.createOrder(orderData);

    console.log(`[ORDER_CONTROLLER] Order created successfully:`, result);

    // Cập nhật tồn kho sau khi tạo đơn hàng thành công
    try {
      console.log(
        `[ORDER_CONTROLLER] Updating inventory for order ${result.orderId}`
      );
      const inventoryUpdateResult =
        await ProductService.updateInventoryAfterOrder(
          result.orderId,
          orderData.items
        );

      if (inventoryUpdateResult.success) {
        console.log(
          `[ORDER_CONTROLLER] Successfully updated inventory for order ${result.orderId}`
        );
      } else {
        console.error(
          `[ORDER_CONTROLLER] Failed to update inventory for order ${result.orderId}:`,
          inventoryUpdateResult.message
        );
        // Note: We don't fail the order here as the order was already created successfully
        // In a production system, you might want to implement compensation logic
      }
    } catch (inventoryError) {
      console.error(
        `[ORDER_CONTROLLER] Error updating inventory for order ${result.orderId}:`,
        inventoryError
      );
      // Note: We don't fail the order here as the order was already created successfully
    }

    // Áp dụng voucher sau khi tạo đơn hàng thành công
    if (validatedVoucher) {
      try {
        console.log(
          `[ORDER_CONTROLLER] Applying voucher ${validatedVoucher.code} for order ${result.orderId}`
        );
        const voucherResult = await PromotionService.useVoucher(
          validatedVoucher.id,
          userId,
          result.orderId
        );

        if (voucherResult.success) {
          console.log(
            `[ORDER_CONTROLLER] Successfully applied voucher ${validatedVoucher.code}`
          );
        } else {
          console.error(
            `[ORDER_CONTROLLER] Failed to apply voucher ${validatedVoucher.code}:`,
            voucherResult.message
          );
          // Note: We don't fail the order here as the order was already created successfully
        }
      } catch (voucherError) {
        console.error(
          `[ORDER_CONTROLLER] Error applying voucher:`,
          voucherError
        );
        // Note: We don't fail the order here as the order was already created successfully
      }
    }

    // Clear user's cart after successful order creation
    try {
      console.log(
        `[ORDER_CONTROLLER] Clearing cart for user ${userId} after successful order ${result.orderId}`
      );

      // Option 1: Clear entire cart (recommended for checkout process)
      const cartClearResult = await CartService.clearUserCart(userId);

      // Option 2: Remove only ordered items (alternative approach)
      // const productIds = items.map(item => item.id);
      // const cartClearResult = await CartService.removeItemsFromCart(userId, productIds);

      if (cartClearResult.success) {
        console.log(
          `[ORDER_CONTROLLER] Successfully cleared cart for user ${userId}`
        );
      } else {
        console.warn(
          `[ORDER_CONTROLLER] Failed to clear cart for user ${userId}:`,
          cartClearResult.message
        );
      }
    } catch (cartError) {
      // Don't fail the order if cart clearing fails
      console.error(
        `[ORDER_CONTROLLER] Error clearing cart for user ${userId}:`,
        cartError
      );
    }

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

    console.log(
      `[ORDER_CONTROLLER] Retrieved ${result.orders.length} orders for user ${userId}`
    );
    console.log(`[ORDER_CONTROLLER] Orders:`, result.orders);
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

    const result = await OrderModel.cancelOrder(orderId, userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: result.message,
      data: {
        orderId: result.orderId,
      },
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đơn hàng",
      error: error.message,
    });
  }
};

// Lấy danh sách đơn hàng cho seller
export const getSellerOrders = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // Check if user is seller
    if (userRole !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller role required.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "all";

    console.log(
      `[ORDER_CONTROLLER] Getting seller orders for user ${userId}, page ${page}, status: ${status}`
    );

    const result = await OrderModel.getSellerOrders(
      userId,
      page,
      limit,
      status
    );

    res.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
      message: `Retrieved ${result.orders.length} orders successfully`,
    });
  } catch (error) {
    console.error("[ORDER_CONTROLLER] Error getting seller orders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái đơn hàng (cho seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

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

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Check if user is seller
    if (userRole !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller role required.",
      });
    }

    console.log(
      `[ORDER_CONTROLLER] Updating order ${orderId} status to ${status} by seller ${userId}`
    );

    const result = await OrderModel.updateOrderStatus(orderId, status, userId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: result.message,
      data: {
        orderId: result.orderId,
        oldStatus: result.oldStatus,
        newStatus: result.newStatus,
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
