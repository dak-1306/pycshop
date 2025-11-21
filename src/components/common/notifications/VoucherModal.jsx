import React, { useState, useEffect } from "react";
import { useToast } from "../../../hooks/useToast";

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
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadVouchers();
    }
  }, [isOpen]);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - replace with actual API call
      const mockVouchers = [
        {
          id: 1,
          code: "WELCOME10",
          title: "Giảm 10% cho đơn hàng đầu tiên",
          description: "Áp dụng cho đơn hàng từ 200.000đ",
          discountType: "percentage",
          discountValue: 10,
          minOrderValue: 200000,
          maxDiscount: 50000,
          validUntil: "2024-12-31",
          isUsed: false,
        },
        {
          id: 2,
          code: "FREESHIP",
          title: "Miễn phí vận chuyển",
          description: "Cho đơn hàng từ 500.000đ",
          discountType: "shipping",
          discountValue: 30000,
          minOrderValue: 500000,
          maxDiscount: 30000,
          validUntil: "2024-11-30",
          isUsed: false,
        },
      ];

      setVouchers(mockVouchers);
    } catch (err) {
      setError("Không thể tải danh sách voucher");
      showError("Không thể tải danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  const validateManualCode = async () => {
    if (!manualCode.trim()) return;

    try {
      setValidatingCode(true);

      // Mock validation - replace with actual API call
      const mockVoucher = {
        id: 999,
        code: manualCode.toUpperCase(),
        title: "Mã giảm giá hợp lệ",
        description: "Giảm 15% cho đơn hàng",
        discountType: "percentage",
        discountValue: 15,
        minOrderValue: 100000,
        maxDiscount: 100000,
        validUntil: "2024-12-31",
        isUsed: false,
      };

      if (orderValue >= mockVoucher.minOrderValue) {
        onSelectVoucher(mockVoucher);
        showSuccess("Áp dụng mã giảm giá thành công!");
        onClose();
      } else {
        showError(
          `Đơn hàng phải từ ${mockVoucher.minOrderValue.toLocaleString()}đ`
        );
      }
    } catch (err) {
      showError("Mã giảm giá không hợp lệ");
    } finally {
      setValidatingCode(false);
    }
  };

  const calculateDiscount = (voucher) => {
    if (orderValue < voucher.minOrderValue) return 0;

    if (voucher.discountType === "percentage") {
      const discount = (orderValue * voucher.discountValue) / 100;
      return Math.min(discount, voucher.maxDiscount);
    }

    return voucher.discountValue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Chọn voucher
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Manual code input */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Nhập mã voucher
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã voucher"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              onClick={validateManualCode}
              disabled={!manualCode.trim() || validatingCode}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {validatingCode ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Áp dụng"
              )}
            </button>
          </div>
        </div>

        {/* Vouchers list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <i className="fas fa-spinner fa-spin text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Đang tải vouchers...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <i className="fas fa-exclamation-circle text-2xl text-red-400 mb-2"></i>
              <p className="text-red-500">{error}</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-ticket-alt text-2xl text-gray-400 mb-2"></i>
              <p className="text-gray-500">Không có voucher khả dụng</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {vouchers.map((voucher) => (
                <VoucherItem
                  key={voucher.id}
                  voucher={voucher}
                  orderValue={orderValue}
                  isSelected={selectedVoucher?.id === voucher.id}
                  onSelect={() => {
                    onSelectVoucher(voucher);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Voucher Item Component
const VoucherItem = ({ voucher, orderValue, isSelected, onSelect }) => {
  const isEligible = orderValue >= voucher.minOrderValue;
  const discount = isEligible ? calculateDiscount(voucher, orderValue) : 0;

  const calculateDiscount = (voucher, orderValue) => {
    if (voucher.discountType === "percentage") {
      const discount = (orderValue * voucher.discountValue) / 100;
      return Math.min(discount, voucher.maxDiscount);
    }
    return voucher.discountValue;
  };

  return (
    <div
      className={`
        border-2 rounded-lg p-4 cursor-pointer transition-all
        ${
          isSelected
            ? "border-orange-500 bg-orange-50"
            : isEligible
            ? "border-gray-200 hover:border-orange-300 hover:shadow-md"
            : "border-gray-200 opacity-50 cursor-not-allowed"
        }
      `}
      onClick={isEligible ? onSelect : undefined}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              {voucher.code}
            </span>
            {isSelected && (
              <i className="fas fa-check-circle text-orange-500"></i>
            )}
          </div>

          <h4 className="font-medium text-gray-900 mb-1">{voucher.title}</h4>

          <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>

          <div className="text-xs text-gray-500">
            <div>
              HSD: {new Date(voucher.validUntil).toLocaleDateString("vi-VN")}
            </div>
            <div>Đơn tối thiểu: {voucher.minOrderValue.toLocaleString()}đ</div>
          </div>
        </div>

        <div className="text-right">
          {isEligible ? (
            <div className="text-orange-600 font-semibold">
              -{discount.toLocaleString()}đ
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Không đủ điều kiện</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherModal;
