const API_BASE_URL = "http://localhost:5000";

export const shopService = {
  // Lấy thông tin chi tiết shop và sản phẩm
  getShopDetail: async (shopId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shops/shop/${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tải thông tin shop");
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error in getShopDetail:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};
