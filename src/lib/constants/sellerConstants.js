// Seller constants file
export const SELLER_CONSTANTS = {
  // Page Titles and Descriptions
  PAGES: {
    DASHBOARD: {
      TITLE: "📊 Dashboard",
      SUBTITLE: "Tổng quan cửa hàng",
      LOADING: "Đang tải dashboard...",
    },
    SHOP: {
      TITLE: "🏪 Quản lý cửa hàng",
      SUBTITLE: "Thông tin và thiết lập cửa hàng",
      LOADING: "Đang tải thông tin cửa hàng...",
    },
    PRODUCTS: {
      TITLE: "📦 Quản lý sản phẩm",
      SUBTITLE: "Quản lý sản phẩm của cửa hàng",
      LOADING: "Đang tải sản phẩm...",
    },
    ORDERS: {
      TITLE: "📋 Quản lý đơn hàng",
      SUBTITLE: "Quản lý đơn hàng của cửa hàng",
      LOADING: "Đang tải đơn hàng...",
    },
  },

  // Shop page specific constants
  SHOP_STATUS_COLORS: {
    "Còn hàng": "bg-green-100 text-green-800",
    "Hết hàng": "bg-red-100 text-red-800",
    "Ngừng bán": "bg-gray-100 text-gray-800",
  },

  SHOP_CATEGORIES: [
    "Thời trang",
    "Điện tử",
    "Gia dụng",
    "Sách",
    "Thể thao",
    "Làm đẹp",
  ],

  // Product states
  INITIAL_PRODUCT_STATE: {
    name: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
    status: "Còn hàng",
    image: null,
  },

  DEFAULT_SHOP_INFO: {
    name: "",
    description: "",
    category_id: "",
    phone: "",
    address: "",
  },

  // Modal modes
  MODAL_MODES: {
    ADD: "add",
    EDIT: "edit",
  },

  // Pagination
  PAGINATION_CONFIG: {
    itemsPerPage: 12,
    maxVisiblePages: 5,
  },

  // Navigation menu items
  NAVIGATION_MENU: [
    {
      id: "dashboard",
      name: "Trang chủ",
      icon: "dashboard",
      href: "/seller/dashboard",
    },
    {
      id: "manageProduct",
      name: "Quản lý sản phẩm",
      icon: "products",
      href: "/seller/products",
    },
    {
      id: "order",
      name: "Đơn hàng",
      icon: "orders",
      href: "/seller/orders",
    },
    {
      id: "shopPage",
      name: "Trang cửa hàng",
      icon: "shop",
      href: "/seller/shop",
    },
  ],

  // Order status colors for seller
  ORDER_STATUS_COLORS: {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipping: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  },

  // Error messages
  ERROR_MESSAGES: {
    LOADING_DATA: "Đang tải dữ liệu...",
    LOADING_ERROR: "Lỗi khi tải dữ liệu",
    API_CONNECTION_ERROR: "Lỗi kết nối API",
    API_CONNECTION_MESSAGE:
      "Không thể kết nối đến server. Hiển thị dữ liệu mặc định.",
    RETRY_ACTION: "Thử lại",
    REFRESH_DATA: "Làm mới dữ liệu",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    PRODUCT_CREATED: "Sản phẩm đã được tạo thành công!",
    PRODUCT_UPDATED: "Sản phẩm đã được cập nhật thành công!",
    PRODUCT_DELETED: "Sản phẩm đã được xóa thành công!",
    SHOP_UPDATED: "Thông tin cửa hàng đã được cập nhật!",
    ORDER_STATUS_UPDATED: "Trạng thái đơn hàng đã được cập nhật!",
  },

  // UI Text
  UI_TEXT: {
    ADD_PRODUCT: "Thêm sản phẩm",
    EDIT_PRODUCT: "Sửa sản phẩm",
    VIEW_PRODUCT: "Xem sản phẩm",
    DELETE_PRODUCT: "Xóa sản phẩm",
    SAVE_CHANGES: "Lưu thay đổi",
    CANCEL: "Hủy",
    CONFIRM: "Xác nhận",
    SEARCH_PLACEHOLDER: "Tìm kiếm sản phẩm...",
    NO_DATA: "Không có dữ liệu",
    LOADING: "Đang tải...",
  },

  // Order constants
  ORDER_STATUSES: {
    ALL: "all",
    PENDING: "pending",
    CONFIRMED: "confirmed",
    SHIPPING: "shipping",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },

  ORDER_CATEGORIES: {
    ALL: "all",
    ELECTRONICS: "electronics",
    FASHION: "fashion",
    HOME: "home",
    BOOKS: "books",
    SPORTS: "sports",
  },

  // Helper arrays
  get ORDER_STATUSES_ARRAY() {
    return Object.values(this.ORDER_STATUSES);
  },

  // Default order shape for seller
  DEFAULT_ORDER: {
    id: null,
    customer: "",
    customerName: "",
    email: "",
    total: 0,
    totalAmount: 0,
    items: [],
    productName: "",
    status: "pending",
    seller: "",
    sellerName: "",
    createdAt: null,
    createdDate: null,
  },
};

