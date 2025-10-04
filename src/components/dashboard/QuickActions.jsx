import React from "react";
import {
  AddProductIcon,
  ManageUsersIcon,
  ReportsIcon,
  SettingsIcon,
} from "../icons/QuickActionIcons";

const QuickActions = ({ actions = [] }) => {
  // Icon mapping
  const iconMap = {
    "add-product": AddProductIcon,
    "manage-users": ManageUsersIcon,
    reports: ReportsIcon,
    settings: SettingsIcon,
  };

  const defaultActions = [
    {
      id: "add-product",
      title: "Thêm sản phẩm",
      icon: "add-product",
      href: "/admin/products/new",
      onClick: null,
    },
    {
      id: "manage-users",
      title: "Quản lý user",
      icon: "manage-users",
      href: "/admin/users",
      onClick: null,
    },
    {
      id: "reports",
      title: "Báo cáo",
      icon: "reports",
      href: "/admin/reports",
      onClick: null,
    },
    {
      id: "settings",
      title: "Cài đặt",
      icon: "settings",
      href: "/admin/settings",
      onClick: null,
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  const renderIcon = (iconKey) => {
    const IconComponent = iconMap[iconKey];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600">
            Các thao tác thường dùng để quản lý hệ thống
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayActions.map((action) => (
          <a
            key={action.id}
            href={action.href}
            onClick={action.onClick}
            className="group flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              {renderIcon(action.icon)}
            </div>
            <span className="text-sm font-medium text-gray-900 text-center group-hover:text-blue-700 transition-colors">
              {action.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
