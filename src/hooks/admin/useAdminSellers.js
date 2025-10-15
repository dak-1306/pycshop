import { useState, useEffect } from "react";
import adminService from "../../lib/services/adminService.js";

// Mock data for fallback
const MOCK_SELLERS = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.seller@pycshop.com",
    phone: "0901234567",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    status: "active",
    isVerified: true,
    joinDate: "2024-01-15",
    lastActive: "2024-10-03",
    shop: {
      id: 1,
      name: "Thời Trang Nam Unisex",
      category: "Thời Trang Nam",
      totalProducts: 150,
      totalOrders: 1250,
      rating: 4.5,
      revenue: 125000000,
    },
    avatar: null,
    performance: {
      orderCompletionRate: 98.5,
      responseTime: "2 giờ",
      customerRating: 4.5,
      refundRate: 1.2,
    },
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.seller@pycshop.com",
    phone: "0912345678",
    address: "456 Nguyễn Huệ, Quận 3, TP.HCM",
    status: "active",
    isVerified: true,
    joinDate: "2024-02-20",
    lastActive: "2024-10-04",
    shop: {
      id: 2,
      name: "Fashion House",
      category: "Thời Trang Nữ",
      totalProducts: 200,
      totalOrders: 890,
      rating: 4.3,
      revenue: 98000000,
    },
    avatar: null,
    performance: {
      orderCompletionRate: 95.2,
      responseTime: "3 giờ",
      customerRating: 4.3,
      refundRate: 2.1,
    },
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "cuong.seller@pycshop.com",
    phone: "0923456789",
    address: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    status: "blocked",
    isVerified: false,
    joinDate: "2024-03-10",
    lastActive: "2024-09-28",
    shop: {
      id: 3,
      name: "Tech Store VN",
      category: "Điện Tử",
      totalProducts: 75,
      totalOrders: 320,
      rating: 3.8,
      revenue: 45000000,
    },
    avatar: null,
    performance: {
      orderCompletionRate: 88.5,
      responseTime: "6 giờ",
      customerRating: 3.8,
      refundRate: 5.2,
    },
  },
  {
    id: 4,
    name: "Phạm Thị Duyên",
    email: "duyen.seller@pycshop.com",
    phone: "0934567890",
    address: "147 Võ Văn Tần, Quận 3, TP.HCM",
    status: "active",
    isVerified: false,
    joinDate: "2024-09-15",
    lastActive: "2024-10-04",
    shop: {
      id: 4,
      name: "Beauty Corner",
      category: "Sắc Đẹp",
      totalProducts: 85,
      totalOrders: 156,
      rating: 4.1,
      revenue: 15000000,
    },
    avatar: null,
    performance: {
      orderCompletionRate: 92.3,
      responseTime: "4 giờ",
      customerRating: 4.1,
      refundRate: 3.1,
    },
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "em.seller@pycshop.com",
    phone: "0945678901",
    address: "258 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    status: "active",
    isVerified: true,
    joinDate: "2023-12-05",
    lastActive: "2024-10-03",
    shop: {
      id: 5,
      name: "Nhà Sách Tri Thức",
      category: "Sách & Văn Phòng Phẩm",
      totalProducts: 300,
      totalOrders: 2100,
      rating: 4.7,
      revenue: 180000000,
    },
    avatar: null,
    performance: {
      orderCompletionRate: 99.1,
      responseTime: "1 giờ",
      customerRating: 4.7,
      refundRate: 0.8,
    },
  },
];

