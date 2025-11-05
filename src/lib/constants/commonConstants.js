// Shared constants used by both admin and seller
export const APP_CONFIG = {
  NAME: "PycShop",
  VERSION: "1.0.0",
  DESCRIPTION: "Nền tảng thương mại điện tử",
  SUPPORT_EMAIL: "support@pycshop.com",
};

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const CURRENCY = {
  CODE: "VND",
  SYMBOL: "₫",
  LOCALE: "vi-VN",
};

export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  TIME_ONLY: "HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Order status colors - shared by admin and seller
export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipping: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER_DATA: "user",
  CART_DATA: "cart",
  PREFERENCES: "preferences",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ADMIN_DASHBOARD: "/admin",
  SELLER_DASHBOARD: "/seller",
  BUYER_DASHBOARD: "/buyer",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  USERS: "/users",
  SETTINGS: "/settings",
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// Shared image configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  MAX_COUNT: 10,
  PLACEHOLDER: "/images/placeholder-product.jpg",
};

// Shared payment statuses
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

// Shared shipping methods
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

// Shared pagination defaults
export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 25, 50, 100],
};

// Product constants shared by admin and seller
export const PRODUCT_CATEGORIES_ARRAY = [
  "Điện tử",
  "Thời trang",
  "Gia dụng",
  "Thể thao",
  "Sách & Văn phòng phẩm",
  "Mỹ phẩm",
  "Đồ chơi",
  "Khác",
];

export const PRODUCT_STATUSES_ARRAY = [
  "active",
  "inactive",
  "out_of_stock",
  "discontinued",
];

export const PRODUCT_STATUS_LABELS = {
  active: "Còn hàng",
  inactive: "Ngừng bán",
  out_of_stock: "Hết hàng",
  discontinued: "Ngừng kinh doanh",
};

export const PRICE_RANGES_ARRAY = [
  { label: "Dưới 100,000đ", min: 0, max: 100000 },
  { label: "100,000đ - 500,000đ", min: 100000, max: 500000 },
  { label: "500,000đ - 1,000,000đ", min: 500000, max: 1000000 },
  { label: "1,000,000đ - 5,000,000đ", min: 1000000, max: 5000000 },
  { label: "Trên 5,000,000đ", min: 5000000, max: null },
];
