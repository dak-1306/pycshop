import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import CollaboratorModal from "../seller/CollaboratorModal";
import { useNotifications } from "../../hooks/common/useNotifications";
import { useShopInfo } from "../../hooks/seller/useShopInfo";
import NotificationPanel from "../common/notifications/NotificationPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoImage from "../../images/logo.svg";
import "../../assets/css/logo.css";

const SellerLayout = ({ children }) => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorForm, setCollaboratorForm] = useState({
    name: "",
    email: "",
  });

  // Get shop information
  const { shopInfo, isLoading: shopLoading } = useShopInfo();

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
    else if (path.includes("/products")) setActiveMenu("manageProduct");
    else if (path.includes("/orders")) setActiveMenu("order");
    else if (path.includes("/shop")) setActiveMenu("shopPage");
  }, [location.pathname]);

  const menuItems = [
    {
      id: "dashboard",
      name: "Trang chủ",
      icon: "dashboard",
      href: "/seller/dashboard",
    },
    {
      id: "manageProduct",
      name: "Quản lý sản phẩm",
      icon: "products",
      href: "/seller/products",
    },
    {
      id: "order",
      name: "Đơn hàng",
      icon: "orders",
      href: "/seller/orders",
    },
    {
      id: "shopPage",
      name: "Trang cửa hàng",
      icon: "shop",
      href: "/seller/shop",
    },
  ];

  const getIcon = (iconType) => {
    const icons = {
      dashboard: <FontAwesomeIcon icon={["fas", "tachometer-alt"]} />,
      products: <FontAwesomeIcon icon={["fas", "boxes"]} />,
      orders: <FontAwesomeIcon icon={["fas", "shopping-bag"]} />,
      shop: <FontAwesomeIcon icon={["fas", "store"]} />,
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
            <div className="logo">
              <Link
                to="/seller/dashboard"
                className="flex items-center space-x-3"
              >
                <img
                  // src="/logo-shopee.svg"
                  src={logoImage}
                  alt="PycShop"
                  className="logo-img"
                />
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
                onClick={handleAddCollaborator}
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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeMenu === item.id
                      ? "bg-green-50 text-green-800 border-r-4 border-green-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`mr-3 transition-colors duration-200 ${
                      activeMenu === item.id
                        ? "text-green-600"
                        : "text-gray-400 group-hover:text-gray-600"
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
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50">
          {children}
        </main>
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