export const useAdminSellers = () => {
  // State management
  const [sellers, setSellers] = useState([]);
  const [sellersStats, setSellersStats] = useState({
    totalSellers: 0,
    activeSellers: 0,
    blockedSellers: 0,
    pendingVerification: 0,
    totalShops: 0,
    activeShops: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [shopTypeFilter, setShopTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Initialize data
  useEffect(() => {
    const loadSellers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await adminService.getSellers({
          search: searchTerm,
          status: statusFilter,
          verification: verificationFilter,
        });
        setSellers(response.data || []);

        // Get seller stats from dashboard API
        const dashboardData = await adminService.getDashboardStats();
        setSellersStats({
          totalSellers: dashboardData.stats.totalSellers || 0,
          activeSellers: dashboardData.stats.activeSellers || 0,
          blockedSellers: dashboardData.stats.blockedSellers || 0,
          pendingVerification: dashboardData.stats.pendingVerification || 0,
          totalShops: dashboardData.stats.totalShops || 0,
          activeShops: dashboardData.stats.activeShops || 0,
          totalProducts: dashboardData.stats.totalProducts || 0,
          totalOrders: dashboardData.stats.totalOrders || 0,
        });
      } catch (error) {
        console.error("Error loading sellers:", error);
        setError("Failed to load sellers");
        // Fallback to mock data
        setSellers(MOCK_SELLERS);
        setSellersStats({
          totalSellers: MOCK_SELLERS.length,
          activeSellers: MOCK_SELLERS.filter((s) => s.status === "active")
            .length,
          blockedSellers: MOCK_SELLERS.filter((s) => s.status === "blocked")
            .length,
          pendingVerification: MOCK_SELLERS.filter(
            (s) => !s.isVerified && s.status === "active"
          ).length,
          totalShops: MOCK_SELLERS.length,
          activeShops: MOCK_SELLERS.filter((s) => s.status === "active").length,
          totalProducts: MOCK_SELLERS.reduce(
            (sum, s) => sum + s.shop.totalProducts,
            0
          ),
          totalOrders: MOCK_SELLERS.reduce(
            (sum, s) => sum + s.shop.totalOrders,
            0
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSellers();
  }, [searchTerm, statusFilter, verificationFilter]);

  // Filter sellers based on search and filters
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.shop.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || seller.status === statusFilter;

    const matchesShopType =
      shopTypeFilter === "all" ||
      (shopTypeFilter === "verified" && seller.isVerified) ||
      (shopTypeFilter === "unverified" && !seller.isVerified);

    return matchesSearch && matchesStatus && matchesShopType;
  });

  // Actions
  const handleViewSeller = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setShowDetailModal(true);
  };

  const handleBlockSeller = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setActionType("block");
    setShowActionModal(true);
  };

  const handleUnblockSeller = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setActionType("unblock");
    setShowActionModal(true);
  };

  const handleVerifySeller = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setActionType("verify");
    setShowActionModal(true);
  };

  const handleDeleteSeller = (sellerId) => {
    const seller = sellers.find((s) => s.id === sellerId);
    setSelectedSeller(seller);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailModal(false);
    setShowActionModal(false);
    setShowDeleteModal(false);
    setSelectedSeller(null);
    setActionType(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedSeller) return;

    try {
      const updatedSellers = sellers.map((seller) => {
        if (seller.id === selectedSeller.id) {
          if (actionType === "block") {
            return { ...seller, status: "blocked" };
          } else if (actionType === "unblock") {
            return { ...seller, status: "active" };
          } else if (actionType === "verify") {
            return { ...seller, isVerified: true };
          }
        }
        return seller;
      });

      setSellers(updatedSellers);

      // Update stats
      const stats = {
        totalSellers: updatedSellers.length,
        activeSellers: updatedSellers.filter((s) => s.status === "active")
          .length,
        blockedSellers: updatedSellers.filter((s) => s.status === "blocked")
          .length,
        pendingVerification: updatedSellers.filter(
          (s) => !s.isVerified && s.status === "active"
        ).length,
        totalShops: updatedSellers.length,
        activeShops: updatedSellers.filter((s) => s.status === "active").length,
        totalProducts: updatedSellers.reduce(
          (sum, s) => sum + s.shop.totalProducts,
          0
        ),
        totalOrders: updatedSellers.reduce(
          (sum, s) => sum + s.shop.totalOrders,
          0
        ),
      };
      setSellersStats(stats);

      let message;
      if (actionType === "block") {
        message = `Đã chặn seller ${selectedSeller.name} thành công!`;
      } else if (actionType === "unblock") {
        message = `Đã bỏ chặn seller ${selectedSeller.name} thành công!`;
      } else if (actionType === "verify") {
        message = `Đã xác minh shop ${selectedSeller.shop.name} thành công!`;
      }

      alert(message);
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      handleCloseModals();
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSeller) return;

    try {
      const updatedSellers = sellers.filter(
        (seller) => seller.id !== selectedSeller.id
      );
      setSellers(updatedSellers);

      // Update stats
      const stats = {
        totalSellers: updatedSellers.length,
        activeSellers: updatedSellers.filter((s) => s.status === "active")
          .length,
        blockedSellers: updatedSellers.filter((s) => s.status === "blocked")
          .length,
        pendingVerification: updatedSellers.filter(
          (s) => !s.isVerified && s.status === "active"
        ).length,
        totalShops: updatedSellers.length,
        activeShops: updatedSellers.filter((s) => s.status === "active").length,
        totalProducts: updatedSellers.reduce(
          (sum, s) => sum + s.shop.totalProducts,
          0
        ),
        totalOrders: updatedSellers.reduce(
          (sum, s) => sum + s.shop.totalOrders,
          0
        ),
      };
      setSellersStats(stats);

      alert(`Đã xóa seller ${selectedSeller.name} thành công!`);
    } catch (error) {
      console.error("Error deleting seller:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      handleCloseModals();
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setShopTypeFilter("all");
    setCurrentPage(1);
  };

  const handleExport = () => {
    try {
      const csvData = [
        [
          "ID",
          "Tên",
          "Email",
          "Điện thoại",
          "Trạng thái",
          "Xác minh",
          "Tên shop",
          "Danh mục",
          "Sản phẩm",
          "Đơn hàng",
          "Doanh thu",
        ],
        ...filteredSellers.map((seller) => [
          seller.id,
          seller.name,
          seller.email,
          seller.phone,
          seller.status === "active" ? "Hoạt động" : "Bị chặn",
          seller.isVerified ? "Đã xác minh" : "Chưa xác minh",
          seller.shop.name,
          seller.shop.category,
          seller.shop.totalProducts,
          seller.shop.totalOrders,
          seller.shop.revenue.toLocaleString() + " ₫",
        ]),
      ];

      const csvContent = csvData
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `danh_sach_sellers_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("📊 Đã xuất danh sách sellers thành công!");
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Có lỗi xảy ra khi xuất dữ liệu!");
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Reload data (in real app, this would be API call)
      setSellers([...MOCK_SELLERS]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return {
    // State
    sellers: filteredSellers,
    sellersStats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    verificationFilter,
    setVerificationFilter,
    shopTypeFilter,
    setShopTypeFilter,
    currentPage,
    setCurrentPage,
    isLoading,
    error,

    // Modals
    showDetailModal,
    showActionModal,
    showDeleteModal,
    selectedSeller,
    actionType,

    // Actions
    handleViewSeller,
    handleBlockSeller,
    handleUnblockSeller,
    handleVerifySeller,
    handleDeleteSeller,
    handleCloseModals,
    handleConfirmAction,
    handleConfirmDelete,
    handleResetFilters,
    handleExport,
    refreshData,

    // Utilities
    formatCurrency,
    formatDate,
  };
};
