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
  ],
};

// Quick actions configuration
export const QUICK_ACTIONS = [
  {
    id: "add-product",
    title: "Thêm sản phẩm",
    icon: (
      <svg
        className="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    href: "/admin/products/new",
  },
  {
    id: "manage-users",
    title: "Quản lý user",
    icon: (
      <svg
        className="w-6 h-6 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
    href: "/admin/users",
  },
  {
    id: "reports",
    title: "Báo cáo",
    icon: (
      <svg
        className="w-6 h-6 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
        />
      </svg>
    ),
    href: "/admin/reports",
  },
  {
    id: "settings",
    title: "Cài đặt",
    icon: (
      <svg
        className="w-6 h-6 text-orange-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    href: "/admin/settings",
  },
];
