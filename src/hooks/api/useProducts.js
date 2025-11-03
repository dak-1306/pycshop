import { useState, useEffect, useCallback } from "react";
import productService, {
  sellerProductService,
} from "../../lib/services/productService.js";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    priceRange: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Fetch products
  const fetchProducts = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...filters,
          ...params,
        };

        const response = await productService.getProducts(queryParams);

        setProducts(response.data || []);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.page, pagination.limit, filters]
  );

  // Fetch seller products
  const fetchSellerProducts = async (params = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...filters,
        ...params,
      };

      const response = await sellerProductService.getSellerProducts(
        queryParams
      );

      setProducts(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      });
    } catch (err) {
      console.error("Error fetching seller products:", err);
      setError(err.message || "Failed to fetch seller products");
    } finally {
      setIsLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    try {
      setIsLoading(true);
      const response = await productService.createProduct(productData);
      await fetchProducts();
      return response;
    } catch (err) {
      console.error("Error creating product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    try {
      setIsLoading(true);
      const response = await productService.updateProduct(id, productData);
      await fetchProducts();
      return response;
    } catch (err) {
      console.error("Error updating product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      setIsLoading(true);
      await productService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Change page
  const changePage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Load initial data on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    // State
    products,
    isLoading,
    error,
    pagination,
    filters,

    // Actions
    fetchProducts,
    fetchSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    changePage,
    refetch: fetchProducts,
  };
};
