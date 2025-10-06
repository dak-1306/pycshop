// Order constants
export const ORDER_STATUSES = {
  ALL: "all",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PENDING]: "Chờ xác nhận",
  [ORDER_STATUSES.CONFIRMED]: "Đã xác nhận",
  [ORDER_STATUSES.SHIPPING]: "Đang giao",
  [ORDER_STATUSES.DELIVERED]: "Đã giao",
  [ORDER_STATUSES.CANCELLED]: "Đã hủy",
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
  [ORDER_STATUSES.CONFIRMED]: "bg-blue-100 text-blue-800",
  [ORDER_STATUSES.SHIPPING]: "bg-purple-100 text-purple-800",
  [ORDER_STATUSES.DELIVERED]: "bg-green-100 text-green-800",
  [ORDER_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
};

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUSES.PENDING]: "Chờ thanh toán",
  [PAYMENT_STATUSES.PAID]: "Đã thanh toán",
  [PAYMENT_STATUSES.FAILED]: "Thanh toán thất bại",
  [PAYMENT_STATUSES.REFUNDED]: "Đã hoàn tiền",
};

export const SHIPPING_METHODS = {
  STANDARD: "standard",
  EXPRESS: "express",
  OVERNIGHT: "overnight",
};

export const SHIPPING_METHOD_LABELS = {
  [SHIPPING_METHODS.STANDARD]: "Giao hàng tiêu chuẩn",
  [SHIPPING_METHODS.EXPRESS]: "Giao hàng nhanh",
  [SHIPPING_METHODS.OVERNIGHT]: "Giao hàng trong ngày",
};

export const ORDER_FILTERS = [
  { key: ORDER_STATUSES.ALL, label: "Tất cả" },
  {
    key: ORDER_STATUSES.PENDING,
    label: ORDER_STATUS_LABELS[ORDER_STATUSES.PENDING],
  },
  {
    key: ORDER_STATUSES.CONFIRMED,
    label: ORDER_STATUS_LABELS[ORDER_STATUSES.CONFIRMED],
  },
  {
    key: ORDER_STATUSES.SHIPPING,
    label: ORDER_STATUS_LABELS[ORDER_STATUSES.SHIPPING],
  },
  {
    key: ORDER_STATUSES.DELIVERED,
    label: ORDER_STATUS_LABELS[ORDER_STATUSES.DELIVERED],
  },
  {
    key: ORDER_STATUSES.CANCELLED,
    label: ORDER_STATUS_LABELS[ORDER_STATUSES.CANCELLED],
  },
];
