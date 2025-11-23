import React, { useState, useEffect } from "react";
import promotionService from "../../../services/promotionService.js";

const VoucherModal = ({
  isOpen,
  onClose,
  orderValue,
  onSelectVoucher,
  selectedVoucher = null,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);

  // Load vouchers khi modal mở
  useEffect(() => {
    if (isOpen && orderValue > 0) {
      loadAvailableVouchers();
    }
  }, [isOpen, orderValue]);

  const loadAvailableVouchers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await promotionService.getAvailableVouchers(orderValue);

      if (response.success && response.data.vouchers) {
        const formattedVouchers = response.data.vouchers.map((voucher) =>
          promotionService.formatVoucher(voucher)
        );

        const sortedVouchers = promotionService.sortVouchersByPriority(
          formattedVouchers,
          orderValue
        );

        setVouchers(sortedVouchers);
      } else {
        setVouchers([]);
      }
    } catch (error) {
      console.error("[VOUCHER_MODAL] Error loading vouchers:", error);
      setError(error.message);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // Validate manual voucher code
  const handleValidateManualCode = async () => {
    if (!manualCode.trim()) {
      setError("Vui lòng nhập mã voucher");
      return;
    }

    setValidatingCode(true);
    setError(null);

    try {
      const response = await promotionService.validateVoucher(
        manualCode,
        orderValue
      );

      if (response.success && response.data.valid) {
        const voucher = {
          ...response.data.voucher,
          discountAmount: response.data.discountAmount,
          finalAmount: response.data.finalAmount,
        };

        onSelectVoucher(voucher);
        setManualCode("");
        onClose();
      } else {
        setError(response.message || "Mã voucher không hợp lệ");
      }
    } catch (error) {
      console.error("[VOUCHER_MODAL] Error validating manual code:", error);
      setError(error.message);
    } finally {
      setValidatingCode(false);
    }
  };

  // Handle select voucher
  const handleSelectVoucher = (voucher) => {
    console.log("[VOUCHER_MODAL] Selected voucher:", voucher);
    onSelectVoucher(voucher);
    onClose();
  };

  // Handle remove voucher
  const handleRemoveVoucher = () => {
    onSelectVoucher(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Chọn Voucher Giảm Giá
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Manual Code Input */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Nhập mã voucher
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã voucher..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleValidateManualCode();
                  }
                }}
              />
              <button
                onClick={handleValidateManualCode}
                disabled={validatingCode || !manualCode.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validatingCode ? "Kiểm tra..." : "Áp dụng"}
              </button>
            </div>
          </div>

          {/* Current Voucher */}
          {selectedVoucher && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-green-800">
                    Voucher đang áp dụng
                  </h4>
                  <p className="text-green-700">
                    {selectedVoucher.code} - Giảm{" "}
                    {selectedVoucher.formattedDiscount}
                  </p>
                  <p className="text-sm text-green-600">
                    Tiết kiệm:{" "}
                    {selectedVoucher.discountAmount?.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <button
                  onClick={handleRemoveVoucher}
                  className="text-red-600 hover:text-red-700 text-sm underline"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Available Vouchers */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Voucher khả dụng cho đơn hàng{" "}
              {orderValue?.toLocaleString("vi-VN")}đ
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Đang tải voucher...</span>
              </div>
            ) : vouchers.length > 0 ? (
              <div className="space-y-3">
                {vouchers.map((voucher) => (
                  <VoucherItem
                    key={voucher.id}
                    voucher={voucher}
                    orderValue={orderValue}
                    isSelected={selectedVoucher?.id === voucher.id}
                    onSelect={() => handleSelectVoucher(voucher)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Không có voucher khả dụng cho đơn hàng này
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Hãy thử tăng giá trị đơn hàng hoặc nhập mã voucher thủ công
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Voucher Item Component
const VoucherItem = ({ voucher, orderValue, isSelected, onSelect }) => {
  const discountInfo = promotionService.calculateDiscountedPrice(
    orderValue,
    voucher.discountPercent
  );

  return (
    <div
      className={`
      p-4 border rounded-lg cursor-pointer transition-all
      ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }
    `}
    >
      <div className="flex items-start justify-between" onClick={onSelect}>
        <div className="flex-1">
          {/* Voucher Code */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded uppercase">
              {voucher.code}
            </span>
            <span className="text-lg font-bold text-green-600">
              -{voucher.formattedDiscount}
            </span>
          </div>

          {/* Voucher Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Giảm tối đa:</span>{" "}
              {discountInfo.savedAmount.toLocaleString("vi-VN")}đ
            </p>

            <p>
              <span className="font-medium">Đơn hàng tối thiểu:</span>{" "}
              {voucher.formattedMinOrder}
            </p>

            <p>
              <span className="font-medium">Còn lại:</span>{" "}
              {voucher.remainingUses} lượt sử dụng
            </p>

            {voucher.daysUntilExpire > 0 && (
              <p>
                <span className="font-medium">Hết hạn:</span>{" "}
                <span
                  className={
                    voucher.daysUntilExpire <= 3
                      ? "text-red-600"
                      : voucher.daysUntilExpire <= 7
                      ? "text-orange-600"
                      : "text-gray-600"
                  }
                >
                  Còn {voucher.daysUntilExpire} ngày
                </span>
              </p>
            )}
          </div>

          {/* Savings Preview */}
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <p className="text-gray-700">
              Tiết kiệm:{" "}
              <span className="font-semibold text-green-600">
                {discountInfo.savedAmount.toLocaleString("vi-VN")}đ
              </span>
            </p>
            <p className="text-gray-600">
              Thành tiền: {discountInfo.finalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>

        {/* Select Button */}
        <button
          className={`
            ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${
              isSelected
                ? "bg-blue-600 text-white"
                : "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            }
          `}
        >
          {isSelected ? "Đã chọn" : "Chọn"}
        </button>
      </div>
    </div>
  );
};

export default VoucherModal;
