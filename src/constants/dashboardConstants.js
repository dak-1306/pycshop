// Dashboard management constants

export const DASHBOARD_STATS = {
  ORDERS: "orders",
  REVENUE: "revenue",
  PRODUCTS: "products",
  NEW_CUSTOMERS: "newCustomers",
};

export const DASHBOARD_ORDER_STATUSES = {
  DELIVERED: "Đã giao",
  SHIPPING: "Đang giao",
  PENDING: "Chờ xác nhận",
  CANCELLED: "Đã hủy",
};

export const DASHBOARD_ORDER_STATUS_COLORS = {
  "Đã giao": "bg-green-100 text-green-800",
  "Đang giao": "bg-blue-100 text-blue-800",
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
  "Đã hủy": "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export const CHART_CONFIG = {
  REVENUE_CHART: {
    title: "Biểu đồ cột doanh thu theo tháng",
    height: "h-64",
  },
  PRODUCT_CHART: {
    title: "Phân tích sản phẩm",
    height: "h-64",
  },
};

// Default stats data structure
export const DEFAULT_STATS = {
  orders: { value: 1254, change: 12.5, isPositive: true },
  revenue: { value: 12450000, change: 8.3, isPositive: true },
  products: { value: 320, change: -2.1, isPositive: false },
  newCustomers: { value: 45, change: 15.7, isPositive: true },
};

// Mock recent orders data
export const MOCK_RECENT_ORDERS = [
  {
    id: "#DH001",
    customer: "Nguyễn Văn A",
    product: "iPhone 15 Pro",
    status: "Đang giao",
    date: "28/09/2024",
  },
  {
    id: "#DH002",
    customer: "Trần Thị B",
    product: "Samsung Galaxy S24",
    status: "Đã giao",
    date: "27/09/2024",
  },
  {
    id: "#DH003",
    customer: "Lê Văn C",
    product: "MacBook Air M2",
    status: "Chờ xác nhận",
    date: "26/09/2024",
  },
  {
    id: "#DH004",
    customer: "Phạm Thị D",
    product: "iPad Pro 11",
    status: "Đã hủy",
    date: "25/09/2024",
  },
  {
    id: "#DH005",
    customer: "Hoàng Văn E",
    product: "AirPods Pro",
    status: "Đã giao",
    date: "24/09/2024",
  },
];