// Product constants for sellers
export const SELLER_PRODUCT_STATUSES = {
  ACTIVE: "Còn hàng",
  OUT_OF_STOCK: "Hết hàng",
  INACTIVE: "Ngừng bán",
};

export const SELLER_PRODUCT_CATEGORIES = [
  "Điện tử",
  "Thời trang",
  "Gia dụng",
  "Thể thao",
  "Sách & Văn phòng phẩm",
  "Mỹ phẩm",
];

// Mock data for seller
export const SELLER_MOCK_PRODUCTS = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 29990000,
    original_price: 32990000,
    stock_quantity: 50,
    quantity: 50,
    category: "Điện tử",
    category_name: "Điện tử",
    description: "Smartphone cao cấp với chip A17 Pro",
    status: "Còn hàng",
    average_rating: 4.8,
    review_count: 124,
    images: [
      {
        image_url: "/images/iphone15.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 2,
    name: "Áo thun nam cotton",
    price: 199000,
    original_price: 299000,
    stock_quantity: 100,
    quantity: 100,
    category: "Thời trang",
    category_name: "Thời trang",
    description: "Áo thun cotton 100% thoáng mát",
    status: "Còn hàng",
    average_rating: 4.5,
    review_count: 89,
    images: [
      {
        image_url: "/images/aothun.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
  {
    id: 3,
    name: "Laptop Gaming ASUS",
    price: 25990000,
    original_price: 28990000,
    stock_quantity: 0,
    quantity: 0,
    category: "Điện tử",
    category_name: "Điện tử",
    description: "Laptop gaming hiệu năng cao",
    status: "Hết hàng",
    average_rating: 4.7,
    review_count: 67,
    images: [
      {
        image_url: "/images/laptop.jpg",
        is_featured: true,
      },
    ],
    image: null,
  },
];

// Order statuses for seller
export const SELLER_ORDER_STATUSES = {
  ALL: "all",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const SELLER_ORDER_STATUS_LABELS = {
  [SELLER_ORDER_STATUSES.PENDING]: "Chờ xác nhận",
  [SELLER_ORDER_STATUSES.CONFIRMED]: "Đã xác nhận",
  [SELLER_ORDER_STATUSES.SHIPPING]: "Đang giao",
  [SELLER_ORDER_STATUSES.DELIVERED]: "Đã giao",
  [SELLER_ORDER_STATUSES.CANCELLED]: "Đã hủy",
};

// Default stats for seller dashboard
export const SELLER_DEFAULT_STATS = {
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  activeProducts: 0,
  outOfStockProducts: 0,
};

// Recent activities placeholder
export const SELLER_RECENT_ACTIVITIES = [];
