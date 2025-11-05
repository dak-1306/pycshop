import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const translations = {
  vi: {
    // Navigation
    dashboard: "Bảng điều khiển",
    products: "Sản phẩm",
    orders: "Đơn hàng",
    users: "Người dùng",
    sellers: "Người bán",
    settings: "Cài đặt",
    reports: "Báo cáo",

    // Admin Layout
    adminSystem: "Quản lý hệ thống PycShop",
    profile: "Hồ sơ",
    logout: "Đăng xuất",
    notifications: "Thông báo",

    // Common Actions
    add: "Thêm",
    edit: "Chỉnh sửa",
    delete: "Xóa",
    view: "Xem",
    save: "Lưu",
    cancel: "Hủy",
    confirm: "Xác nhận",
    search: "Tìm kiếm",
    filter: "Lọc",
    export: "Xuất",
    import: "Nhập",
    refresh: "Làm mới",
    reset: "Đặt lại",
    loading: "Đang tải...",
    noData: "Không có dữ liệu",

    // Product Management
    productManagement: "Quản lý sản phẩm",
    addProduct: "Thêm sản phẩm",
    editProduct: "Chỉnh sửa sản phẩm",
    productName: "Tên sản phẩm",
    productPrice: "Giá sản phẩm",
    productCategory: "Danh mục",
    productStatus: "Trạng thái",
    productStock: "Tồn kho",
    productDescription: "Mô tả",
    totalProducts: "Tổng sản phẩm",
    activeProducts: "Đang hoạt động",
    outOfStock: "Hết hàng",
    lowStock: "Sắp hết hàng",
    searchProduct: "Tìm kiếm sản phẩm",
    searchPlaceholder: "Tìm theo tên sản phẩm...",
    category: "Danh mục",
    allCategories: "Tất cả danh mục",
    status: "Trạng thái",
    allStatuses: "Tất cả trạng thái",
    clearFilters: "Xóa bộ lọc",

    // Order Management
    orderManagement: "Quản lý đơn hàng",
    createOrder: "Tạo đơn hàng",
    addOrder: "Thêm đơn hàng",
    manageAllOrders: "Quản lý tất cả đơn hàng trong hệ thống",
    editOrder: "Chỉnh sửa đơn hàng",
    orderNumber: "Số đơn hàng",
    orderDate: "Ngày đặt",
    orderStatus: "Trạng thái đơn hàng",
    orderTotal: "Tổng tiền",
    customerName: "Tên khách hàng",
    paymentStatus: "Trạng thái thanh toán",

    // User Management
    userManagement: "Quản lý người dùng",
    addUser: "Thêm người dùng",
    editUser: "Chỉnh sửa người dùng",
    userName: "Tên người dùng",
    userEmail: "Email",
    userRole: "Vai trò",
    userStatus: "Trạng thái",
    manageAllUsers: "Quản lý tất cả người dùng trong hệ thống",

    // Seller Management
    sellerManagement: "Quản lý người bán",
    addSeller: "Thêm người bán",
    editSeller: "Chỉnh sửa người bán",
    sellerName: "Tên người bán",
    shopName: "Tên cửa hàng",
    loadingSellers: "Đang tải dữ liệu người bán...",
    manageAllSellers:
      "Quản lý và giám sát hoạt động của các người bán trên PycShop",

    // Status
    active: "Hoạt động",
    inactive: "Không hoạt động",
    pending: "Chờ xử lý",
    approved: "Đã duyệt",
    rejected: "Từ chối",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    inStock: "Còn hàng",
    stopSelling: "Ngưng bán",
    undefined: "Không xác định",

    // Table Headers
    sn: "STT",
    actions: "Thao tác",
    createdAt: "Ngày tạo",
    updatedAt: "Ngày cập nhật",
    image: "Ảnh",
    seller: "Người bán",
    price: "Giá",
    stock: "Tồn kho",
    quantity: "Số lượng",
    productList: "Danh sách sản phẩm",

    // Reports
    reportsAnalytics: "Báo cáo & Thống kê",
    systemOverview:
      "Tổng quan và phân tích chi tiết hoạt động hệ thống PycShop",
    loadingReports: "Đang tải dữ liệu báo cáo...",
    exportReport: "Xuất báo cáo",
    refreshData: "Làm mới",
    exportSuccess: "Đã xuất báo cáo thành công!",
    selectDateRange: "Chọn khoảng thời gian",
    timeFilter: "Bộ lọc thời gian",
    selectTimeRange: "Chọn khoảng thời gian để xem báo cáo chi tiết",
    fromDate: "Từ ngày",
    toDate: "Đến ngày",
    last7Days: "7 ngày gần đây",
    last30Days: "30 ngày gần đây",
    last90Days: "90 ngày gần đây",
    lastYear: "Năm ngoái",
    thisMonth: "Tháng này",
    lastMonth: "Tháng trước",

    // Recent Reports

    reportManagement: "Quản lý báo cáo",
    reportDetails: "Chi tiết báo cáo",
    reportId: "Mã báo cáo",
    reportType: "Loại báo cáo",
    reportReason: "Lý do báo cáo",
    reportDescription: "Mô tả chi tiết",
    reportedBy: "Người báo cáo",
    reportStatus: "Trạng thái báo cáo",
    reportPriority: "Mức độ ưu tiên",
    reportDate: "Ngày báo cáo",
    processedBy: "Người xử lý",
    adminNote: "Ghi chú của admin",
    evidence: "Bằng chứng",

    // Report Actions
    approveReport: "Phê duyệt",
    rejectReport: "Từ chối",
    investigateReport: "Điều tra",
    processReport: "Xử lý báo cáo",
    viewReport: "Xem chi tiết",
    deleteReport: "Xóa báo cáo",
    addNote: "Thêm ghi chú",

    // Report Status
    inProgress: "Đang xử lý",
    resolved: "Đã giải quyết",

    // Report Types
    userReport: "Báo cáo người dùng",
    productReport: "Báo cáo sản phẩm",
    shopReport: "Báo cáo cửa hàng",
    reviewReport: "Báo cáo đánh giá",

    // Report Priority
    high: "Cao",
    medium: "Trung bình",
    low: "Thấp",

    // Report Filters
    allTypes: "Tất cả loại",
    allPriorities: "Tất cả mức độ",
    thisWeek: "Tuần này",
    last3Months: "3 tháng qua",

    // Report Statistics
    totalReports: "Tổng báo cáo",
    pendingReports: "Chờ xử lý",
    resolvedReports: "Đã giải quyết",
    rejectedReports: "Đã từ chối",

    // Messages
    reportProcessed: "Đã xử lý báo cáo thành công",
    reportDeleted: "Đã xóa báo cáo thành công",
    processingReport: "Đang xử lý báo cáo...",
    confirmDelete: "Bạn có chắc chắn muốn xóa báo cáo này?",
    confirmApprove: "Bạn có chắc chắn muốn phê duyệt báo cáo này?",
    confirmReject: "Bạn có chắc chắn muốn từ chối báo cáo này?",
    noteRequired: "Vui lòng nhập ghi chú",
    noReportsMessage: "Tất cả báo cáo đã được xử lý hoặc chưa có báo cáo mới",
    showing: "Hiển thị",
    of: "trong",
    processNow: "Xử lý ngay",
    today: "Hôm nay",
    processingError: "Có lỗi xảy ra khi xử lý báo cáo",
    deleteError: "Có lỗi xảy ra khi xóa báo cáo",

    // Settings
    settingsTitle: "Cài đặt hệ thống",
    settingsSubtitle: "Tùy chỉnh giao diện và ngôn ngữ của bạn",
    themeSettings: "Cài đặt giao diện",
    themeDescription: "Chọn giao diện sáng hoặc tối theo sở thích của bạn",
    lightTheme: "Giao diện sáng",
    darkTheme: "Giao diện tối",
    lightDescription: "Giao diện truyền thống với nền sáng",
    darkDescription: "Giao diện tối dễ nhìn trong môi trường thiếu sáng",
    languageSettings: "Cài đặt ngôn ngữ",
    languageDescription: "Chọn ngôn ngữ hiển thị cho ứng dụng",
    vietnamese: "Tiếng Việt",
    english: "English",
    vietnameseDescription: "Hiển thị ứng dụng bằng tiếng Việt",
    englishDescription: "Display application in English",
    themeChanged: "Đã thay đổi giao diện",
    languageChanged: "Đã thay đổi ngôn ngữ",
  },
  en: {
    // Navigation
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    users: "Users",
    sellers: "Sellers",
    settings: "Settings",
    reports: "Reports",

    // Admin Layout
    adminSystem: "PycShop System Management",
    profile: "Profile",
    logout: "Logout",
    notifications: "Notifications",

    // Common Actions
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    reset: "Reset",
    loading: "Loading...",
    noData: "No data available",

    // Product Management
    productManagement: "Product Management",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    productName: "Product Name",
    productPrice: "Product Price",
    productCategory: "Category",
    productStatus: "Status",
    productStock: "Stock",
    productDescription: "Description",
    totalProducts: "Total Products",
    activeProducts: "Active Products",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    searchProduct: "Search Products",
    searchPlaceholder: "Search by product name...",
    category: "Category",
    allCategories: "All Categories",
    status: "Status",
    allStatuses: "All Statuses",
    clearFilters: "Clear Filters",

    // Order Management
    orderManagement: "Order Management",
    createOrder: "Create Order",
    addOrder: "Add Order",
    manageAllOrders: "Manage all orders in the system",
    editOrder: "Edit Order",
    orderNumber: "Order Number",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    orderTotal: "Total Amount",
    customerName: "Customer Name",
    paymentStatus: "Payment Status",

    // User Management
    userManagement: "User Management",
    addUser: "Add User",
    editUser: "Edit User",
    userName: "User Name",
    userEmail: "Email",
    userRole: "Role",
    userStatus: "Status",
    manageAllUsers: "Manage all users in the system",

    // Seller Management
    sellerManagement: "Seller Management",
    addSeller: "Add Seller",
    editSeller: "Edit Seller",
    sellerName: "Seller Name",
    shopName: "Shop Name",
    loadingSellers: "Loading seller data...",
    manageAllSellers: "Manage and monitor activities of sellers on PycShop",

    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    completed: "Completed",
    cancelled: "Cancelled",
    inStock: "In Stock",
    stopSelling: "Stop Selling",
    undefined: "Undefined",

    // Table Headers
    sn: "S.N.",
    actions: "Actions",
    createdAt: "Created At",
    updatedAt: "Updated At",
    image: "Image",
    seller: "Seller",
    price: "Price",
    stock: "Stock",
    quantity: "Quantity",
    productList: "Product List",

    // Reports
    reportsAnalytics: "Reports & Analytics",
    systemOverview:
      "Comprehensive overview and detailed analysis of PycShop system activities",
    loadingReports: "Loading report data...",
    exportReport: "Export Report",
    refreshData: "Refresh",
    exportSuccess: "Report exported successfully!",
    selectDateRange: "Select Date Range",

    // Recent Reports

    reportManagement: "Report Management",
    reportDetails: "Report Details",
    reportId: "Report ID",
    reportType: "Report Type",
    reportReason: "Report Reason",
    reportDescription: "Detailed Description",
    reportedBy: "Reported By",
    reportStatus: "Report Status",
    reportPriority: "Priority Level",
    reportDate: "Report Date",
    processedBy: "Processed By",
    adminNote: "Admin Note",
    evidence: "Evidence",

    // Report Actions
    approveReport: "Approve",
    rejectReport: "Reject",
    investigateReport: "Investigate",
    processReport: "Process Report",
    viewReport: "View Details",
    deleteReport: "Delete Report",
    addNote: "Add Note",

    // Report Status
    inProgress: "In Progress",
    resolved: "Resolved",

    // Report Types
    userReport: "User Report",
    productReport: "Product Report",
    shopReport: "Shop Report",
    reviewReport: "Review Report",

    // Report Priority
    high: "High",
    medium: "Medium",
    low: "Low",

    // Report Filters
    allTypes: "All Types",
    allPriorities: "All Priorities",
    thisWeek: "This Week",
    last3Months: "Last 3 Months",

    // Report Statistics
    totalReports: "Total Reports",
    pendingReports: "Pending Reports",
    resolvedReports: "Resolved Reports",
    rejectedReports: "Rejected Reports",

    // Messages
    reportProcessed: "Report processed successfully",
    reportDeleted: "Report deleted successfully",
    processingReport: "Processing report...",
    confirmDelete: "Are you sure you want to delete this report?",
    confirmApprove: "Are you sure you want to approve this report?",
    confirmReject: "Are you sure you want to reject this report?",
    noteRequired: "Please enter a note",
    noReportsMessage:
      "All reports have been processed or no new reports available",
    showing: "Showing",
    of: "of",
    processNow: "Process Now",
    today: "Today",
    processingError: "Error occurred while processing report",
    deleteError: "Error occurred while deleting report",

    // Settings
    settingsTitle: "System Settings",
    settingsSubtitle: "Customize your interface and language preferences",
    themeSettings: "Theme Settings",
    themeDescription:
      "Choose between light and dark theme according to your preference",
    lightTheme: "Light Theme",
    darkTheme: "Dark Theme",
    lightDescription: "Traditional interface with light background",
    darkDescription:
      "Dark interface that is easy on the eyes in low-light environments",
    languageSettings: "Language Settings",
    languageDescription: "Choose display language for the application",
    vietnamese: "Tiếng Việt",
    english: "English",
    vietnameseDescription: "Hiển thị ứng dụng bằng tiếng Việt",
    englishDescription: "Display application in English",
    themeChanged: "Theme changed",
    languageChanged: "Language changed",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "vi";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isVietnamese: language === "vi",
    isEnglish: language === "en",
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
