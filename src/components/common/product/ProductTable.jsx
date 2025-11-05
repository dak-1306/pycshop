import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { DataTable } from "../ui";

const ProductTable = React.memo(
  ({
    products = [],
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    getStatusColor,
    variant = "seller", // "admin" | "seller"
  }) => {
    // Helper functions
    const getStatusText = (status) => {
      switch (status) {
        case "active":
        case "hoạt động":
          return "Hoạt động";
        case "inactive":
        case "không hoạt động":
          return "Không hoạt động";
        case "pending":
        case "chờ duyệt":
          return "Chờ duyệt";
        case "draft":
        case "bản nháp":
          return "Bản nháp";
        case "out_of_stock":
        case "hết hàng":
          return "Hết hàng";
        default:
          return "Không xác định";
      }
    };

    const getCategoryText = (category) => {
      if (!category) return "Chưa phân loại";
      return typeof category === "string"
        ? category
        : category.name || "Chưa phân loại";
    };

    const getProductImage = (product) => {
      if (product.image) return product.image;
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        return product.images[0];
      }
      if (product.HinhAnh) return product.HinhAnh;
      return "/images/placeholder-product.png";
    };

    // Row action handler
    const handleRowAction = (actionType, product) => {
      const productId = product.id || product.ID_SanPham;

      switch (actionType) {
        case "view":
          onViewProduct && onViewProduct(productId);
          break;
        case "edit":
          onEditProduct && onEditProduct(productId);
          break;
        case "delete":
          onDeleteProduct && onDeleteProduct(productId);
          break;
      }
    };

    // Status color with product-specific mapping
    const getStatusColorInternal = (status, type) => {
      if (getStatusColor) return getStatusColor(status, type);

      const productStatusColors = {
        active: "bg-green-100 text-green-800",
        "hoạt động": "bg-green-100 text-green-800",
        inactive: "bg-red-100 text-red-800",
        "không hoạt động": "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
        "chờ duyệt": "bg-yellow-100 text-yellow-800",
        draft: "bg-gray-100 text-gray-800",
        "bản nháp": "bg-gray-100 text-gray-800",
        out_of_stock: "bg-orange-100 text-orange-800",
        "hết hàng": "bg-orange-100 text-orange-800",
      };

      return productStatusColors[status] || "bg-gray-100 text-gray-800";
    };

    // Table columns configuration
    const columns = [
      {
        header: "Sản phẩm",
        type: "image",
        showDetails: true,
        nowrap: true,
        getImageUrl: getProductImage,
        getTitle: (product) =>
          product ? product.name || product.TenSanPham : "Sản phẩm",
        getSubtitle: (product) =>
          product ? `#${product.id || product.ID_SanPham}` : "#0",
      },
      {
        header: "Danh mục",
        type: "text",
        nowrap: true,
        format: (_, product) =>
          product
            ? getCategoryText(product.category || product.DanhMuc)
            : "Chưa phân loại",
      },
      {
        header: "Người bán",
        type: "text",
        nowrap: true,
        adminOnly: true,
        format: (_, product) =>
          product
            ? product.sellerName ||
              product.seller ||
              product.TenCuaHang ||
              "Shop"
            : "Shop",
      },
      {
        header: "Giá",
        type: "currency",
        nowrap: true,
        format: (_, product) =>
          product ? formatCurrency(product.price || product.Gia) : "0",
      },
      {
        header: "Tồn kho",
        type: "text",
        nowrap: true,
        format: (_, product) =>
          product
            ? (product.stock !== undefined
                ? product.stock
                : product.SoLuongTon) || 0
            : 0,
      },
      {
        header: "Trạng thái",
        type: "status",
        nowrap: true,
        accessor: "status",
        statusType: "product",
        getStatusText,
        format: (_, product) =>
          product ? product.status || product.TrangThai : "active",
      },
      {
        header: "Ngày tạo",
        type: "date",
        nowrap: true,
        format: (_, product) =>
          product ? product.createdAt || product.NgayTao : null,
      },
      {
        header: "Hành động",
        type: "actions",
        nowrap: true,
        actions: [
          {
            type: "view",
            label: "Xem",
            title: "Xem chi tiết sản phẩm",
          },
          {
            type: "edit",
            label: "Sửa",
            title: "Chỉnh sửa sản phẩm",
          },
          {
            type: "delete",
            label: "Xóa",
            title: "Xóa sản phẩm",
            shouldShow: () => variant === "admin",
          },
        ],
      },
    ];

    return (
      <DataTable
        data={products}
        columns={columns}
        variant={variant}
        onRowAction={handleRowAction}
        getStatusColor={getStatusColorInternal}
        emptyState={{
          icon: ["fas", "box-open"],
          title: "Chưa có sản phẩm",
          description: "Danh sách sản phẩm sẽ hiển thị ở đây",
        }}
      />
    );
  }
);

ProductTable.displayName = "ProductTable";

ProductTable.propTypes = {
  products: PropTypes.array,
  onViewProduct: PropTypes.func,
  onEditProduct: PropTypes.func,
  onDeleteProduct: PropTypes.func,
  getStatusColor: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default ProductTable;
