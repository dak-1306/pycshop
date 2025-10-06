import { useState, useEffect, useCallback } from "react";
import orderService from "../../services/orderService.js";
import sellerOrderService from "../../services/sellerOrderService.js";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
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
    status: "",
    dateRange: "",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  // Fetch orders
  const fetchOrders = useCallback(
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

        const response = await orderService.getOrders(queryParams);

        setOrders(response.data || []);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  // Fetch seller orders
  const fetchSellerOrders = useCallback(
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

        const response = await sellerOrderService.getSellerOrders(queryParams);

        setOrders(response.data || []);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching seller orders:", err);
        setError(err.message || "Failed to fetch seller orders");
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit]
  );

  // Get single order
  const getOrder = async (id) => {
    try {
      const response = await orderService.getOrder(id);
      return response;
    } catch (err) {
      console.error("Error fetching order:", err);
      throw err;
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      setIsLoading(true);
      const response = await orderService.updateOrderStatus(id, status);
      await fetchOrders();
      return response;
    } catch (err) {
      console.error("Error updating order status:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (id) => {
    try {
      setIsLoading(true);
      const response = await orderService.cancelOrder(id);
      await fetchOrders();
      return response;
    } catch (err) {
      console.error("Error cancelling order:", err);
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

  // Load initial data
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    // State
    orders,
    isLoading,
    error,
    pagination,
    filters,

    // Actions
    fetchOrders,
    fetchSellerOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    updateFilters,
    changePage,
    refetch: fetchOrders,
  };
};
