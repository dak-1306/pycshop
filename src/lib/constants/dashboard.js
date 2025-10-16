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
  totalUsers: 1248,
  totalOrders: 856,
  totalProducts: 342,
  totalRevenue: 2845600000,
  todayOrders: 23,
  todayUsers: 67,
  monthlyGrowth: 12.5,
  orderGrowth: 8.3,
};

// Mock recent orders data
export const MOCK_RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    amount: 1250000,
    status: "completed",
    date: "2024-10-01",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    amount: 890000,
    status: "pending",
    date: "2024-10-01",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    amount: 2100000,
    status: "processing",
    date: "2024-09-30",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    amount: 675000,
    status: "completed",
    date: "2024-09-30",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    amount: 1890000,
    status: "cancelled",
    date: "2024-09-29",
  },
];

// Mock recent users data
export const MOCK_RECENT_USERS = [
  {
    id: 1,
    name: "Nguyễn Minh F",
    email: "minhhf@email.com",
    joinDate: "2024-10-01",
    orders: 2,
  },
  {
    id: 2,
    name: "Trần Thị G",
    email: "thig@email.com",
    joinDate: "2024-09-30",
    orders: 0,
  },
  {
    id: 3,
    name: "Lê Văn H",
    email: "vanh@email.com",
    joinDate: "2024-09-30",
    orders: 1,
  },
  {
    id: 4,
    name: "Phạm Thị I",
    email: "thii@email.com",
    joinDate: "2024-09-29",
    orders: 3,
  },
];

// Mock chart data
export const MOCK_CHART_DATA = {
  revenue: [
    { month: "T1", value: 2100000000 },
    { month: "T2", value: 2350000000 },
    { month: "T3", value: 2200000000 },
    { month: "T4", value: 2680000000 },
    { month: "T5", value: 2900000000 },
    { month: "T6", value: 3200000000 },
    { month: "T7", value: 2950000000 },
    { month: "T8", value: 3100000000 },
    { month: "T9", value: 2850000000 },
    { month: "T10", value: 2845600000 },
  ],
  orders: [
    { month: "T1", value: 645 },
    { month: "T2", value: 720 },
    { month: "T3", value: 680 },
    { month: "T4", value: 790 },
    { month: "T5", value: 850 },
    { month: "T6", value: 920 },
    { month: "T7", value: 880 },
    { month: "T8", value: 940 },
    { month: "T9", value: 820 },
    { month: "T10", value: 856 },
  ],  userAnalytics: [
    { name: "Người mua", value: 68, color: "#3b82f6" },
    { name: "Người bán", value: 22, color: "#10b981" },
    { name: "Admin", value: 10, color: "#f59e0b" },
  ],
  userActivity: [
    { time: "00:00", users: 120, sessions: 89 },
    { time: "03:00", users: 95, sessions: 62 },
    { time: "06:00", users: 180, sessions: 134 },
    { time: "09:00", users: 380, sessions: 289 },
    { time: "12:00", users: 520, sessions: 412 },
    { time: "15:00", users: 480, sessions: 378 },
    { time: "18:00", users: 640, sessions: 498 },
    { time: "21:00", users: 580, sessions: 445 },
  ],
  categoryPerformance: [
    { category: "Điện tử", sales: 1250, revenue: 2800000000 },
    { category: "Thời trang", sales: 980, revenue: 1900000000 },
    { category: "Gia dụng", sales: 750, revenue: 1200000000 },
    { category: "Sách", sales: 420, revenue: 350000000 },
    { category: "Thể thao", sales: 680, revenue: 950000000 },
    { category: "Làm đẹp", sales: 890, revenue: 1450000000 },
  ],
};

// Quick actions configuration
export const QUICK_ACTIONS = [
  {
    id: "add-product",
    title: "Thêm sản phẩm",
    icon: "add-product",
    href: "/admin/products/new",
  },
  {
    id: "manage-users",
    title: "Quản lý user",
    icon: "manage-users",
    href: "/admin/users",
  },
  {
    id: "reports",
    title: "Báo cáo",
    icon: "reports",
    href: "/admin/reports",
  },
  {
    id: "settings",
    title: "Cài đặt",
    icon: "settings",
    href: "/admin/settings",
  },
];
