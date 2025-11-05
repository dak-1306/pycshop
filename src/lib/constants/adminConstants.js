// Admin login constants
export const ADMIN_CONSTANTS = {
  // Demo credentials
  DEMO_CREDENTIALS: {
    email: "admin@pycshop.com",
    password: "admin123",
  },

  // Error messages
  ERROR_MESSAGES: {
    NO_PERMISSION:
      "Tài khoản hiện tại không có quyền truy cập admin. Vui lòng đăng nhập với tài khoản admin.",
    LOGIN_FAILED: "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.",
    LOADING: "Đang xác thực...",
    API_CONNECTION_ERROR: "Lỗi kết nối API",
    API_CONNECTION_MESSAGE:
      "Không thể kết nối đến server. Hiển thị dữ liệu mặc định.",
    LOADING_DATA: "Đang tải dữ liệu...",
    LOADING_ERROR: "Lỗi khi tải dữ liệu",
    SYSTEM_USING_SAMPLE_DATA: "Hệ thống đang sử dụng dữ liệu mẫu để hiển thị.",
    RETRY_ACTION: "Thử lại",
    REFRESH_DATA: "Làm mới dữ liệu",
    EXPORT_LIST: "Xuất danh sách",
  },

  // Routes
  ROUTES: {
    ADMIN_DASHBOARD: "/admin",
    CUSTOMER_LOGIN: "/login",
    HOME: "/",
  },

  // Query parameters
  QUERY_PARAMS: {
    NO_PERMISSION: "no_permission",
  },

  // Page Titles and Descriptions
  PAGES: {
    DASHBOARD: {
      TITLE: "📊 Dashboard",
      SUBTITLE: "Tổng quan hệ thống",
      LOADING: "Đang tải dashboard...",
    },
    USERS: {
      TITLE: "👥 Quản lý người dùng",
      SUBTITLE: "Quản lý tất cả người dùng trong hệ thống",
      LOADING: "Đang tải dữ liệu người dùng...",
      ERROR_TITLE: "Lỗi khi tải dữ liệu người dùng",
    },
    ORDERS: {
      TITLE: "📋 Quản lý đơn hàng",
      SUBTITLE: "Quản lý tất cả đơn hàng trong hệ thống",
      LOADING: "Đang tải dữ liệu đơn hàng...",
    },
    PRODUCTS: {
      TITLE: "📦 Quản lý sản phẩm",
      SUBTITLE: "Quản lý tất cả sản phẩm trong hệ thống",
      LOADING: "Đang tải dữ liệu sản phẩm...",
    },
    SELLERS: {
      TITLE: "🏪 Quản lý người bán",
      SUBTITLE: "Quản lý tất cả người bán trong hệ thống",
      LOADING: "Đang tải dữ liệu người bán...",
    },
    REPORTS: {
      TITLE: "📊 Báo cáo & Phân tích",
      SUBTITLE: "Tổng quan hệ thống",
      LOADING: "Đang tải báo cáo...",
    },
    SETTINGS: {
      TITLE: "⚙️ Cài đặt hệ thống",
      SUBTITLE: "Quản lý cấu hình và tùy chọn hệ thống",
    },
  },

  // User Management Messages
  USER_MESSAGES: {
    CREATE_SUCCESS: "đã được tạo thành công!",
    CREATE_ERROR: "Có lỗi xảy ra khi tạo người dùng",
    CREATE_ERROR_EMAIL_EXISTS:
      "Email này đã được sử dụng. Vui lòng chọn email khác",
    CREATE_ERROR_GENERIC: "Không thể tạo người dùng. Vui lòng thử lại",

    DELETE_SUCCESS: "đã được xóa thành công!",
    DELETE_ERROR: "Có lỗi xảy ra khi xóa người dùng",
    DELETE_ERROR_CONSTRAINT:
      "Không thể xóa người dùng này vì có dữ liệu liên quan",
    DELETE_ERROR_GENERIC: "Không thể xóa người dùng. Vui lòng thử lại",

    UPDATE_SUCCESS: "đã được cập nhật thành công!",
    UPDATE_ERROR: "Có lỗi xảy ra khi cập nhật người dùng",
    UPDATE_ERROR_GENERIC: "Không thể cập nhật người dùng. Vui lòng thử lại",
  },

  // Order Status Colors
  ORDER_STATUS_COLORS: {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  },

  // Modal Titles
  MODAL_TITLES: {
    DELETE_USER: "Xác nhận xóa người dùng",
    DELETE_ORDER: "Xác nhận xóa đơn hàng",
    DELETE_PRODUCT: "Xác nhận xóa sản phẩm",
    DELETE_SELLER: "Xác nhận xóa người bán",
    DELETE_SUBTITLE: "Hành động này không thể hoàn tác",
    DELETE_SELLER_SUBTITLE:
      "Hành động này sẽ xóa vĩnh viễn tài khoản seller và toàn bộ dữ liệu liên quan",
  },

  // Item Types for Delete Modal
  ITEM_TYPES: {
    USER: "người dùng",
    ORDER: "đơn hàng",
    PRODUCT: "sản phẩm",
    SELLER: "người bán",
  },

  // Settings Page
  SETTINGS: {
    THEME_SECTION: {
      TITLE: "🎨 Giao diện",
      SUBTITLE: "Tùy chỉnh giao diện hiển thị",
      LIGHT_DESC: "Giao diện sáng phù hợp cho môi trường làm việc ban ngày",
      DARK_DESC: "Giao diện tối giúp giảm căng thẳng mắt khi làm việc ban đêm",
    },
    LANGUAGE_SECTION: {
      TITLE: "🌐 Ngôn ngữ",
      SUBTITLE: "Chọn ngôn ngữ hiển thị",
      VI_DESC: "Sử dụng tiếng Việt làm ngôn ngữ chính",
      EN_DESC: "Use English as the primary language",
    },
    CURRENT_SETTINGS: {
      TITLE: "📋 Cài đặt hiện tại",
      THEME_LABEL: "Giao diện:",
      LANGUAGE_LABEL: "Ngôn ngữ:",
    },
  },

  // Fallback Data
  FALLBACK_STATS: {
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    activeUsers: 0,
    pendingOrders: 0,
  },

  // UI Text
  UI_TEXT: {
    TITLE: "Admin Panel",
    SUBTITLE: "Đăng nhập vào hệ thống quản trị PycShop",
    EMAIL_LABEL: "Email Admin",
    PASSWORD_LABEL: "Mật khẩu Admin",
    EMAIL_PLACEHOLDER: "admin@pycshop.com",
    PASSWORD_PLACEHOLDER: "Nhập mật khẩu admin",
    SUBMIT_BUTTON: "Đăng nhập Admin",
    LOADING_BUTTON: "Đang xác thực...",
    DEMO_INFO_TITLE: "Thông tin đăng nhập:",
    DEMO_INFO_TEXT: [
      "• Sử dụng tài khoản admin đã tạo trong database",
      "• Hoặc dùng endpoint /auth/register-admin để tạo admin mới",
      "• Demo: admin@pycshop.com / admin123",
    ],
    DEMO_BUTTON: "Điền thông tin demo",
    CUSTOMER_LOGIN_LINK: "Đăng nhập khách hàng",
    HOME_LINK: "Về trang chủ",
    SECURITY_NOTICE: "Trang này chỉ dành cho quản trị viên hệ thống",
    WARNING_ICON: "⚠️",
  },

  // Dashboard constants
  DASHBOARD: {
    MOCK_RECENT_ORDERS: [
      {
        id: 1,
        customerName: "Nguyễn Văn A",
        totalAmount: 500000,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        customerName: "Trần Thị B",
        totalAmount: 750000,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ],
    MOCK_RECENT_USERS: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        role: "buyer",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ],
    MOCK_CHART_DATA: {
      revenue: [
        { month: "Jan", value: 4000 },
        { month: "Feb", value: 3000 },
        { month: "Mar", value: 5000 },
      ],
      orders: [
        { month: "Jan", value: 40 },
        { month: "Feb", value: 30 },
        { month: "Mar", value: 50 },
      ],
    },
    ORDER_STATUS_COLORS: {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    },
    DEFAULT_STATS: {
      todayOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      todayUsers: 0,
    },
  },
};

