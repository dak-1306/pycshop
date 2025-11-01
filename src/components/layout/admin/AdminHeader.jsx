import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import NotificationPanel from "../../common/notifications/NotificationPanel";
import ThemeToggle from "../../common/controls/ThemeToggle";
import LanguageToggle from "../../common/controls/LanguageToggle";

const AdminHeader = ({
  setSidebarOpen,
  showProfileDropdown,
  setShowProfileDropdown,
  profileDropdownRef,
  navigation,
  isCurrentPath,
  t,
  handleLogout,
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
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={["fas", "bars"]} className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {navigation.find((item) => isCurrentPath(item.href))?.name ||
                "Admin"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("adminSystem")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            >
              <FontAwesomeIcon icon={["fas", "bell"]} className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <NotificationPanel
              isOpen={notificationsOpen}
              onClose={closeNotifications}
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDeleteNotification={deleteNotification}
              onClearAll={clearAllNotifications}
              getRelativeTime={getRelativeTime}
              getPriorityColor={getPriorityColor}
              getNotificationIcon={getNotificationIcon}
            />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle size="normal" />

          {/* Language Toggle */}
          <LanguageToggle size="normal" />

          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">A</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <FontAwesomeIcon
                icon={["fas", "chevron-down"]}
                className="w-4 h-4 text-gray-400"
              />
            </button>

            {/* Dropdown menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@pycshop.com</p>
                </div>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    // Add profile settings logic here if needed
                  }}
                >
                  <FontAwesomeIcon
                    icon={["fas", "user-cog"]}
                    className="w-4 h-4"
                  />
                  <span>Hồ sơ của tôi</span>
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    setShowProfileDropdown(false);
                    // Add settings logic here if needed
                  }}
                >
                  <FontAwesomeIcon icon={["fas", "cog"]} className="w-4 h-4" />
                  <span>Cài đặt</span>
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "sign-out-alt"]}
                      className="w-4 h-4"
                    />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  setSidebarOpen: PropTypes.func.isRequired,
  showProfileDropdown: PropTypes.bool.isRequired,
  setShowProfileDropdown: PropTypes.func.isRequired,
  profileDropdownRef: PropTypes.object.isRequired,
  navigation: PropTypes.array.isRequired,
  isCurrentPath: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
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
};

AdminHeader.defaultProps = {
  unreadCount: 0,
  notifications: [],
  notificationsOpen: false,
};

export default AdminHeader;
