import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import CollaboratorModal from "../../seller/CollaboratorModal";
import { useNotifications } from "../../../hooks/common/useNotifications";
import { useShopInfo } from "../../../hooks/seller/useShopInfo";
import SellerHeader from "./SellerHeader";
import SellerSidebar from "./SellerSidebar";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SellerHeader
        shopInfo={shopInfo}
        shopLoading={shopLoading}
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
        onAddCollaborator={handleAddCollaborator}
      />

      <div className="flex">
        {/* Sidebar */}
        <SellerSidebar activeMenu={activeMenu} />

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

SellerLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SellerLayout;
