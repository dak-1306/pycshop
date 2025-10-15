import { useState, useEffect } from "react";

export const useNotifications = (userType = "admin") => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notification data - different content based on user type
  const getMockNotifications = (type) => {
    const baseNotifications = {
      admin: [
        {
          id: 1,
          title: "Đơn hàng mới cần xử lý",
          message: "Có 5 đơn hàng mới đang chờ xác nhận từ các seller.",
          type: "order",
          priority: "high",
          isRead: false,
          timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          actionUrl: "/admin/orders",
          icon: "shopping-bag",
        },
        {
          id: 2,
          title: "Sản phẩm chờ phê duyệt",
          message: "12 sản phẩm mới cần được phê duyệt trước khi lên sàn.",
          type: "product",
          priority: "medium",
          isRead: false,
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          actionUrl: "/admin/products",
          icon: "cube",
        },
        {
          id: 3,
          title: "Tài khoản seller mới",
          message: "Có 3 tài khoản seller mới đăng ký và cần xác minh.",
          type: "user",
          priority: "medium",
          isRead: false,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          actionUrl: "/admin/sellers",
          icon: "user-plus",
        },
        {
          id: 4,
          title: "Báo cáo vi phạm",
          message: "Nhận được 2 báo cáo vi phạm từ người dùng cần kiểm tra.",
          type: "report",
          priority: "high",
          isRead: true,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          actionUrl: "/admin/reports",
          icon: "exclamation-triangle",
        },
        {
          id: 5,
          title: "Doanh thu tháng này",
          message: "Doanh thu tháng 10 đã đạt 95% so với mục tiêu đề ra.",
          type: "revenue",
          priority: "low",
          isRead: true,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          actionUrl: "/admin/reports",
          icon: "chart-bar",
        },
      ],
      seller: [
        {
          id: 1,
          title: "Đơn hàng mới",
          message: "Bạn có 3 đơn hàng mới cần xử lý và chuẩn bị hàng.",
          type: "order",
          priority: "high",
          isRead: false,
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          actionUrl: "/seller/order",
          icon: "shopping-bag",
        },
        {
          id: 2,
          title: "Sản phẩm được phê duyệt",
          message: "5 sản phẩm của bạn đã được admin phê duyệt và đã lên sàn.",
          type: "product",
          priority: "medium",
          isRead: false,
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          actionUrl: "/seller/manage-product",
          icon: "check-circle",
        },
        {
          id: 3,
          title: "Hàng tồn kho thấp",
          message: "2 sản phẩm của bạn sắp hết hàng, cần bổ sung kho.",
          type: "inventory",
          priority: "medium",
          isRead: false,
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          actionUrl: "/seller/manage-product",
          icon: "exclamation-triangle",
        },
        {
          id: 4,
          title: "Đánh giá mới từ khách hàng",
          message: "Shop của bạn nhận được 8 đánh giá mới từ khách hàng.",
          type: "review",
          priority: "low",
          isRead: true,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          actionUrl: "/seller/shop-page",
          icon: "star",
        },
        {
          id: 5,
          title: "Khuyến mãi sắp hết hạn",
          message:
            "Chương trình khuyến mãi 'Sale cuối tuần' sẽ kết thúc vào 23:59 hôm nay.",
          type: "promotion",
          priority: "medium",
          isRead: true,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
          actionUrl: "/seller/manage-product",
          icon: "tag",
        },
        {
          id: 6,
          title: "Doanh thu tuần này",
          message: "Doanh thu tuần này của bạn tăng 25% so với tuần trước.",
          type: "revenue",
          priority: "low",
          isRead: true,
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          actionUrl: "/seller/dashboard",
          icon: "trending-up",
        },
      ],
    };

    return baseNotifications[type] || [];
  };

  // Load notifications
  useEffect(() => {
    const mockNotifications = getMockNotifications(userType);
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
  }, [userType]);

  // Toggle notification panel
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  // Close notification panel
  const closeNotifications = () => {
    setIsOpen(false);
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      const newNotifications = prev.filter((n) => n.id !== notificationId);

      if (notification && !notification.isRead) {
        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      }

      return newNotifications;
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Get relative time string
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      low: "text-blue-600 bg-blue-50 border-blue-200",
    };
    return colors[priority] || colors.low;
  };

  // Get notification icon
  const getNotificationIcon = (iconType) => {
    const icons = {
      "shopping-bag": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      cube: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
      "user-plus": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      "exclamation-triangle": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.634 0L5.179 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      "chart-bar": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
          />
        </svg>
      ),
      "check-circle": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      star: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      tag: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      "trending-up": (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    };
    return icons[iconType] || icons["exclamation-triangle"];
  };

  return {
    notifications,
    isOpen,
    unreadCount,
    toggleNotifications,
    closeNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getRelativeTime,
    getPriorityColor,
    getNotificationIcon,
  };
};
