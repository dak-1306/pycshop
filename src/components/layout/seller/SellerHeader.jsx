import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import NotificationIcon from "../../NotificationIcon";
import logoImage from "../../../images/logo.svg";

// CSS styles for seller header notification
const sellerNotificationStyles = `
  .seller-notification-wrapper button {
    color: white !important;
  }
  
  .seller-notification-wrapper button:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
  }
  
  .seller-notification-wrapper .text-gray-600 {
    color: white !important;
  }
  
  .seller-notification-wrapper .hover\\:text-blue-600:hover {
    color: white !important;
  }
  
  .seller-notification-wrapper .hover\\:bg-blue-50:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
`;

// Inject styles if not already injected
if (
  typeof document !== "undefined" &&
  !document.getElementById("seller-notification-styles")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "seller-notification-styles";
  styleSheet.textContent = sellerNotificationStyles;
  document.head.appendChild(styleSheet);
}

const SellerHeader = ({
  shopInfo,
  shopLoading,
  // Action handlers
  onAddCollaborator,
}) => {
  return (
    <header className="bg-seller-600 text-white shadow-lg z-50 flex-shrink-0">
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
            <div className="seller-notification-wrapper">
              <NotificationIcon />
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
              className="flex items-center space-x-2 px-3 py-2 bg-seller-500 hover:bg-seller-600 text-white rounded-lg transition-colors text-sm font-medium"
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
  // Action handlers
  onAddCollaborator: PropTypes.func.isRequired,
};

SellerHeader.defaultProps = {
  shopLoading: false,
};

export default SellerHeader;
