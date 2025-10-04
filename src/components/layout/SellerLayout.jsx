import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CollaboratorModal from "../modals/CollaboratorModal";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationPanel from "../common/NotificationPanel";
import "../../assets/css/logo.css";

const SellerLayout = ({ children }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorForm, setCollaboratorForm] = useState({
    name: "",
    email: "",
  });

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
  } = useNotifications("seller");

  const handleAddCollaborator = () => {
    setShowCollaboratorModal(true);
  };

  const handleCloseCollaboratorModal = () => {
    setShowCollaboratorModal(false);
    setCollaboratorForm({ name: "", email: "" });
  };

  const handleSaveCollaborator = () => {
    if (!collaboratorForm.name || !collaboratorForm.email) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collaboratorForm.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    // TODO: Call API to save collaborator
    alert(
      `Đã thêm người cộng tác: ${collaboratorForm.name} (${collaboratorForm.email})`
    );
    handleCloseCollaboratorModal();
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) setActiveMenu("dashboard");
    else if (path.includes("/manage-product")) setActiveMenu("manageProduct");
    else if (path.includes("/order")) setActiveMenu("order");
    else if (path.includes("/shop-page")) setActiveMenu("shopPage");
  }, [location.pathname]);

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "dashboard",
      href: "/seller/dashboard",
    },
    {
      id: "manageProduct",
      name: "Manage Product",
      icon: "products",
      href: "/seller/manage-product",
    },
    {
      id: "order",
      name: "Order",
      icon: "orders",
      href: "/seller/order",
    },
    {
      id: "shopPage",
      name: "Shop Page",
      icon: "shop",
      href: "/seller/shop-page",
    },
  ];

  const getIcon = (iconType) => {
    const icons = {
      dashboard: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      products: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 12a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      orders: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 110 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a1 1 0 110-2h4zm2-1v1h2V3H9zm5 5a1 1 0 10-2 0v2a1 1 0 102 0V8zm-4 0a1 1 0 10-2 0v2a1 1 0 102 0V8z"
            clipRule="evenodd"
          />
        </svg>
      ),
      shop: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
    return icons[iconType] || icons.dashboard;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white shadow-lg">
        <div className="max-w-full mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 640 640">
                  <path
                    fill="#ff6a00"
                    d="M256 144C256 108.7 284.7 80 320 80C355.3 80 384 108.7 384 144L384 192L256 192L256 144zM208 192L144 192C117.5 192 96 213.5 96 240L96 448C96 501 139 544 192 544L448 544C501 544 544 501 544 448L544 240C544 213.5 522.5 192 496 192L432 192L432 144C432 82.1 381.9 32 320 32C258.1 32 208 82.1 208 144L208 192zM232 240C245.3 240 256 250.7 256 264C256 277.3 245.3 288 232 288C218.7 288 208 277.3 208 264C208 250.7 218.7 240 232 240zM384 264C384 250.7 394.7 240 408 240C421.3 240 432 250.7 432 264C432 277.3 421.3 288 408 288C394.7 288 384 277.3 384 264z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold pycshop-gradient">Pycshop</h1>
            </div>

            {/* Shop Name */}
            <div className="flex-1 text-center">
              <h2 className="text-lg font-semibold text-yellow-300">
                TÊN CỦA SHOP
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
                      d="M15 17h5l-5 5v-5zM10.07 2.82l-.9 1.46A9.949 9.949 0 0112 4a9.949 9.949 0 012.83.28l-.9-1.46A11.947 11.947 0 0010.07 2.82z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9z"
                    />
                  </svg>
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
                onClick={handleAddCollaborator}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                title="Thêm người cộng tác"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>

              {/* Return to Buyer Page Button */}
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                title="Trở về trang người mua"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Trang người mua</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span
                    className={`mr-3 ${
                      activeMenu === item.id ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {getIcon(item.icon)}
                  </span>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Collaborator Modal */}
      <CollaboratorModal
        isOpen={showCollaboratorModal}
        onClose={handleCloseCollaboratorModal}
        collaboratorForm={collaboratorForm}
        onCollaboratorFormChange={setCollaboratorForm}
        onSave={handleSaveCollaborator}
      />
    </div>
  );
};

export default SellerLayout;
