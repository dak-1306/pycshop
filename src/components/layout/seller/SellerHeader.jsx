import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import NotificationPanel from "../../common/notifications/NotificationPanel";
import logoImage from "../../../images/logo.svg";

const SellerHeader = ({
  shopInfo,
  shopLoading,
  // Notification props
  notifications,
  notificationsOpen,
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
  // Action handlers
  onAddCollaborator,
}) => {
  return (
    <header className="bg-green-700 text-white shadow-lg z-50 flex-shrink-0">
      <div className="max-w-full mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="logo">
            <Link
              to="/seller/dashboard"
              className="flex items-center space-x-3"
            >
              <img src={logoImage} alt="PycShop" className="logo-img" />
            </Link>
          </div>

          {/* Shop Name */}
          <div className="flex-1 text-center">
            <h2 className="text-lg font-semibold text-yellow-300">
              {shopLoading ? "Đang tải..." : shopInfo?.name || "Tên Shop"}
            </h2>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-white hover:bg-green-600 rounded-lg transition-colors"
                title="Thông báo"
              >
                <FontAwesomeIcon icon={["fas", "bell"]} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              <NotificationPanel
                notifications={notifications}
                isOpen={notificationsOpen}
                unreadCount={unreadCount}
                onToggle={toggleNotifications}
                onClose={closeNotifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
                onClearAll={clearAllNotifications}
                getRelativeTime={getRelativeTime}
                getPriorityColor={getPriorityColor}
                getNotificationIcon={getNotificationIcon}
              />
            </div>

            {/* Add Collaborator Button */}
            <button
              onClick={onAddCollaborator}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              title="Thêm người cộng tác"
            >
              <FontAwesomeIcon icon={["fas", "user-plus"]} />
              <span>Thêm CTV</span>
            </button>

            {/* Return to Buyer Page Button */}
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              title="Trở về trang người mua"
            >
              <FontAwesomeIcon icon={["fas", "home"]} />
              <span>Trang người mua</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

SellerHeader.propTypes = {
  shopInfo: PropTypes.shape({
    name: PropTypes.string,
  }),
  shopLoading: PropTypes.bool,
  // Notification props
  notifications: PropTypes.array,
  notificationsOpen: PropTypes.bool,
  unreadCount: PropTypes.number,
  toggleNotifications: PropTypes.func,
  closeNotifications: PropTypes.func,
  markAsRead: PropTypes.func,
  markAllAsRead: PropTypes.func,
  deleteNotification: PropTypes.func,
  clearAllNotifications: PropTypes.func,
  getRelativeTime: PropTypes.func,
  getPriorityColor: PropTypes.func,
  getNotificationIcon: PropTypes.func,
  // Action handlers
  onAddCollaborator: PropTypes.func.isRequired,
};

SellerHeader.defaultProps = {
  shopLoading: false,
  unreadCount: 0,
  notifications: [],
  notificationsOpen: false,
};

export default SellerHeader;
