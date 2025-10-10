import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  vi: {
    // Navigation
    dashboard: 'Bảng điều khiển',
    products: 'Sản phẩm',
    orders: 'Đơn hàng',
    users: 'Người dùng',
    sellers: 'Người bán',
    settings: 'Cài đặt',
    reports: 'Báo cáo',
    
    // Admin Layout
    adminSystem: 'Quản lý hệ thống PycShop',
    profile: 'Hồ sơ',
    logout: 'Đăng xuất',
    notifications: 'Thông báo',
    
    // Common Actions
    add: 'Thêm',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    view: 'Xem',
    save: 'Lưu',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    export: 'Xuất',
    import: 'Nhập',
    refresh: 'Làm mới',
    reset: 'Đặt lại',
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    
    // Product Management
    productManagement: 'Quản lý sản phẩm',
    addProduct: 'Thêm sản phẩm',
    editProduct: 'Chỉnh sửa sản phẩm',
    productName: 'Tên sản phẩm',
    productPrice: 'Giá sản phẩm',
    productCategory: 'Danh mục',
    productStatus: 'Trạng thái',
    productStock: 'Tồn kho',    productDescription: 'Mô tả',
    totalProducts: 'Tổng sản phẩm',
    activeProducts: 'Đang hoạt động',
    outOfStock: 'Hết hàng',    lowStock: 'Sắp hết hàng',
    searchProduct: 'Tìm kiếm sản phẩm',
    searchPlaceholder: 'Tìm theo tên sản phẩm...',
    category: 'Danh mục',
    allCategories: 'Tất cả danh mục',
    status: 'Trạng thái',    allStatuses: 'Tất cả trạng thái',
    clearFilters: 'Xóa bộ lọc',
    
    // Order Management  
    orderManagement: 'Quản lý đơn hàng',    createOrder: 'Tạo đơn hàng',
    addOrder: 'Thêm đơn hàng',
    manageAllOrders: 'Quản lý tất cả đơn hàng trong hệ thống',
    editOrder: 'Chỉnh sửa đơn hàng',
    orderNumber: 'Số đơn hàng',
    orderDate: 'Ngày đặt',
    orderStatus: 'Trạng thái đơn hàng',
    orderTotal: 'Tổng tiền',
    customerName: 'Tên khách hàng',
    paymentStatus: 'Trạng thái thanh toán',
    
    // User Management
    userManagement: 'Quản lý người dùng',
    addUser: 'Thêm người dùng',
    editUser: 'Chỉnh sửa người dùng',
    userName: 'Tên người dùng',
    userEmail: 'Email',
    userRole: 'Vai trò',    userStatus: 'Trạng thái',
    manageAllUsers: 'Quản lý tất cả người dùng trong hệ thống',
    
    // Seller Management
    sellerManagement: 'Quản lý người bán',
    addSeller: 'Thêm người bán',
    editSeller: 'Chỉnh sửa người bán',    sellerName: 'Tên người bán',
    shopName: 'Tên cửa hàng',
    loadingSellers: 'Đang tải dữ liệu người bán...',
    manageAllSellers: 'Quản lý và giám sát hoạt động của các người bán trên PycShop',
    
    // Status
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    pending: 'Chờ xử lý',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    completed: 'Hoàn thành',    cancelled: 'Đã hủy',
    inStock: 'Còn hàng',
    stopSelling: 'Ngưng bán',
    undefined: 'Không xác định',
    
    // Table Headers
    sn: 'STT',    actions: 'Thao tác',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật',
    image: 'Ảnh',
    seller: 'Người bán',
    price: 'Giá',
    stock: 'Tồn kho',
    quantity: 'Số lượng',
    productList: 'Danh sách sản phẩm',
    
    // Settings
    settingsTitle: 'Cài đặt hệ thống',
    settingsSubtitle: 'Tùy chỉnh giao diện và ngôn ngữ của bạn',
    themeSettings: 'Cài đặt giao diện',
    themeDescription: 'Chọn giao diện sáng hoặc tối theo sở thích của bạn',
    lightTheme: 'Giao diện sáng',
    darkTheme: 'Giao diện tối',
    lightDescription: 'Giao diện truyền thống với nền sáng',
    darkDescription: 'Giao diện tối dễ nhìn trong môi trường thiếu sáng',
    languageSettings: 'Cài đặt ngôn ngữ',
    languageDescription: 'Chọn ngôn ngữ hiển thị cho ứng dụng',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    vietnameseDescription: 'Hiển thị ứng dụng bằng tiếng Việt',
    englishDescription: 'Display application in English',
    themeChanged: 'Đã thay đổi giao diện',
    languageChanged: 'Đã thay đổi ngôn ngữ'
  },
    en: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    users: 'Users',
    sellers: 'Sellers',
    settings: 'Settings',
    reports: 'Reports',
    
    // Admin Layout
    adminSystem: 'PycShop System Management',
    profile: 'Profile',
    logout: 'Logout',
    notifications: 'Notifications',
    
    // Common Actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    reset: 'Reset',
    loading: 'Loading...',
    noData: 'No data available',
    
    // Product Management
    productManagement: 'Product Management',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    productName: 'Product Name',
    productPrice: 'Product Price',
    productCategory: 'Category',
    productStatus: 'Status',
    productStock: 'Stock',    productDescription: 'Description',
    totalProducts: 'Total Products',
    activeProducts: 'Active Products',
    outOfStock: 'Out of Stock',    lowStock: 'Low Stock',
    searchProduct: 'Search Products',
    searchPlaceholder: 'Search by product name...',
    category: 'Category',
    allCategories: 'All Categories',
    status: 'Status',    allStatuses: 'All Statuses',
    clearFilters: 'Clear Filters',
    
    // Order Management
    orderManagement: 'Order Management',    createOrder: 'Create Order',
    addOrder: 'Add Order',
    manageAllOrders: 'Manage all orders in the system',
    editOrder: 'Edit Order',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    orderStatus: 'Order Status',
    orderTotal: 'Total Amount',
    customerName: 'Customer Name',
    paymentStatus: 'Payment Status',
    
    // User Management
    userManagement: 'User Management',
    addUser: 'Add User',
    editUser: 'Edit User',
    userName: 'User Name',
    userEmail: 'Email',
    userRole: 'Role',    userStatus: 'Status',
    manageAllUsers: 'Manage all users in the system',
    
    // Seller Management
    sellerManagement: 'Seller Management',
    addSeller: 'Add Seller',
    editSeller: 'Edit Seller',    sellerName: 'Seller Name',
    shopName: 'Shop Name',
    loadingSellers: 'Loading seller data...',
    manageAllSellers: 'Manage and monitor activities of sellers on PycShop',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',    cancelled: 'Cancelled',
    inStock: 'In Stock',
    stopSelling: 'Stop Selling',
    undefined: 'Undefined',
    
    // Table Headers
    sn: 'S.N.',    actions: 'Actions',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    image: 'Image',
    seller: 'Seller',
    price: 'Price',
    stock: 'Stock',
    quantity: 'Quantity',
    productList: 'Product List',
    
    // Settings
    settingsTitle: 'System Settings',
    settingsSubtitle: 'Customize your interface and language preferences',
    themeSettings: 'Theme Settings',
    themeDescription: 'Choose between light and dark theme according to your preference',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    lightDescription: 'Traditional interface with light background',
    darkDescription: 'Dark interface that is easy on the eyes in low-light environments',
    languageSettings: 'Language Settings',
    languageDescription: 'Choose display language for the application',
    vietnamese: 'Tiếng Việt',
    english: 'English',
    vietnameseDescription: 'Hiển thị ứng dụng bằng tiếng Việt',
    englishDescription: 'Display application in English',
    themeChanged: 'Theme changed',
    languageChanged: 'Language changed'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
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
    isVietnamese: language === 'vi',
    isEnglish: language === 'en',
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
