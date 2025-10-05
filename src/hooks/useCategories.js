import { useState, useEffect } from "react";
import sellerProductService from "../services/sellerProductService.js";

// Hook để lấy danh sách categories từ API
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("[useCategories] Loading categories from API...");
      const response = await sellerProductService.getCategories();

      console.log("[useCategories] Categories response:", response);

      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedCategories = response.data.map((category) => ({
          id: category.ID_DanhMuc,
          name: category.TenDanhMuc,
          value: category.ID_DanhMuc,
        }));

        console.log("[useCategories] Mapped categories:", mappedCategories);
        setCategories(mappedCategories);
      } else {
        console.warn("[useCategories] No categories data from server");
        setError("Không có dữ liệu danh mục từ server");
        setCategories([]);
      }
    } catch (error) {
      console.error("[useCategories] Error loading categories:", error);
      setError("Lỗi khi tải danh mục: " + error.message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    loadCategories, // Add retry function
    // Helper function to get category name by ID
    getCategoryName: (categoryId) => {
      const category = categories.find(
        (cat) => cat.id === categoryId || cat.value === categoryId
      );
      return category ? category.name : "Chưa phân loại";
    },
    // Helper function to get category options for select dropdown
    getCategoryOptions: () => {
      return categories.map((cat) => ({
        value: cat.value || cat.id,
        label: cat.name,
      }));
    },
  };
};
