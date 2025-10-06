import React from "react";
import PropTypes from "prop-types";
import { Card, Badge, Button } from "../../ui";

const ProductCard = ({
  product,
  actions = [],
  showStatus = true,
  showPrice = true,
  className = "",
}) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "đang bán":
        return "success";
      case "inactive":
      case "ngừng bán":
        return "danger";
      case "pending":
      case "chờ duyệt":
        return "warning";
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

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="h-48 w-full object-cover object-center group-hover:opacity-75"
          onError={(e) => {
            e.target.src = "/placeholder-product.jpg";
          }}
        />
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>

            {product.description && (
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {showStatus && product.status && (
            <Badge variant={getStatusVariant(product.status)} size="sm">
              {product.status}
            </Badge>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          {showPrice && product.price && (
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(product.price)}
            </p>
          )}

          {product.stock !== undefined && (
            <p className="text-sm text-gray-600">Kho: {product.stock}</p>
          )}
        </div>

        {actions.length > 0 && (
          <div className="mt-4 flex space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || "outline"}
                onClick={() => action.onClick(product)}
                className="flex-1"
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

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    status: PropTypes.string,
    stock: PropTypes.number,
  }).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string,
      icon: PropTypes.node,
    })
  ),
  showStatus: PropTypes.bool,
  showPrice: PropTypes.bool,
  className: PropTypes.string,
};

export default ProductCard;
