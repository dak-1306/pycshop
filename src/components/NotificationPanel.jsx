import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotificationService from "../services/notificationService.js";
import { useToast } from "../hooks/useToast.js";

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const { showSuccess, showError } = useToast();

  // Load notifications
  const loadNotifications = async (page = 1, type = "all") => {
    try {
      setIsLoading(true);
      const response = await NotificationService.getNotifications(
        page,
        20,
        type
      );

      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      showError("Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  // Load unread count
  const loadUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await NotificationService.markAsRead(notificationId);
      if (response.success) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        await loadUnreadCount();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showError("Không thể đánh dấu thông báo đã đọc");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await NotificationService.markAllAsRead();
      if (response.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
        showSuccess("Đã đánh dấu tất cả thông báo là đã đọc");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showError("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await NotificationService.deleteNotification(
        notificationId
      );
      if (response.success) {
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.notificationId !== notificationId
          )
        );
        await loadUnreadCount();
        showSuccess("Đã xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      showError("Không thể xóa thông báo");
    }
  };

  // Load notifications when panel opens
  useEffect(() => {
    if (isOpen) {
      loadNotifications(1, filterType);
    }
  }, [isOpen, filterType]);

  // Filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  // Page change
  const handlePageChange = (page) => {
    loadNotifications(page, filterType);
  };

  const filterOptions = [
    { value: "all", label: "Tất cả", icon: "bell" },
    { value: "order", label: "Đơn hàng", icon: "shopping-cart" },
    { value: "payment", label: "Thanh toán", icon: "credit-card" },
    { value: "report", label: "Báo cáo", icon: "flag" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end z-50 pt-16 pr-4">
      <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={["fas", "bell"]} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Thông báo</h2>
                {unreadCount > 0 && (
                  <p className="text-white/90 text-xs">
                    {unreadCount} thông báo chưa đọc
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <FontAwesomeIcon icon={["fas", "times"]} className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs transition-colors"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-gray-200 px-4 py-2 flex-shrink-0">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange(option.value)}
              className={`px-3 py-2 text-xs font-medium rounded-lg mr-2 transition-colors ${
                filterType === option.value
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon
                icon={["fas", option.icon]}
                className="w-3 h-3 mr-1"
              />
              {option.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FontAwesomeIcon
                icon={["fas", "bell-slash"]}
                className="w-12 h-12 mb-4 text-gray-300"
              />
              <p className="text-sm">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${NotificationService.getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <FontAwesomeIcon
                        icon={[
                          "fas",
                          NotificationService.getNotificationIcon(
                            notification.type
                          ),
                        ]}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {NotificationService.formatNotificationTime(
                          notification.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            markAsRead(notification.notificationId)
                          }
                          className="w-6 h-6 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <FontAwesomeIcon
                            icon={["fas", "check"]}
                            className="w-3 h-3"
                          />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          deleteNotification(notification.notificationId)
                        }
                        className="w-6 h-6 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                        title="Xóa thông báo"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "trash"]}
                          className="w-3 h-3"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
