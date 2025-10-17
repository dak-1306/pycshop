// Chart utilities for shared configuration and helper functions
export const defaultColors = {
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
};

// Format currency for Vietnamese locale
export const formatCurrency = (value) => {
  if (typeof value !== "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) return value;
    value = numValue;
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Format large numbers with K, M, B suffixes
export const formatLargeNumber = (value) => {
  if (typeof value !== "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) return value;
    value = numValue;
  }

  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Build time series data from raw data
export const buildTimeSeries = (data = [], options = {}) => {
  const {
    xKey = "month",
    yKey = "value",
    parseX = (x) => x,
    parseY = (y) => (typeof y === "number" ? y : Number(y || 0)),
  } = options;

  if (!Array.isArray(data)) {
    return { labels: [], datasets: [] };
  }

  const labels = data.map((item) => parseX(item[xKey]));
  const series = data.map((item) => parseY(item[yKey]));

  return { labels, series };
};

// Build pie chart data
export const buildPieData = (data = [], options = {}) => {
  const { nameKey = "name", valueKey = "value", colorKey = "color" } = options;

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item, index) => ({
    name: item[nameKey] || `Item ${index + 1}`,
    value:
      typeof item[valueKey] === "number"
        ? item[valueKey]
        : Number(item[valueKey] || 0),
    color:
      item[colorKey] ||
      Object.values(defaultColors)[index % Object.values(defaultColors).length],
  }));
};

// Default chart options for Recharts
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  margin: {
    top: 20,
    right: 30,
    left: 20,
    bottom: 5,
  },
};

// Common tooltip styles
export const defaultTooltipStyle = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "0.5rem",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  padding: "12px",
};

// Common grid styles
export const defaultGridStyle = {
  strokeDasharray: "3 3",
  stroke: "#f0f0f0",
};

// Common axis styles
export const defaultAxisStyle = {
  tick: { fontSize: 12 },
  stroke: "#666",
};

// Generate default data for demos
export const generateDefaultData = (type, count = 12) => {
  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  switch (type) {
    case "revenue":
      return months.slice(0, count).map((month) => ({
        month,
        value: Math.floor(Math.random() * 50000000) + 10000000, // 10M - 60M VND
      }));

    case "orders":
      return months.slice(0, count).map((month) => ({
        month,
        value: Math.floor(Math.random() * 1000) + 100, // 100 - 1100 orders
      }));

    case "userAnalytics":
      return [
        { name: "Người mua", value: 65, color: defaultColors.primary },
        { name: "Người bán", value: 25, color: defaultColors.secondary },
        { name: "Admin", value: 10, color: defaultColors.accent },
      ];

    case "category":
      return [
        { category: "Điện tử", sales: 1250, revenue: 2800000000 },
        { category: "Thời trang", sales: 980, revenue: 1900000000 },
        { category: "Gia dụng", sales: 750, revenue: 1200000000 },
        { category: "Sách", sales: 420, revenue: 350000000 },
        { category: "Thể thao", sales: 680, revenue: 950000000 },
      ];

    case "activity":
      return [
        { time: "00:00", users: 120, sessions: 89 },
        { time: "03:00", users: 95, sessions: 62 },
        { time: "06:00", users: 180, sessions: 134 },
        { time: "09:00", users: 380, sessions: 289 },
        { time: "12:00", users: 520, sessions: 412 },
        { time: "15:00", users: 480, sessions: 378 },
        { time: "18:00", users: 640, sessions: 498 },
        { time: "21:00", users: 580, sessions: 445 },
      ];

    default:
      return [];
  }
};

// Validate and normalize chart data
export const normalizeChartData = (data, type) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return generateDefaultData(type);
  }
  return data;
};

// Common chart container styles
export const chartContainerClass =
  "bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300";
export const chartHeaderClass = "flex items-center justify-between mb-4";
export const chartTitleClass = "text-lg font-semibold text-gray-900";
export const chartLegendClass = "flex items-center space-x-4";
export const chartLegendItemClass = "flex items-center space-x-2";
export const chartFooterClass =
  "mt-4 flex items-center justify-between text-xs text-gray-500";
