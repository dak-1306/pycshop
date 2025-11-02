import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const SellerSidebar = ({ activeMenu }) => {
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
      id: "messages",
      name: "Tin nhắn khách hàng",
      icon: "messages",
      href: "/seller/messages",
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
      messages: <FontAwesomeIcon icon={["fas", "comments"]} />,
      shop: <FontAwesomeIcon icon={["fas", "store"]} />,
    };
    return icons[iconType] || icons.dashboard;
  };

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 overflow-y-auto">
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeMenu === item.id
                  ? "bg-seller-50 text-seller-800 border-r-4 border-seller-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
              }`}
            >
              <span
                className={`mr-3 transition-colors duration-200 ${
                  activeMenu === item.id
                    ? "text-seller-600"
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
  );
};

SellerSidebar.propTypes = {
  activeMenu: PropTypes.string.isRequired,
};

export default SellerSidebar;
