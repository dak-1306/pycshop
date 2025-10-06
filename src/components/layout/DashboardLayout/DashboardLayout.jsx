import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "../../ui";

const DashboardLayout = ({ user, navigation = [], onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (href) => {
    if (href === "/admin" || href === "/seller") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <SidebarContent
              navigation={navigation}
              isActiveRoute={isActiveRoute}
              user={user}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent
            navigation={navigation}
            isActiveRoute={isActiveRoute}
            user={user}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top nav */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {user?.role === "admin" ? "Quản trị viên" : "Người bán"}
              </h1>
            </div>

            <div className="ml-4 flex items-center space-x-4">
              {/* User menu */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || user?.username}
                  </span>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children || <Outlet />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar content component
const SidebarContent = ({ navigation, isActiveRoute, user }) => (
  <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <img
          className="h-8 w-auto"
          src="/logo.png"
          alt="PycShop"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span className="ml-2 text-xl font-bold text-gray-900">PycShop</span>
      </div>

      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div
                className={`mr-3 flex-shrink-0 h-5 w-5 ${
                  isActive
                    ? "text-orange-500"
                    : "text-gray-400 group-hover:text-gray-500"
                }`}
              >
                {item.icon}
              </div>
              {item.name}
              {item.badge && (
                <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-orange-100 text-orange-800">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>

    {/* User info */}
    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {user?.name || user?.username}
          </p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
      </div>
    </div>
  </div>
);

DashboardLayout.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node,
};

SidebarContent.propTypes = {
  navigation: PropTypes.array.isRequired,
  isActiveRoute: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default DashboardLayout;
