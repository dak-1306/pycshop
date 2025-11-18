import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../lib/utils";
import { DataTable } from "../ui";

const OrderTable = React.memo(
  ({
    orders = [],
    onViewOrder,
    onEditOrder,
    onDeleteOrder,
    onCancelOrder,
    getStatusColor,
    variant = "seller", // "admin" | "seller"
  }) => {
    // Helper functions
    const getStatusText = (status) => {
      switch (status) {
        case "completed":
          return "Hoàn thành";
        case "pending":
          return "Chờ xử lý";
        case "processing":
          return "Đang xử lý";
        case "cancelled":
          return "Đã hủy";
        default:
          return "Không xác định";
      }
    };

    const getPaymentStatusText = (status) => {
      switch (status) {
        case "paid":
          return "Đã thanh toán";
        case "pending":
          return "Chờ thanh toán";
        case "failed":
          return "Thất bại";
        default:
          return "Không xác định";
      }
    };

    // Row action handler
    const handleRowAction = (actionType, order) => {
      const orderId = order.id || order.ID_DonHang;

      switch (actionType) {
        case "view":
          onViewOrder && onViewOrder(orderId);
          break;
        case "edit":
          onEditOrder && onEditOrder(orderId);
          break;
        case "cancel":
          onCancelOrder && onCancelOrder(orderId);
          break;
        case "delete":
          onDeleteOrder && onDeleteOrder(orderId);
          break;
      }
    };

    // Status color with order-specific mapping
    const getStatusColorInternal = (status, type) => {
      if (getStatusColor) return getStatusColor(status, type);

      const statusColors = {
        order: {
          completed: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          processing: "bg-blue-100 text-blue-800",
          cancelled: "bg-red-100 text-red-800",
        },
        payment: {
          paid: "bg-green-100 text-green-800",
          pending: "bg-yellow-100 text-yellow-800",
          failed: "bg-red-100 text-red-800",
        },
      };

      return statusColors[type]?.[status] || "bg-gray-100 text-gray-800";
    };

    // Table columns configuration
    const columns = [
      {
        header: "ID",
        type: "text",
        nowrap: true,
        format: (_, order) =>
          order ? `#${order.id || order.ID_DonHang}` : "#0",
      },
      {
        header: "Khách hàng",
        type: "avatar",
        showDetails: true,
        nowrap: true,
        getTitle: (order) =>
          order
            ? order.customerName || order.customer || order.TenNguoiNhan
            : "Khách hàng",
        getSubtitle: (order) =>
          order ? order.customerEmail || order.SoDienThoai || "" : "",
      },
      {
        header: "Người bán",
        type: "text",
        nowrap: true,
        adminOnly: true,
        format: (_, order) =>
          order ? order.sellerName || order.seller || "Shop" : "Shop",
      },
      {
        header: "Sản phẩm",
        type: "text",
        nowrap: true,
        format: (_, order) =>
          order
            ? order.productName ||
              (order.ChiTietDonHang && order.ChiTietDonHang[0]?.TenSanPham) ||
              (order.items?.length
                ? `${order.items.length} sản phẩm`
                : "Sản phẩm")
            : "Sản phẩm",
      },
      {
        header: "Tổng tiền",
        type: "currency",
        nowrap: true,
        format: (_, order) =>
          order
            ? formatCurrency(order.total || order.totalAmount || order.TongTien)
            : "0",
      },
      {
        header: "Trạng thái",
        type: "status",
        nowrap: true,
        statusType: "order",
        getStatusText,
        format: (_, order) =>
          order ? order.status || order.TrangThai : "pending",
      },
      {
        header: "Thanh toán",
        type: "status",
        nowrap: true,
        statusType: "payment",
        getStatusText: getPaymentStatusText,
        format: (_, order) => (order ? order.paymentStatus : "pending"),
      },
      {
        header: "Ngày tạo",
        type: "date",
        nowrap: true,
        format: (_, order) =>
          order ? order.createdAt || order.orderDate : null,
      },
      {
        header: "Hành động",
        type: "actions",
        nowrap: true,
        actions: [
          {
            type: "view",
            label: "Xem",
            title: "Xem chi tiết đơn hàng",
          },
          {
            type: "edit",
            label: "Sửa",
            title: "Chỉnh sửa đơn hàng",
            shouldShow: (order) => {
              console.log(
                "Edit button shouldShow - variant:",
                variant,
                "order:",
                order
              );
              // Admin có thể edit tất cả đơn hàng
              if (variant === "admin") return true;
              // Seller: Tạm thời hiển thị cho tất cả để test
              return true;

              // TODO: Sau khi test xong sẽ dùng logic này
              // const orderStatus = order.status || order.TrangThai;
              // return (
              //   orderStatus === "pending" ||
              //   orderStatus === "processing" ||
              //   orderStatus === "Chờ xử lý" ||
              //   orderStatus === "Đang xử lý"
              // );
            },
          },
          {
            type: "cancel",
            label: "Hủy",
            title: "Hủy đơn hàng",
            shouldShow: (order) => {
              const orderStatus = order.status || order.TrangThai;
              return (
                orderStatus === "pending" ||
                orderStatus === "processing" ||
                orderStatus === "Chờ xử lý" ||
                orderStatus === "Đang xử lý"
              );
            },
          },
          {
            type: "delete",
            label: "Xóa",
            title: "Xóa đơn hàng",
            shouldShow: () => variant === "admin",
          },
        ],
      },
    ];

    return (
      <DataTable
        data={orders}
        columns={columns}
        variant={variant}
        onRowAction={handleRowAction}
        getStatusColor={getStatusColorInternal}
        emptyState={{
          icon: ["fas", "box-open"],
          title: "Chưa có đơn hàng",
          description: "Danh sách đơn hàng sẽ hiển thị ở đây",
        }}
      />
    );
  }
);

OrderTable.displayName = "OrderTable";

OrderTable.propTypes = {
  orders: PropTypes.array,
  onViewOrder: PropTypes.func,
  onEditOrder: PropTypes.func,
  onDeleteOrder: PropTypes.func,
  onCancelOrder: PropTypes.func,
  getStatusColor: PropTypes.func,
  variant: PropTypes.oneOf(["admin", "seller"]),
};

export default OrderTable;