// Consolidated admin-specific constants from other files

// User constants for admin
export const ADMIN_USER_ROLES = {
  ADMIN: "admin",
  SELLER: "seller",
  BUYER: "buyer",
};

export const ADMIN_USER_ROLE_LABELS = {
  [ADMIN_USER_ROLES.ADMIN]: "Quản trị viên",
  [ADMIN_USER_ROLES.SELLER]: "Người bán",
  [ADMIN_USER_ROLES.BUYER]: "Khách hàng",
};

export const ADMIN_USER_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  BANNED: "banned",
  PENDING: "pending",
};

export const ADMIN_USER_STATUS_LABELS = {
  [ADMIN_USER_STATUSES.ACTIVE]: "Hoạt động",
  [ADMIN_USER_STATUSES.INACTIVE]: "Không hoạt động",
  [ADMIN_USER_STATUSES.BANNED]: "Bị khóa",
  [ADMIN_USER_STATUSES.PENDING]: "Chờ xác thực",
};

export const ADMIN_USER_STATUS_COLORS = {
  [ADMIN_USER_STATUSES.ACTIVE]: "bg-green-100 text-green-800",
  [ADMIN_USER_STATUSES.INACTIVE]: "bg-yellow-100 text-yellow-800",
  [ADMIN_USER_STATUSES.BANNED]: "bg-red-100 text-red-800",
  [ADMIN_USER_STATUSES.PENDING]: "bg-blue-100 text-blue-800",
};

