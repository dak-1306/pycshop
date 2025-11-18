import axios from "axios";

const USER_SERVICE_URL = "http://localhost:5000/api/users"; // Thông qua API Gateway

class UserService {
  constructor() {
    this.api = axios.create({
      baseURL: USER_SERVICE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor để thêm token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor để xử lý lỗi
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(
          "[USER_SERVICE] API Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Lấy thông tin profile của user
  async getUserProfile() {
    try {
      const response = await this.api.get("/profile");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy danh sách địa chỉ của user
  async getUserAddresses() {
    try {
      const response = await this.api.get("/addresses");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Lấy địa chỉ mặc định cho checkout
  async getDefaultAddress() {
    try {
      const response = await this.api.get("/addresses/default");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.api.get("/health");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Xử lý lỗi
  handleError(error) {
    if (error.response) {
      // Server trả về lỗi
      const { status, data } = error.response;

      if (status === 401) {
        // Lỗi authentication
        return {
          success: false,
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          code: "AUTH_ERROR",
        };
      } else if (status === 404) {
        // Không tìm thấy
        return {
          success: false,
          message: data.message || "Không tìm thấy thông tin.",
          code: "NOT_FOUND",
        };
      } else if (status >= 500) {
        // Lỗi server
        return {
          success: false,
          message: "Lỗi hệ thống. Vui lòng thử lại sau.",
          code: "SERVER_ERROR",
        };
      } else {
        // Lỗi khác
        return {
          success: false,
          message: data.message || "Có lỗi xảy ra. Vui lòng thử lại.",
          code: "CLIENT_ERROR",
        };
      }
    } else if (error.request) {
      // Network error
      return {
        success: false,
        message:
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.",
        code: "NETWORK_ERROR",
      };
    } else {
      // Unexpected error
      return {
        success: false,
        message: "Có lỗi không mong muốn xảy ra.",
        code: "UNKNOWN_ERROR",
      };
    }
  }
}

// Export singleton instance
export default new UserService();
