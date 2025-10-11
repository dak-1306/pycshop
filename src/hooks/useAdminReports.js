import { useState, useEffect } from "react";
import reportExportService from "../services/reportExportService";

export const useAdminReports = () => {
  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  });

  // Advanced filters state
  const [filters, setFilters] = useState({
    reportType: 'all',
    category: 'all',
    status: 'all',
    minAmount: '',
    maxAmount: '',
    userType: 'all'
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Mock data states
  const [overviewStats, setOverviewStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    outOfStockProducts: 0,
    violationReports: 0,
  });

  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    activeUsers: 0,
    usersByRole: { buyers: 0, sellers: 0 },
    userGrowthChart: [],
    topSellers: [],
  });

  const [orderAnalytics, setOrderAnalytics] = useState({
    totalOrders: 0,
    ordersThisMonth: 0,
    averageOrderValue: 0,
    ordersByStatus: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      cancelled: 0,
    },
    orderTrendChart: [],
    topOrderCategories: [],
  });

  const [productAnalytics, setProductAnalytics] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    productsByCategory: [],
    topSellingProducts: [],
    lowStockProducts: [],
  });

  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    revenueGrowth: 0,
    revenueChart: [],
    revenueByCategory: [],
  });

  // Filter change handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Regenerate data based on filters
    generateMockData(newFilters);
  };

  // Mock data generation
  const generateMockData = (currentFilters = filters) => {
    setIsLoading(true);

    setTimeout(() => {
        // Overview Stats
        setOverviewStats({
          totalUsers: 1547,
          totalOrders: 892,
          totalProducts: 2341,
          totalRevenue: 487520000,
          activeUsers: 423,
          pendingOrders: 47,
          outOfStockProducts: 23,
          violationReports: 8,
        });

        // User Analytics
        setUserAnalytics({
          totalUsers: 1547,
          newUsersThisMonth: 127,
          activeUsers: 423,
          usersByRole: { buyers: 1245, sellers: 302 },
          userGrowthChart: [
            { date: "2025-09-01", buyers: 1100, sellers: 280 },
            { date: "2025-09-15", buyers: 1150, sellers: 290 },
            { date: "2025-10-01", buyers: 1245, sellers: 302 },
          ],
          topSellers: [
            {
              id: 4,
              name: "Trần Tuấn Anh",
              totalRevenue: 45000000,
              totalOrders: 156,
            },
            {
              id: 3,
              name: "Nguyễn Văn Test",
              totalRevenue: 23000000,
              totalOrders: 89,
            },
          ],
        });

        // Order Analytics
        setOrderAnalytics({
          totalOrders: 892,
          ordersThisMonth: 234,
          averageOrderValue: 546000,
          ordersByStatus: {
            pending: 47,
            confirmed: 156,
            shipped: 634,
            cancelled: 55,
          },
          orderTrendChart: [
            { date: "2025-09-01", orders: 45, revenue: 24500000 },
            { date: "2025-09-15", orders: 67, revenue: 36700000 },
            { date: "2025-10-01", orders: 89, revenue: 48600000 },
          ],
          topOrderCategories: [
            {
              category: "Điện thoại & Phụ kiện",
              orders: 234,
              revenue: 156000000,
            },
            { category: "Thời trang Nam", orders: 189, revenue: 67000000 },
            { category: "Máy tính & Laptop", orders: 145, revenue: 234000000 },
          ],
        });

        // Product Analytics
        setProductAnalytics({
          totalProducts: 2341,
          activeProducts: 2318,
          outOfStockProducts: 23,
          productsByCategory: [
            { category: "Điện thoại & Phụ kiện", count: 456 },
            { category: "Thời trang Nam", count: 378 },
            { category: "Thời trang Nữ", count: 423 },
            { category: "Máy tính & Laptop", count: 234 },
            { category: "Đồng hồ", count: 189 },
          ],
          topSellingProducts: [
            {
              id: 3,
              name: "Ốp lưng điện thoại",
              sold: 234,
              revenue: 2808000000,
            },
            { id: 1, name: "Áo ba lỗ", sold: 156, revenue: 23400000 },
            { id: 22, name: "iPhone 12", sold: 89, revenue: 1335000000 },
          ],
          lowStockProducts: [
            { id: 4, name: "Laptop Asus", stock: 0 },
            { id: 16, name: "Máy chơi game PS5", stock: 5 },
            { id: 5, name: "Máy quay Sony", stock: 10 },
          ],
        });

        // Financial Data
        setFinancialData({
          totalRevenue: 487520000,
          revenueThisMonth: 156780000,
          revenueLastMonth: 134560000,
          revenueGrowth: 16.5,
          revenueChart: [
            { month: "2025-07", revenue: 89450000 },
            { month: "2025-08", revenue: 123670000 },
            { month: "2025-09", revenue: 134560000 },
            { month: "2025-10", revenue: 156780000 },
          ],
          revenueByCategory: [
            {
              category: "Điện thoại & Phụ kiện",
              revenue: 186780000,
              percentage: 38.3,
            },
            {
              category: "Máy tính & Laptop",
              revenue: 145230000,
              percentage: 29.8,
            },
            { category: "Thời trang", revenue: 89560000, percentage: 18.4 },
            { category: "Đồng hồ", revenue: 45670000, percentage: 9.4 },
            { category: "Khác", revenue: 20280000, percentage: 4.1 },
          ],
        });setIsLoading(false);
      }, 1000);
    };

  // Initial data load and when dependencies change
  useEffect(() => {
    generateMockData();
  }, [dateRange, filters]);  // Actions
  const handleExportReport = async (format = 'json') => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        dateRange: {
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        },
        overviewStats,
        userAnalytics,
        orderAnalytics,
        productAnalytics,
        financialData,
        violationData,
        filters
      };

      const result = await reportExportService.exportReport(reportData, format);
      
      // Show success message
      alert(`📊 ${result.message}`);
      
      return result;
    } catch (error) {
      console.error('Export failed:', error);
      alert(`❌ Xuất báo cáo thất bại: ${error.message}`);
      throw error;
    }
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Trigger useEffect to reload data
    setDateRange({ ...dateRange });
  };

  return {    // State
    dateRange,
    setDateRange,
    filters,
    setFilters,    overviewStats,
    userAnalytics,
    orderAnalytics,
    productAnalytics,
    financialData,
    isLoading,

    // Actions
    handleExportReport,
    handleRefreshData,
    handleFilterChange,
  };
};
