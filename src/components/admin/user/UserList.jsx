import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout, DataTable, Button, Badge } from "../..";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const UserList = () => {
  const { user, logout } = useAuth();
  const { canAccess } = usePermissions();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Navigation for admin
  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: (
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
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "Người dùng",
      href: "/admin/users",
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    },
  ];

  // User role badge variants
  const getRoleVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "seller":
        return "primary";
      case "buyer":
        return "success";
      default:
        return "secondary";
    }
  };

  // User role labels
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "seller":
        return "Người bán";
      case "buyer":
        return "Khách hàng";
      default:
        return "Không xác định";
    }
  };

  // User status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "banned":
        return "danger";
      default:
        return "secondary";
    }
  };

  // User status labels
  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "banned":
        return "Bị khóa";
      default:
        return "Không xác định";
    }
  };

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockUsers = [
          {
            id: 1,
            name: "Nguyễn Văn Admin",
            email: "admin@pycshop.com",
            role: "admin",
            status: "active",
            createdAt: "2024-01-01T00:00:00Z",
            lastLogin: "2024-01-15T10:30:00Z",
            orderCount: 0,
            totalSpent: 0,
            shopName: null,
          },
          {
            id: 2,
            name: "Trần Thị Seller",
            email: "seller@pycshop.com",
            role: "seller",
            status: "active",
            createdAt: "2024-01-05T00:00:00Z",
            lastLogin: "2024-01-14T15:20:00Z",
            orderCount: 25,
            totalSpent: 0,
            shopName: "Cửa hàng điện tử ABC",
          },
          {
            id: 3,
            name: "Lê Văn Buyer",
            email: "buyer@pycshop.com",
            role: "buyer",
            status: "active",
            createdAt: "2024-01-10T00:00:00Z",
            lastLogin: "2024-01-15T09:00:00Z",
            orderCount: 12,
            totalSpent: 15000000,
            shopName: null,
          },
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: "name",
      title: "Tên người dùng",
      sortable: true,
      render: (value, user) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Vai trò",
      render: (value, user) => (
        <div>
          <Badge variant={getRoleVariant(value)}>{getRoleLabel(value)}</Badge>
          {user.shopName && (
            <div className="text-xs text-gray-500 mt-1">{user.shopName}</div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => (
        <Badge variant={getStatusVariant(value)}>{getStatusLabel(value)}</Badge>
      ),
    },
    {
      key: "orderCount",
      title: "Số đơn hàng",
      sortable: true,
      render: (value, user) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          {user.role === "buyer" && user.totalSpent > 0 && (
            <div className="text-xs text-gray-500">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(user.totalSpent)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tham gia",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      key: "lastLogin",
      title: "Đăng nhập cuối",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500">
          {value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa từng"}
        </span>
      ),
    },
  ];

  // Table actions
  const actions = [
    {
      label: "Xem",
      onClick: (user) => navigate(`/users/${user.id}`),
      variant: "outline",
      icon: (
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    },
  ];

  // Add edit action if user has permission
  if (canAccess("users", "update")) {
    actions.push({
      label: "Sửa",
      onClick: (user) => navigate(`/users/${user.id}/edit`),
      variant: "primary",
      icon: (
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    });
  }

  // Add ban/unban action
  if (canAccess("users", "update")) {
    actions.push({
      label: "Khóa/Mở khóa",
      onClick: (user) => {
        const action = user.status === "banned" ? "mở khóa" : "khóa";
        if (confirm(`Bạn có chắc muốn ${action} tài khoản "${user.name}"?`)) {
          // Handle ban/unban user
          console.log(`${action} user ${user.id}`);
        }
      },
      variant: "warning",
      icon: (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      condition: (user) => user.id !== user.id, // Don't show for current user
    });
  }

  return (
    <DashboardLayout user={user} navigation={navigation} onLogout={logout}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý người dùng
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {canAccess("users", "create") && (
              <Button
                onClick={() => navigate("/users/new")}
                className="flex items-center space-x-2"
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
                <span>Thêm người dùng</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { key: "all", label: "Tất cả", count: users.length },
              {
                key: "admin",
                label: "Quản trị viên",
                count: users.filter((u) => u.role === "admin").length,
              },
              {
                key: "seller",
                label: "Người bán",
                count: users.filter((u) => u.role === "seller").length,
              },
              {
                key: "buyer",
                label: "Khách hàng",
                count: users.filter((u) => u.role === "buyer").length,
              },
              {
                key: "active",
                label: "Hoạt động",
                count: users.filter((u) => u.status === "active").length,
              },
              {
                key: "banned",
                label: "Bị khóa",
                count: users.filter((u) => u.status === "banned").length,
              },
            ].map((tab) => (
              <a
                key={tab.key}
                href="#"
                className="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                {tab.label}
                <span className="bg-gray-100 text-gray-900 ml-2 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* Users table */}
        <DataTable
          data={users}
          columns={columns}
          actions={actions}
          loading={loading}
          emptyState={{
            title: "Chưa có người dùng",
            description: "Chưa có người dùng nào trong hệ thống",
            actionText: canAccess("users", "create") ? "Thêm người dùng" : null,
            onAction: canAccess("users", "create")
              ? () => navigate("/users/new")
              : null,
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default UserList;
