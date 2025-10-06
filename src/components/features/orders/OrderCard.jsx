import React from "react";
import PropTypes from "prop-types";
import { Card, Badge, Button } from "../../ui";

const OrderCard = ({
  order,
  actions = [],
  showCustomer = true,
  className = "",
}) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "hoàn thành":
        return "success";
      case "cancelled":
      case "đã hủy":
        return "danger";
      case "pending":
      case "chờ xử lý":
        return "warning";
      case "processing":
      case "đang xử lý":
        return "info";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">
            Đơn hàng #{order.id}
          </h4>
          {order.createdAt && (
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          )}
        </div>

        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
      </div>

      {showCustomer && order.customer && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Khách hàng:</p>
          <p className="font-medium text-gray-900">{order.customer.name}</p>
          {order.customer.phone && (
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
          )}
        </div>
      )}

      {order.items && order.items.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Sản phẩm:</p>
          <div className="space-y-2">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-900">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-gray-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-gray-500">
                +{order.items.length - 2} sản phẩm khác
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tổng tiền:</p>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(order.total)}
          </p>
        </div>

        {actions.length > 0 && (
          <div className="flex space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || "outline"}
                onClick={() => action.onClick(order)}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    createdAt: PropTypes.string,
    customer: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
  showCustomer: PropTypes.bool,
  className: PropTypes.string,
};

export default OrderCard;