export const ADMIN_USER_ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-800",
  seller: "bg-blue-100 text-blue-800",
  customer: "bg-gray-100 text-gray-800",
  default: "bg-gray-100 text-gray-800",
};

// Product constants for admin
export const ADMIN_PRODUCT_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DRAFT: "draft",
  OUT_OF_STOCK: "out_of_stock",
};

export const ADMIN_PRODUCT_STATUS_LABELS = {
  [ADMIN_PRODUCT_STATUSES.ACTIVE]: "Đang bán",
  [ADMIN_PRODUCT_STATUSES.INACTIVE]: "Ngừng bán",
  [ADMIN_PRODUCT_STATUSES.DRAFT]: "Bản nháp",
  [ADMIN_PRODUCT_STATUSES.OUT_OF_STOCK]: "Hết hàng",
};

export const ADMIN_PRODUCT_STATUS_COLORS = {
  [ADMIN_PRODUCT_STATUSES.ACTIVE]: "bg-green-100 text-green-800",
  [ADMIN_PRODUCT_STATUSES.INACTIVE]: "bg-red-100 text-red-800",
  [ADMIN_PRODUCT_STATUSES.DRAFT]: "bg-yellow-100 text-yellow-800",
  [ADMIN_PRODUCT_STATUSES.OUT_OF_STOCK]: "bg-gray-100 text-gray-800",
};

export const ADMIN_PRODUCT_CATEGORIES = [
  { id: "electronics", name: "Điện tử", slug: "dien-tu" },
  { id: "fashion", name: "Thời trang", slug: "thoi-trang" },
  { id: "home", name: "Nhà cửa & Đời sống", slug: "nha-cua-doi-song" },
  { id: "sports", name: "Thể thao & Du lịch", slug: "the-thao-du-lich" },
  { id: "beauty", name: "Làm đẹp", slug: "lam-dep" },
  { id: "books", name: "Sách", slug: "sach" },
  { id: "toys", name: "Đồ chơi", slug: "do-choi" },
];

