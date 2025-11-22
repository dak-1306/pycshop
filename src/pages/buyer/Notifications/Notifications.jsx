import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import NotificationService from "../../../services/notificationService";
import "../../../styles/pages/buyer/Notifications.css";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const filterOptions = [
    { value: "all", label: "Tất cả", icon: "bell" },
    { value: "order", label: "Đơn hàng", icon: "shopping-cart" },
    { value: "payment", label: "Thanh toán", icon: "credit-card" },
    { value: "shipping", label: "Vận chuyển", icon: "truck" },
    { value: "review", label: "Đánh giá", icon: "star" },
    { value: "promotion", label: "Khuyến mãi", icon: "gift" },
  ];

  useEffect(() => {
    loadNotifications(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const loadNotifications = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const response = await NotificationService.getNotifications(
        currentPage,
        20,
        activeFilter
      );

      console.log("[NOTIFICATIONS] API Response:", response);

      if (response.success) {
        const allNotifications = response.data.notifications || [];

        console.log(
          "[NOTIFICATIONS PAGE] All notifications:",
          allNotifications
        );

        if (reset) {
          setNotifications(allNotifications);
          setPage(1);
        } else {
          setNotifications((prev) => [...prev, ...allNotifications]);
        }

        setHasMore(
          allNotifications.length === 20 &&
            response.data.total > currentPage * 20
        );
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    loadNotifications(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notificationId === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif.notificationId !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.notificationId);

    // Điều hướng dựa trên loại thông báo
    if (notification.relatedId) {
      switch (notification.type) {
        case "order":
          navigate(`/profile?tab=orders`);
          break;
        case "product":
          navigate(`/product/${notification.relatedId}`);
          break;
        case "review":
          navigate(`/product/${notification.relatedId}`);
          break;
        case "shipping":
          navigate(`/profile?tab=orders`);
          break;
        default:
          break;
      }
    }
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifications.map((id) =>
          NotificationService.deleteNotification(id)
        )
      );
      setNotifications((prev) =>
        prev.filter(
          (notif) => !selectedNotifications.includes(notif.notificationId)
        )
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error("Error deleting selected notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <Header />
      <div className="notifications-container">
        <div className="notifications-header">
          <h1>
            <i className="fas fa-bell"></i>
            Thông báo của tôi
          </h1>
          <div className="notifications-actions">
            {unreadCount > 0 && (
              <button
                className="btn-mark-all-read"
                onClick={handleMarkAllAsRead}
              >
                <i className="fas fa-check-double"></i>
                Đánh dấu tất cả đã đọc ({unreadCount})
              </button>
            )}
            {selectedNotifications.length > 0 && (
              <button
                className="btn-delete-selected"
                onClick={handleDeleteSelected}
              >
                <i className="fas fa-trash"></i>
                Xóa đã chọn ({selectedNotifications.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="notifications-filters">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${
                activeFilter === filter.value ? "active" : ""
              }`}
              onClick={() => {
                setActiveFilter(filter.value);
                setPage(1);
              }}
            >
              <i className={`fas fa-${filter.icon}`}></i>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="notifications-list">
          {loading && page === 1 ? (
            <div className="notifications-loading">
              <i className="fas fa-spinner fa-spin"></i>
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div className="notifications-empty">
              <i className="fas fa-bell-slash"></i>
              <p>Không có thông báo nào</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div
                  key={notification.notificationId}
                  className={`notification-item ${
                    notification.isRead ? "read" : "unread"
                  }`}
                >
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(
                        notification.notificationId
                      )}
                      onChange={() =>
                        toggleSelectNotification(notification.notificationId)
                      }
                    />
                  </div>
                  <div
                    className="notification-icon"
                    style={{
                      backgroundColor: NotificationService.getNotificationColor(
                        notification.type
                      ).split(" ")[1],
                    }}
                  >
                    <i
                      className={`fas fa-${NotificationService.getNotificationIcon(
                        notification.type
                      )}`}
                    ></i>
                  </div>
                  <div
                    className="notification-content"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <h3>
                      {notification.type === "order" && "Đơn hàng"}
                      {notification.type === "payment" && "Thanh toán"}
                      {notification.type === "shipping" && "Vận chuyển"}
                      {notification.type === "review" && "Đánh giá"}
                      {notification.type === "promotion" && "Khuyến mãi"}
                      {notification.type === "system" && "Hệ thống"}
                      {!notification.type && "Thông báo"}
                    </h3>
                    <p>
                      {notification.content ||
                        notification.NoiDung ||
                        "Không có nội dung"}
                    </p>
                    <span className="notification-time">
                      {NotificationService.formatNotificationTime(
                        notification.createdAt || notification.ThoiGianGui
                      )}
                    </span>
                  </div>
                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="btn-mark-read"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.notificationId);
                        }}
                        title="Đánh dấu đã đọc"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <button
                      className="btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.notificationId);
                      }}
                      title="Xóa"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  className="btn-load-more"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chevron-down"></i>
                      Xem thêm
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;
