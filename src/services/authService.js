import { api } from "./apiService";

// Auth service để xử lý các API liên quan đến authentication
export const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Lưu token và user info vào localStorage
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa local data dù API có lỗi
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Lấy user hiện tại từ localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Admin login với role validation
  adminLogin: async (email, password) => {
    try {
      // Sử dụng endpoint login chung vì backend đã hỗ trợ check admin
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Validate admin role in response
      if (response.user && response.user.role === "admin") {
        // Lưu token và user info vào localStorage
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
      } else {
        throw new Error("Tài khoản này không có quyền truy cập admin");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      // Ensure no admin data is stored on failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Kiểm tra user có phải admin không
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === "admin";
  },
};
