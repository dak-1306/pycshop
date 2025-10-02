// Order management constants

export const ORDER_STATUSES = [
  "Tất cả",
  "Đang xử lý",
  "Đang giao",
  "Hoàn tất",
  "Đã hủy",
];

export const ORDER_CATEGORIES = [
  "Tất cả",
  "Điện thoại",
  "Laptop",
  "Máy tính bảng",
  "Phụ kiện",
  "Khác",
];

export const PAGINATION_CONFIG = {
  itemsPerPage: 10,
  maxVisiblePages: 5,
};

export const ORDER_EXPORT_HEADERS = [
  "ID",
  "Tên sản phẩm",
  "Giá (đ)",
  "Số lượng",
  "Danh mục",
  "Trạng thái",
  "Khách hàng",
  "SĐT",
  "Địa chỉ",
];

// Default order form data
export const DEFAULT_ORDER = {
  productName: "",
  price: "",
  quantity: "",
  category: "",
  status: "Đang xử lý",
  customerName: "",
  customerPhone: "",
  address: "",
};

// Status colors mapping
export const ORDER_STATUS_COLORS = {
  "Hoàn tất": "text-green-600 bg-green-100",
  "Đang giao": "text-blue-600 bg-blue-100",
  "Đang xử lý": "text-yellow-600 bg-yellow-100",
  "Đã hủy": "text-red-600 bg-red-100",
  default: "text-gray-600 bg-gray-100",
};