// Order constants for admin
export const ADMIN_ORDER_STATUSES = {
  ALL: "all",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ADMIN_ORDER_STATUS_LABELS = {
  [ADMIN_ORDER_STATUSES.PENDING]: "Chờ xác nhận",
  [ADMIN_ORDER_STATUSES.CONFIRMED]: "Đã xác nhận",
  [ADMIN_ORDER_STATUSES.SHIPPING]: "Đang giao",
  [ADMIN_ORDER_STATUSES.DELIVERED]: "Đã giao",
  [ADMIN_ORDER_STATUSES.CANCELLED]: "Đã hủy",
};

export const ADMIN_ORDER_STATUS_COLORS = {
  [ADMIN_ORDER_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
  [ADMIN_ORDER_STATUSES.CONFIRMED]: "bg-blue-100 text-blue-800",
  [ADMIN_ORDER_STATUSES.SHIPPING]: "bg-purple-100 text-purple-800",
  [ADMIN_ORDER_STATUSES.DELIVERED]: "bg-green-100 text-green-800",
  [ADMIN_ORDER_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
};

// Dashboard constants for admin
export const ADMIN_DASHBOARD_STATS = {
  ORDERS: "orders",
  REVENUE: "revenue",
  PRODUCTS: "products",
  NEW_CUSTOMERS: "newCustomers",
};

export const ADMIN_DEFAULT_STATS = {
  totalUsers: 1248,
  totalOrders: 856,
  totalProducts: 342,
  totalRevenue: 2845600000,
  todayOrders: 23,
  todayUsers: 67,
  monthlyGrowth: 12.5,
  orderGrowth: 8.3,
};

// Mock data for admin
export const ADMIN_MOCK_RECENT_ORDERS = [
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
];

export const ADMIN_MOCK_RECENT_USERS = [
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
];

// Pagination config for admin
export const ADMIN_PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  PAGE_SIZES: [10, 25, 50, 100],
  itemsPerPage: 10,
  maxVisiblePages: 5,
};

// Chart configuration for admin
export const ADMIN_CHART_CONFIG = {
  REVENUE_CHART: {
    title: "Biểu đồ cột doanh thu theo tháng",
    height: "h-64",
  },
  PRODUCT_CHART: {
    title: "Phân tích sản phẩm",
    height: "h-64",
  },
};

// Admin validation rules
export const ADMIN_VALIDATION_RULES = {
  email: [
    (value) => (!value ? "Email không được để trống" : null),
    (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : "Email không hợp lệ";
    },
  ],
  password: [
    (value) => (!value ? "Mật khẩu không được để trống" : null),
    (value) => {
      if (!value) return null;
      return value.length >= 6 ? null : "Mật khẩu phải có ít nhất 6 ký tự";
    },
  ],
};

// Mock data for admin development
export const ADMIN_MOCK_ORDERS = [
  {
    id: 1,
    productName: "iPhone 14 Pro",
    price: 25990000,
    quantity: 2,
    category: "Điện thoại",
    status: "Hoàn tất",
    createdDate: "2024-10-01",
    seller: "Apple Store",
  },
  {
    id: 2,
    productName: "MacBook Air M2",
    price: 28990000,
    quantity: 1,
    category: "Laptop",
    status: "Đang giao",
    createdDate: "2024-09-30",
    seller: "Computer World",
  },
];

export const ADMIN_DEFAULT_ORDER_STATS = {
  totalOrders: 856,
  pendingOrders: 23,
  completedOrders: 789,
  totalRevenue: 285460000,
};

// User stats and colors for admin
export const ADMIN_DEFAULT_USER_STATS = {
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  bannedUsers: 0,
  newUsersToday: 0,
  pendingUsers: 0,
};

// Mock products for admin
export const ADMIN_MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    original_price: 32990000,
    stock_quantity: 50,
    category: "Điện tử",
    status: "active",
    average_rating: 4.8,
    seller: "Apple Store",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    price: 24990000,
    original_price: 27990000,
    stock_quantity: 30,
    category: "Điện tử",
    status: "active",
    average_rating: 4.6,
    seller: "Samsung Store",
  },
];
