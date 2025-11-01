import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import logoImage from "../../../images/logo.svg";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  navigation,
  isCurrentPath,
  handleLogout,
  t,
}) => {
  return (
    <div
      className={`
        flex-shrink-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col
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
      <nav className="flex-1 mt-8 px-6 overflow-y-auto">
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
                    isCurrentPath(item.href) ? "text-blue-700" : "text-gray-400"
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
      <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white dark:bg-gray-800">
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
  );
};

AdminSidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  navigation: PropTypes.array.isRequired,
  isCurrentPath: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default AdminSidebar;
