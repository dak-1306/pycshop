// Chart constants for dashboard components
export const CHART_COLORS = {
  primary: "#3b82f6", // blue-500
  secondary: "#10b981", // emerald-500
  accent: "#f59e0b", // amber-500
  purple: "#8b5cf6", // violet-500
  orange: "#f97316", // orange-500
  red: "#ef4444", // red-500
  indigo: "#6366f1", // indigo-500
  pink: "#ec4899", // pink-500
  teal: "#14b8a6", // teal-500

  // Semantic colors
  revenue: "#2563eb", // blue-600
  orders: "#10b981", // emerald-500
  users: "#f59e0b", // amber-500
  activity: "#7c3aed", // violet-600
  category: "#ef4444", // red-500
  products: "#06b6d4", // cyan-500

  // Role-specific color schemes
  admin: {
    primary: "#dc2626", // red-600 - Admin theme
    secondary: "#7c3aed", // violet-600
    accent: "#059669", // emerald-600
    revenue: "#dc2626", // red-600
    orders: "#7c3aed", // violet-600
    users: "#f59e0b", // amber-500
    products: "#06b6d4", // cyan-500
  },
  seller: {
    primary: "#2563eb", // blue-600 - Seller theme
    secondary: "#10b981", // emerald-500
    accent: "#f59e0b", // amber-500
    revenue: "#2563eb", // blue-600
    orders: "#10b981", // emerald-500
    products: "#8b5cf6", // violet-500
    performance: "#06b6d4", // cyan-500
  },
};

// Chart theme configurations
export const CHART_THEMES = {
  light: {
    backgroundColor: "#ffffff",
    textColor: "#374151",
    gridColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  dark: {
    backgroundColor: "#1f2937",
    textColor: "#f9fafb",
    gridColor: "#374151",
    borderColor: "#4b5563",
  },
};

// Default chart options
export const DEFAULT_CHART_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "start",
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      cornerRadius: 6,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
};

// Dashboard Chart Configurations
export const DASHBOARD_CHART_CONFIGS = {
  admin: [
    {
      id: "systemRevenue",
      type: "revenue",
      dataKey: "revenue",
      title: "Doanh thu hệ thống",
      subtitle: "Tổng doanh thu từ tất cả cửa hàng",
      permissions: ["admin"],
      containerClass: "col-span-1 md:col-span-2 lg:col-span-2",
      gridSize: "large",
      chartOptions: {
        color: CHART_COLORS.admin.revenue,
        height: 350,
        showTrend: true,
        showComparison: true,
      },
    },
    {
      id: "userAnalytics",
      type: "userAnalytics",
      dataKey: "users",
      title: "Phân tích người dùng",
      subtitle: "Phân bố users, sellers, admins",
      permissions: ["admin"],
      containerClass: "col-span-1 md:col-span-1 lg:col-span-1",
      gridSize: "medium",
      chartOptions: {
        showLegend: true,
        showPercentage: true,
        height: 350,
        colors: [
          CHART_COLORS.admin.users,
          CHART_COLORS.admin.secondary,
          CHART_COLORS.admin.accent,
        ],
      },
    },
    {
      id: "orderTrends",
      type: "orders",
      dataKey: "orders",
      title: "Xu hướng đơn hàng",
      subtitle: "Đơn hàng theo thời gian",
      permissions: ["admin"],
      containerClass: "col-span-1 md:col-span-2 lg:col-span-3",
      gridSize: "full-width",
      chartOptions: {
        color: CHART_COLORS.admin.orders,
        showDataLabels: true,
        height: 320,
      },
    },
  ],

  seller: [
    {
      id: "shopRevenue",
      type: "revenue",
      dataKey: "revenue",
      title: "Doanh thu cửa hàng",
      subtitle: "Doanh thu của cửa hàng bạn",
      permissions: ["seller"],
      containerClass: "col-span-2",
      gridSize: "large",
      chartOptions: {
        color: CHART_COLORS.seller.revenue,
        height: 280,
        showGoal: true,
      },
    },
    {
      id: "shopOrders",
      type: "orders",
      dataKey: "orders",
      title: "Đơn hàng",
      subtitle: "Xu hướng đơn hàng theo tháng",
      permissions: ["seller"],
      containerClass: "col-span-2",
      gridSize: "large",
      chartOptions: {
        color: CHART_COLORS.seller.orders,
        height: 280,
      },
    },
  ],
};

// Chart types
export const CHART_TYPES = {
  LINE: "line",
  BAR: "bar",
  PIE: "pie",
  DOUGHNUT: "doughnut",
  AREA: "area",
};

// Chart size presets
export const CHART_SIZES = {
  SMALL: { width: 300, height: 200 },
  MEDIUM: { width: 500, height: 320 },
  LARGE: { width: 800, height: 400 },
  FULL: { width: "100%", height: 400 },
};
