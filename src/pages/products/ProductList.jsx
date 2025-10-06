import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DashboardLayout,
  DataTable,
  Button,
  ProductCard,
} from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const ProductList = () => {
  const { user, logout } = useAuth();
  const { canAccess } = usePermissions();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
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
          name: "Sản phẩm",
          href: "/admin/products",
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l5-3v12m0-12l6 3v12"
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
          name: "Sản phẩm của tôi",
          href: "/seller/products",
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l5-3v12m0-12l6 3v12"
              />
            </svg>
          ),
        },
      ];

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockProducts = [
          {
            id: 1,
            name: "iPhone 15 Pro Max",
            description: "Điện thoại thông minh cao cấp",
            price: 29990000,
            image: "/images/iphone.jpg",
            status: "Đang bán",
            stock: 15,
            seller: "Apple Store",
            category: "Điện thoại",
          },
          {
            id: 2,
            name: "Samsung Galaxy S24",
            description: "Android flagship mới nhất",
            price: 22990000,
            image: "/images/samsung.jpg",
            status: "Đang bán",
            stock: 8,
            seller: "Samsung Official",
            category: "Điện thoại",
          },
        ];
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    };

    fetchProducts();
  }, []);

  // Table columns configuration
  const columns = [
    {
      key: "image",
      title: "Hình ảnh",
      render: (value, product) => (
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="h-12 w-12 rounded-lg object-cover"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
      ),
    },
    {
      key: "name",
      title: "Tên sản phẩm",
      sortable: true,
      render: (value, product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      ),
    },
    {
      key: "price",
      title: "Giá",
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
      key: "stock",
      title: "Kho",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs rounded-full ${
            value > 10
              ? "bg-green-100 text-green-800"
              : value > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs rounded-full ${
            value === "Đang bán"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
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
      onClick: (product) => navigate(`/products/${product.id}`),
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

  // Add edit/delete actions for sellers and admins
  if (canAccess("products", "update")) {
    actions.push({
      label: "Sửa",
      onClick: (product) => navigate(`/products/${product.id}/edit`),
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

  if (canAccess("products", "delete")) {
    actions.push({
      label: "Xóa",
      onClick: (product) => {
        if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
          // Handle delete
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
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
              {isAdmin ? "Quản lý sản phẩm" : "Sản phẩm của tôi"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdmin
                ? "Quản lý tất cả sản phẩm trong hệ thống"
                : "Quản lý sản phẩm của cửa hàng bạn"}
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

            {/* Add product button */}
            {canAccess("products", "create") && (
              <Button
                onClick={() => navigate("/products/new")}
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
                <span>Thêm sản phẩm</span>
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {viewMode === "table" ? (
          <DataTable
            data={products}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyState={{
              title: "Chưa có sản phẩm",
              description: isAdmin
                ? "Chưa có sản phẩm nào trong hệ thống"
                : "Bạn chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!",
              actionText: canAccess("products", "create")
                ? "Thêm sản phẩm"
                : null,
              onAction: canAccess("products", "create")
                ? () => navigate("/products/new")
                : null,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actions={cardActions}
                showStatus={true}
                showPrice={true}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductList;
