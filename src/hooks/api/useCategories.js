import { useState, useEffect, useCallback } from "react";
import { productService } from "../../services/productService.js";
import sellerProductService from "../../services/sellerProductService.js";

// Fallback categories khi API lỗi
const FALLBACK_CATEGORIES = [
  { id: 1, name: "Điện tử", value: 1 },
  { id: 2, name: "Thời trang", value: 2 },
  { id: 3, name: "Gia dụng", value: 3 },
  { id: 4, name: "Sách", value: 4 },
  { id: 5, name: "Thể thao", value: 5 },
  { id: 6, name: "Làm đẹp", value: 6 },
  { id: 7, name: "Mẹ và bé", value: 7 },
  { id: 8, name: "Xe cộ", value: 8 },
];

export const useCategories = (usePublicAPI = false) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `[useCategories] Loading categories from ${
          usePublicAPI ? "public" : "seller"
        } API...`
      );

      // Chọn service dựa trên tham số
      const response = usePublicAPI
        ? await productService.getCategories()
        : await sellerProductService.getCategories();

      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedCategories = response.data.map((category) => ({
          id: category.ID_DanhMuc || category.id,
          name: category.TenDanhMuc || category.name,
          value: category.ID_DanhMuc || category.id,
          slug:
            category.slug ||
            category.TenDanhMuc?.toLowerCase().replace(/\s+/g, "-"),
        }));

        console.log("[useCategories] Mapped categories:", mappedCategories);
        setCategories(mappedCategories);
      } else {
        console.warn(
          "[useCategories] No categories data from server, using fallback"
        );
        setError(
          "Không có dữ liệu danh mục từ server, sử dụng dữ liệu dự phòng"
        );
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      console.error("[useCategories] Error loading categories:", err);
      console.log("[useCategories] Using fallback categories due to API error");
      setError("Lỗi API, sử dụng dữ liệu dự phòng: " + err.message);
      setCategories(FALLBACK_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, [usePublicAPI]);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (cat) => cat.id === categoryId || cat.value === categoryId
    );
    return category?.name || "Không xác định";
  };

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.find(
      (cat) => cat.id === categoryId || cat.value === categoryId
    );
  };

  // TODO: CRUD operations - cần categoryService
  // Create category
  const createCategory = async (_categoryData) => {
    console.warn("createCategory not implemented - need categoryService");
    throw new Error("Create category not available");
  };

  // Update category
  const updateCategory = async (_id, _categoryData) => {
    console.warn("updateCategory not implemented - need categoryService");
    throw new Error("Update category not available");
  };

  // Delete category
  const deleteCategory = async (_id) => {
    console.warn("deleteCategory not implemented - need categoryService");
    throw new Error("Delete category not available");
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    // State
    categories,
    isLoading,
    error,

    // Helpers
    getCategoryName,
    getCategoryById,

    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
