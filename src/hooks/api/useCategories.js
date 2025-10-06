import { useState, useEffect } from "react";
import categoryService from "../../services/categoryService.js";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await categoryService.getCategories();

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

        setCategories(mappedCategories);
      } else {
        console.warn("No categories data from server");
        setError("Không có dữ liệu danh mục từ server");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Lỗi khi tải danh mục: " + err.message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Create category
  const createCategory = async (categoryData) => {
    try {
      setIsLoading(true);
      const response = await categoryService.createCategory(categoryData);
      await fetchCategories();
      return response;
    } catch (err) {
      console.error("Error creating category:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update category
  const updateCategory = async (id, categoryData) => {
    try {
      setIsLoading(true);
      const response = await categoryService.updateCategory(id, categoryData);
      await fetchCategories();
      return response;
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      setIsLoading(true);
      await categoryService.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
