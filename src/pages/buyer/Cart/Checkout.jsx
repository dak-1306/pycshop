import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart items from location state or localStorage
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Address state
  const [address, setAddress] = useState({
    name: "Nguyễn Văn A",
    phone: "0123456789",
    street: "123 Đường Nguyễn Trãi",
    ward: "Phường Bến Thành",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    isDefault: true,
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Note state
  const [note, setNote] = useState("");

  // Voucher state
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  useEffect(() => {
    // Get cart items from location state or localStorage
    const items =
      location.state?.cartItems ||
      JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);

    // If no items, redirect to cart
    if (!items || items.length === 0) {
      navigate("/cart");
    }
  }, [location.state, navigate]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = 30000; // Fixed shipping fee
  const voucherDiscount = selectedVoucher ? selectedVoucher.discount : 0;
  const total = subtotal + shippingFee - voucherDiscount;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order object
      const orderData = {
        items: cartItems,
        address: address,
        paymentMethod: paymentMethod,
        note: note,
        subtotal: subtotal,
        shippingFee: shippingFee,
        voucherDiscount: voucherDiscount,
        total: total,
        orderDate: new Date().toISOString(),
        status: "pending",
      };

      // Save order to localStorage (in real app, send to API)
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const newOrder = {
        id: Date.now(),
        ...orderData,
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem("cartItems");

      setSuccess(
        "Đặt hàng thành công! Bạn sẽ được chuyển đến trang theo dõi đơn hàng."
      );

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate("/profile/orders", { state: { newOrderId: newOrder.id } });
      }, 2000);
    } catch (error) {
      setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      desc: "Thanh toán bằng tiền mặt khi nhận hàng",
      icon: "💰",
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      desc: "Chuyển khoản qua ATM, Internet Banking",
      icon: "🏦",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      desc: "Thanh toán qua ví điện tử MoMo",
      icon: "📱",
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      desc: "Thanh toán qua ví điện tử ZaloPay",
      icon: "💳",
    },
  ];

  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20 text-gray-600">
          Đang tải...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page min-h-screen bg-gray-50">
      <Header />

      <div className="checkout-container max-w-7xl mx-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="checkout-main lg:col-span-2 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <span className="text-2xl">📍</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Địa Chỉ Nhận Hàng
              </h3>
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">
                    {address.name}
                  </span>
                  <span className="text-gray-600">{address.phone}</span>
                  {address.isDefault && (
                    <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="text-gray-600 leading-relaxed">
                  {address.street}, {address.ward}, {address.district},{" "}
                  {address.city}
                </div>
              </div>
              <button className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white transition-colors">
                Thay đổi
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <span className="text-2xl">🛍️</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Sản Phẩm Đã Chọn
              </h3>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover border border-gray-200"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="font-medium text-gray-800 leading-snug">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Phân loại: {item.variant || "Mặc định"}
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-red-500 font-semibold">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-gray-600">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lời nhắn cho Shop:
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-y min-h-[60px]"
                placeholder="Lưu ý cho Người bán..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
              />
            </div>
          </div>

          {/* Voucher Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-2xl">🎫</span>
              <span className="flex-1 text-gray-600">
                {selectedVoucher
                  ? `Voucher đã chọn: ${selectedVoucher.name}`
                  : "Chọn Voucher"}
              </span>
              <button
                className="text-green-600 font-medium hover:text-green-700 transition-colors"
                onClick={() => {
                  /* Handle voucher selection */
                }}
              >
                {selectedVoucher ? "Thay đổi" : "Chọn Voucher"}
              </button>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <span className="text-2xl">💳</span>
              <h3 className="text-lg font-semibold text-gray-800">
                Phương Thức Thanh Toán
              </h3>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all hover:border-green-600 hover:bg-green-50 ${
                    paymentMethod === method.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-green-600 focus:ring-green-600"
                  />
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-600">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Đơn Hàng
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium">{formatPrice(shippingFee)}</span>
              </div>

              {voucherDiscount > 0 && (
                <div className="flex justify-between items-center text-gray-600">
                  <span>Voucher giảm giá</span>
                  <span className="font-medium">
                    -{formatPrice(voucherDiscount)}
                  </span>
                </div>
              )}

              <hr className="border-dashed border-gray-300 my-4" />

              <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-red-500 text-2xl">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg mt-6 hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Đang xử lý..." : "Đặt Hàng"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
              <a href="#" className="text-green-600 hover:text-green-700">
                {" "}
                Điều khoản PycShop
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
