import OrderModel from "../models/OrderModel.js";

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
    } = req.body;

    console.log(`[ORDER_CONTROLLER] Processing order:`, {
      userId,
      itemCount: items?.length || 0,
      total,
      paymentMethod,
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
