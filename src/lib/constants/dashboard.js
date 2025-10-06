// Dashboard constants
export const DASHBOARD_STATS = {
  ORDERS: "orders",
  REVENUE: "revenue",
  PRODUCTS: "products",
  NEW_CUSTOMERS: "newCustomers",
};

export const DASHBOARD_ORDER_STATUSES = {
  DELIVERED: "delivered",
  SHIPPING: "shipping",
  PENDING: "pending",
  CANCELLED: "cancelled",
};

export const DASHBOARD_ORDER_STATUS_COLORS = {
  delivered: "bg-green-100 text-green-800",
  shipping: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export const CHART_CONFIG = {
  REVENUE_CHART: {
    title: "Biểu đồ doanh thu theo tháng",
    height: "h-64",
  },
  PRODUCT_CHART: {
    title: "Phân tích sản phẩm",
    height: "h-64",
  },
};

// Default stats
export const DEFAULT_STATS = {
  totalUsers: 1248,
  totalOrders: 856,
  totalProducts: 342,
  totalRevenue: 2845600000,
  todayOrders: 23,
  todayUsers: 67,
  monthlyGrowth: 12.5,
  orderGrowth: 8.3,
};

// Mock data for development
export const MOCK_RECENT_ORDERS = [
  {
    id: "ORD-001",
    customerName: "Nguyễn Văn A",
    total: 1500000,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "ORD-002",
    customerName: "Trần Thị B",
    total: 2200000,
    status: "shipping",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_RECENT_USERS = [
  {
    id: 1,
    name: "Lê Văn C",
    email: "levanc@email.com",
    role: "buyer",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    role: "seller",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_CHART_DATA = {
  revenue: [
    { name: "T1", value: 400000000 },
    { name: "T2", value: 300000000 },
    { name: "T3", value: 500000000 },
    { name: "T4", value: 280000000 },
    { name: "T5", value: 590000000 },
    { name: "T6", value: 320000000 },
  ],
  orders: [
    { name: "T1", value: 120 },
    { name: "T2", value: 98 },
    { name: "T3", value: 150 },
    { name: "T4", value: 87 },
    { name: "T5", value: 189 },
    { name: "T6", value: 134 },
  ],
};
