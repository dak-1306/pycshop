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
    SECURITY_NOTICE: "🔒 Trang này chỉ dành cho quản trị viên hệ thống",
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
