import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/common/useNotifications";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../lib/services/authService.js";
import adminService from "../../lib/services/adminService.js";
import NotificationPanel from "../common/notifications/NotificationPanel";
import ThemeToggle from "../common/controls/ThemeToggle";
import LanguageToggle from "../common/controls/LanguageToggle";
import "../../components/buyers/Header.css";
import logoImage from "../../images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const profileDropdownRef = useRef(null);
  // Notification system
  const {
    notifications,
    isOpen: notificationsOpen,
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
  } = useNotifications("admin");
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle admin logout
  const handleLogout = async () => {
    try {
      console.log("[ADMIN LOGOUT] Starting logout process...");

      // Call logout from AuthContext which handles cleanup
      await logout();

      // Clear any admin-specific data
      localStorage.removeItem("loginTime");

      console.log("[ADMIN LOGOUT] Logout successful, redirecting...");

      // Redirect to admin login page
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error("[ADMIN LOGOUT] Error during logout:", error);

      // Even if there's an error, force logout by clearing storage and redirecting
      localStorage.clear();
      navigate("/admin/login", { replace: true });
    }
  };

  // Check if current user is super admin
  const isSuperAdmin = adminService.isSuperAdmin();
  const navigation = [
    {
      name: t("dashboard"),
      href: "/admin/dashboard",
      icon: (
        <FontAwesomeIcon icon={["fas", "tachometer-alt"]} className="w-5 h-5" />
      ),
    },
    {
      name: t("users"),
      href: "/admin/users",
      icon: <FontAwesomeIcon icon={["fas", "users"]} className="w-5 h-5" />,
    },
    {
      name: t("products"),
      href: "/admin/products",
      icon: <FontAwesomeIcon icon={["fas", "box-open"]} className="w-5 h-5" />,
    },
    {
      name: t("orders"),
      href: "/admin/orders",
      icon: (
        <FontAwesomeIcon icon={["fas", "shopping-cart"]} className="w-5 h-5" />
      ),
    },
    {
      name: t("sellers"),
      href: "/admin/sellers",
      icon: <FontAwesomeIcon icon={["fas", "store"]} className="w-5 h-5" />,
    },
    {
      name: t("reports"),
      href: "/admin/reports",
      icon: <FontAwesomeIcon icon={["fas", "chart-bar"]} className="w-5 h-5" />,
    },
    {
      name: t("settings"),
      href: "/admin/settings",
      icon: <FontAwesomeIcon icon={["fas", "cogs"]} className="w-5 h-5" />,
    },
    // Only show for Super Admin
    ...(isSuperAdmin
      ? [
          {
            name: "Quản lý Admin",
            href: "/admin/admin-management",
            icon: (
              <FontAwesomeIcon
                icon={["fas", "user-shield"]}
                className="w-5 h-5"
              />
            ),
          },
        ]
      : []),
  ];

  const isCurrentPath = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="logo-container">
                <img src={logoImage} alt="PYC Shop Logo" className="logo-img" />
                <span className="text-white font-semibold text-lg">Admin</span>
              </div>
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FontAwesomeIcon icon={["fas", "times"]} className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${
                      isCurrentPath(item.href)
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span
                    className={
                      isCurrentPath(item.href)
                        ? "text-blue-700"
                        : "text-gray-400"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@pycshop.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={["fas", "bars"]} className="w-6 h-6" />
              </button>
              <div>
                {" "}
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {navigation.find((item) => isCurrentPath(item.href))?.name ||
                    "Admin"}
                </h1>{" "}
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
                    <p className="text-sm font-medium text-gray-700">
                      Admin User
                    </p>
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
                      <FontAwesomeIcon
                        icon={["fas", "cog"]}
                        className="w-4 h-4"
                      />
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
        </header>{" "}
        {/* Page content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
