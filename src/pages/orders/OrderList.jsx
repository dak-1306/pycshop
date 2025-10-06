import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardLayout,
  DataTable,
  Button,
  Badge,
  OrderCard,
} from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const OrderList = () => {
  const { user, logout } = useAuth();
  const { canAccess } = usePermissions();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  const isAdmin = user?.role === "admin";

  // Navigation based on user role
  const navigation = isAdmin
    ? [
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
          name: "Đơn hàng",
          href: "/admin/orders",
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        },
      ]
    : [
        {
          name: "Dashboard",
          href: "/seller",
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
          name: "Đơn hàng của tôi",
          href: "/seller/orders",
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          ),
        },
      ];

  // Order status badge variants
  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "shipping":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Order status labels
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockOrders = [
          {
            id: "ORD-001",
            customerName: "Nguyễn Văn A",
            customerEmail: "nguyenvana@email.com",
            total: 1500000,
            status: "pending",
            createdAt: "2024-01-15T10:30:00Z",
            items: [
              { name: "iPhone 15 Pro", quantity: 1, price: 29990000 },
              { name: "Ốp lưng iPhone", quantity: 1, price: 500000 },
            ],
            shippingAddress: "Số 123, Đường ABC, Quận 1, TP.HCM",
            seller: "Apple Store",
          },
          {
            id: "ORD-002",
            customerName: "Trần Thị B",
            customerEmail: "tranthib@email.com",
            total: 2200000,
            status: "confirmed",
            createdAt: "2024-01-14T15:20:00Z",
            items: [
              { name: "Samsung Galaxy S24", quantity: 1, price: 22990000 },
            ],
            shippingAddress: "Số 456, Đường XYZ, Quận 3, TP.HCM",
            seller: "Samsung Official",
          },
        ];
        setOrders(mockOrders);
        setLoading(false);
      }, 1000);
    };

    fetchOrders();
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: "id",
      title: "Mã đơn hàng",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "customerName",
      title: "Khách hàng",
      sortable: true,
      render: (value, order) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{order.customerEmail}</div>
        </div>
      ),
    },
    {
      key: "total",
      title: "Tổng tiền",
      sortable: true,
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value)}
        </span>
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
      key: "createdAt",
      title: "Ngày đặt",
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-900">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
  ];

  // Add seller column for admin view
  if (isAdmin) {
    columns.splice(3, 0, {
      key: "seller",
      title: "Người bán",
      sortable: true,
    });
  }

  // Table actions
  const actions = [
    {
      label: "Xem",
      onClick: (order) => navigate(`/orders/${order.id}`),
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

  // Add status update actions based on permissions and order status
  if (canAccess("orders", "update")) {
    actions.push({
      label: "Cập nhật",
      onClick: (order) => {
        // Handle status update based on current status
        const nextStatus = {
          pending: "confirmed",
          confirmed: "shipping",
          shipping: "delivered",
        };

        if (nextStatus[order.status]) {
          // Handle status update
          console.log(
            `Updating order ${order.id} to ${nextStatus[order.status]}`
          );
        }
      },
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

  // Add cancel action for pending orders
  if (canAccess("orders", "update")) {
    actions.push({
      label: "Hủy đơn",
      onClick: (order) => {
        if (
          order.status === "pending" &&
          confirm(`Bạn có chắc muốn hủy đơn hàng "${order.id}"?`)
        ) {
          // Handle cancel order
          console.log(`Cancelling order ${order.id}`);
        }
      },
      variant: "danger",
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      condition: (order) => order.status === "pending",
    });
  }

  // Card actions for grid view
  const cardActions = actions.map((action) => ({
    ...action,
    icon: null, // Remove icons for card view
  }));

  return (
    <DashboardLayout user={user} navigation={navigation} onLogout={logout}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdmin ? "Quản lý đơn hàng" : "Đơn hàng của tôi"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdmin
                ? "Quản lý tất cả đơn hàng trong hệ thống"
                : "Quản lý đơn hàng từ cửa hàng của bạn"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View mode toggle */}
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === "table"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
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
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === "grid"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { key: "all", label: "Tất cả", count: orders.length },
              {
                key: "pending",
                label: "Chờ xác nhận",
                count: orders.filter((o) => o.status === "pending").length,
              },
              {
                key: "confirmed",
                label: "Đã xác nhận",
                count: orders.filter((o) => o.status === "confirmed").length,
              },
              {
                key: "shipping",
                label: "Đang giao",
                count: orders.filter((o) => o.status === "shipping").length,
              },
              {
                key: "delivered",
                label: "Đã giao",
                count: orders.filter((o) => o.status === "delivered").length,
              },
              {
                key: "cancelled",
                label: "Đã hủy",
                count: orders.filter((o) => o.status === "cancelled").length,
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

        {/* Content */}
        {viewMode === "table" ? (
          <DataTable
            data={orders}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyState={{
              title: "Chưa có đơn hàng",
              description: isAdmin
                ? "Chưa có đơn hàng nào trong hệ thống"
                : "Bạn chưa có đơn hàng nào",
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                actions={cardActions}
                showCustomer={true}
                showStatus={true}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderList;
