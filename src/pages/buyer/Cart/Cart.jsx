import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import CartService from "../../../lib/services/cartService";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items from cart service
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const cartData = await CartService.getCart();
      const transformedCart = CartService.transformCartForDisplay(
        cartData.data
      );
      setCartItems(transformedCart.items);
    } catch (error) {
      console.error("Error loading cart:", error);
      // Fallback to localStorage for now
      const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItems(items);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const updateQuantity = async (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }

    try {
      const item = cartItems[index];
      await CartService.updateCartItem(item.id, newQuantity);

      const updatedItems = [...cartItems];
      updatedItems[index].quantity = newQuantity;
      setCartItems(updatedItems);

      // Update localStorage as backup
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error updating cart item:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng!");
    }
  };

  const removeItem = async (index) => {
    try {
      const item = cartItems[index];
      await CartService.removeFromCart(item.id);

      const updatedItems = cartItems.filter((_, i) => i !== index);
      setCartItems(updatedItems);

      // Update localStorage as backup
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));

      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (error) {
      console.error("Error removing cart item:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Vui lòng đăng nhập để thanh toán!");
        navigate("/login");
        return;
      }

      // Use cart service for checkout
      const orderData = {
        totalAmount: getTotalPrice() + 30000, // Including shipping
        shippingFee: 30000,
        items: cartItems,
      };

      await CartService.checkout(orderData);

      // Clear local cart
      setCartItems([]);
      localStorage.removeItem("cartItems");

      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      alert("Đặt hàng thành công!");
      navigate("/orders"); // Redirect to orders page if available
    } catch (error) {
      console.error("Error during checkout:", error);
      // Fallback to normal checkout
      navigate("/checkout", { state: { cartItems } });
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Giỏ Hàng Của Bạn
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) =>
                        (e.target.src =
                          "../../../../microservice/product_service" +
                          item.image)
                      }
                      className="w-20 h-20 rounded object-cover border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Phân loại: {"Mặc định"}
                      </p>
                      <p className="text-red-500 font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Xóa
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>{formatPrice(30000)}</span>
                  </div>
                  <hr className="border-dashed border-gray-300" />
                  <div className="flex justify-between text-lg font-semibold text-gray-800">
                    <span>Tổng cộng</span>
                    <span className="text-red-500">
                      {formatPrice(getTotalPrice() + 30000)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Tiến hành thanh toán
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
