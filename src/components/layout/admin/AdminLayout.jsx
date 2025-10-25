import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useNotifications } from "../../../hooks/common/useNotifications.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useLanguage } from "../../../context/LanguageContext.jsx";
import adminService from "../../../lib/services/adminService.js";
import AdminHeader from "./AdminHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
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
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        isCurrentPath={isCurrentPath}
        handleLogout={handleLogout}
        t={t}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          showProfileDropdown={showProfileDropdown}
          setShowProfileDropdown={setShowProfileDropdown}
          profileDropdownRef={profileDropdownRef}
          navigation={navigation}
          isCurrentPath={isCurrentPath}
          t={t}
          handleLogout={handleLogout}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          unreadCount={unreadCount}
          toggleNotifications={toggleNotifications}
          closeNotifications={closeNotifications}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          deleteNotification={deleteNotification}
          clearAllNotifications={clearAllNotifications}
          getRelativeTime={getRelativeTime}
          getPriorityColor={getPriorityColor}
          getNotificationIcon={getNotificationIcon}
        />
        {/* Page content */}
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
