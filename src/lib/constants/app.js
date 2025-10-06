// Application constants
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

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  TIME_ONLY: "HH:mm",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

export const CURRENCY = {
  CODE: "VND",
  SYMBOL: "₫",
  LOCALE: "vi-VN",
};

export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
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
