import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/useToast";
import UserService from "../../../services/userService.js";
import OrderService from "../../../services/orderService";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import OrderDetailModal from "../../../components/OrderDetailModal";
import "../../../styles/pages/buyer/Profile.css";
import "../../../styles/components/OrderCard.css";
import "../../../styles/components/OrderDetailModal.css";

const Profile = () => {
  const { user, isAuthenticated, loading, login } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState("pending");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });

  // Quick login for database testing
  const handleQuickLogin = () => {
    const mockUserData = {
      ID_NguoiDung: 1,
      TenDangNhap: "user_test",
      HoTen: "Nguyễn Văn Test",
      Email: "test@pycshop.com",
      SoDienThoai: "0123456789",
      DiaChi: "123 Đường Test, Quận 1, TP.HCM",
      GioiTinh: "male",
      NgaySinh: "1990-01-01",
      VaiTro: "buyer",
      Avatar: null,
    };

    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXllciIsImlhdCI6MTYzNzM0NTY3OH0.mock_token_for_testing";
    login(mockUserData, mockToken);
  };

  // Load user profile
  const loadUserProfile = async () => {
    if (!isAuthenticated) return;

    setProfileLoading(true);
    setError("");

    try {
      const profileResponse = await UserService.getUserProfile();
      console.log("Profile response:", profileResponse);
      if (profileResponse.success) {
        setProfile(profileResponse.data);
        setFormData({
          name: profileResponse.data.name || "",
          email: profileResponse.data.email || "",
          phone: profileResponse.data.phone || "",
          address: profileResponse.data.address || "",
          avatar: profileResponse.data.avatar || null,
        });
        setProfileImage(profileResponse.data.Avatar);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Không thể tải thông tin profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Load user addresses
  const loadUserAddresses = async () => {
    if (!isAuthenticated) return;

    try {
      const addressResponse = await UserService.getUserAddresses();
      console.log("Address response:", addressResponse);
      if (addressResponse.success) {
        setAddresses(addressResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
    }
  };

  // Load user orders
  const loadUserOrders = async () => {
    if (!isAuthenticated) return;

    setOrdersLoading(true);
    try {
      const ordersResponse = await OrderService.getUserOrders(1, 20);
      console.log("Orders response:", ordersResponse);
      if (ordersResponse.success) {
        setOrders(ordersResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
      loadUserAddresses();
      loadUserOrders();
    }
  }, [isAuthenticated, user]);

  // Show login prompt if not authenticated
  if (!loading && (!isAuthenticated || !user)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div>
          <i
            className="fas fa-user-circle"
            style={{ fontSize: "4rem", marginBottom: "20px", color: "#ffd700" }}
          ></i>
          <h1>Database Profile Test</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
            Click để test profile với database
          </p>
          <button
            onClick={handleQuickLogin}
            style={{
              padding: "15px 30px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            <i className="fas fa-database"></i> Login & Load Database
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);

      // Note: Avatar upload functionality can be implemented later
      console.log("Avatar upload not implemented yet");
    }
  };

  const handleSave = async () => {
    setProfileLoading(true);
    setError("");

    try {
      // Note: Profile update functionality can be implemented when the API is ready
      console.log("Profile update not implemented yet", formData);
      setEditMode(false);
      setError("Chức năng cập nhật profile sẽ được triển khai sau");
    } catch (error) {
      console.error("Failed to save profile:", error);
      setError("Không thể cập nhật thông tin profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  const handleViewOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    setShowOrderDetail(true);
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrderId(null);
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    // Show confirmation dialog
    // const confirmed = window.confirm(
    //   "Bạn có chắc chắn muốn hủy đơn hàng này? Đơn hàng sẽ được chuyển sang trạng thái đã hủy."
    // );

    // if (!confirmed) {
    //   return;
    // }

    try {
      setOrdersLoading(true);
      console.log(`[PROFILE] Cancelling order ${orderId}`);

      const result = await OrderService.cancelOrder(orderId);

      if (result.success) {
        showSuccess(`Đã hủy đơn hàng #${orderId} thành công!`);

        // Update the order status to cancelled in local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        // Close order detail modal if it's showing the cancelled order
        if (selectedOrderId === orderId) {
          handleCloseOrderDetail();
        }
      } else {
        showError(
          result.message || "Không thể hủy đơn hàng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showError(
        error.message || "Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  // Filter orders based on status
  const getFilteredOrders = (tabKey) => {
    if (!orders || orders.length === 0) return [];

    switch (tabKey) {
      case "pending":
        return orders.filter((order) => order.status === "pending");
      case "confirmed":
        return orders.filter((order) => order.status === "confirmed");
      case "shipped":
        return orders.filter((order) => order.status === "shipped");
      case "delivered":
        return orders.filter((order) => order.status === "delivered");
      case "cancelled":
        return orders.filter((order) => order.status === "cancelled");
      default:
        return orders;
    }
  };

  // Get order count for each tab
  const getOrderCount = (tabKey) => {
    return getFilteredOrders(tabKey).length;
  };

  // Get display orders based on active tab
  const getDisplayOrders = () => {
    return getFilteredOrders(activeOrderTab);
  };

  const sidebarMenuItems = [
    {
      icon: <i className="fas fa-user"></i>,
      title: "Tài khoản của tôi",
      isExpandable: true,
      subItems: [
        {
          key: "profile",
          label: "Hồ Sơ",
          icon: <i className="fas fa-edit"></i>,
        },
        {
          key: "addresses",
          label: "Địa Chỉ",
          icon: <i className="fas fa-map-marker-alt"></i>,
        },
        {
          key: "payment",
          label: "Thẻ Tín Dụng/Ghi Nợ",
          icon: <i className="fas fa-credit-card"></i>,
        },
      ],
    },
    {
      icon: <i className="fas fa-shopping-bag"></i>,
      title: "Đơn Mua",
      key: "orders",
    },
    {
      icon: <i className="fas fa-bell"></i>,
      title: "Thông Báo",
      key: "notifications",
    },
    {
      icon: <i className="fas fa-ticket-alt"></i>,
      title: "Kho Voucher",
      key: "vouchers",
    },
    {
      icon: <i className="fas fa-coins"></i>,
      title: "PycShop Xu",
      key: "coins",
    },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Hồ Sơ Của Tôi</h2>
              <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            {profileLoading && !profile ? (
              <div className="loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Đang tải thông tin profile...</p>
              </div>
            ) : (
              <div className="profile-form-layout">
                <div className="form-section">
                  <div className="form-row">
                    <label>Tên đăng nhập</label>
                    <div className="input-wrapper">
                      <span className="readonly-field">{formData.name}</span>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Tên</label>
                    <div className="input-wrapper">
                      {editMode ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      ) : (
                        <>
                          <span className="field-value">{formData.name}</span>
                          <button
                            className="edit-btn"
                            onClick={() => setEditMode(true)}
                          >
                            Thay Đổi
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Email</label>
                    <div className="input-wrapper">
                      <span className="field-value">{formData.email}</span>
                      <button className="edit-btn">Thay Đổi</button>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Số điện thoại</label>
                    <div className="input-wrapper">
                      <span className="field-value">{formData.phone}</span>
                      <button className="edit-btn">Thay Đổi</button>
                    </div>
                  </div>

                  <div className="form-row">
                    <label>Địa chỉ</label>
                    <div className="input-wrapper">
                      {editMode ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="form-input"
                          rows="3"
                          placeholder="Nhập địa chỉ của bạn"
                        />
                      ) : (
                        <>
                          <span className="field-value">
                            {formData.address || "Chưa có địa chỉ"}
                          </span>
                          <button
                            className="edit-btn"
                            onClick={() => setEditMode(true)}
                          >
                            Thay Đổi
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {editMode && (
                    <div className="form-actions">
                      <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={profileLoading}
                      >
                        {profileLoading ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditMode(false)}
                        disabled={profileLoading}
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  {error && (
                    <div className="error-message">
                      <p>{error}</p>
                      <button onClick={clearError} className="error-close">
                        ×
                      </button>
                    </div>
                  )}
                </div>

                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    <div className="avatar-container">
                      <img
                        src={
                          profileImage ||
                          formData.avatar ||
                          "/images/default-avatar.png"
                        }
                        alt="Avatar"
                        className="avatar-image"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='5'%3EAvatar%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="avatar-input"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="avatar-upload-btn"
                    >
                      {profileLoading ? "Đang tải..." : "Chọn Ảnh"}
                    </label>
                    <div className="avatar-note">
                      <p>Dung lượng file tối đa 1 MB</p>
                      <p>Định dạng: JPEG, PNG</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Địa Chỉ Của Tôi</h2>
            </div>
            <div className="addresses-content">
              {addresses && addresses.length > 0 ? (
                addresses.map((address, index) => (
                  <div key={index} className="address-item">
                    <div className="address-info">
                      <div className="address-header">
                        <span className="address-name">
                          {address.name || formData.name}
                        </span>
                        <span className="address-phone">
                          {address.phone || formData.phone}
                        </span>
                        {address.isDefault && (
                          <span className="address-default">Mặc định</span>
                        )}
                      </div>
                      <div className="address-detail">
                        {address.address || address.fullAddress || address}
                      </div>
                    </div>
                    <div className="address-actions">
                      <button
                        className="edit-address-btn"
                        onClick={() => {
                          // Handle edit address
                          console.log("Edit address:", address);
                        }}
                      >
                        Cập nhật
                      </button>
                    </div>
                  </div>
                ))
              ) : formData.address ? (
                <div className="address-item">
                  <div className="address-info">
                    <div className="address-header">
                      <span className="address-name">{formData.name}</span>
                      <span className="address-phone">{formData.phone}</span>
                      <span className="address-default">Mặc định</span>
                    </div>
                    <div className="address-detail">{formData.address}</div>
                  </div>
                  <div className="address-actions">
                    <button className="edit-address-btn">Cập nhật</button>
                  </div>
                </div>
              ) : (
                <div className="no-addresses">
                  <div className="no-addresses-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <p>Chưa có địa chỉ nào</p>
                </div>
              )}
              <button
                className="add-address-btn"
                onClick={() => {
                  // Handle add address
                  console.log("Add new address");
                }}
              >
                + Thêm Địa Chỉ Mới
              </button>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Thẻ Tín Dụng/Ghi Nợ</h2>
            </div>
            <div className="payment-content">
              <div className="no-payment">
                <div className="no-payment-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <p>Chưa có thẻ nào được liên kết</p>
                <button className="add-card-btn">+ Thêm Thẻ Mới</button>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Đơn Mua</h2>
            </div>
            <div className="orders-tabs">
              <div
                className={`order-tab ${
                  activeOrderTab === "pending" ? "active" : ""
                }`}
                onClick={() => setActiveOrderTab("pending")}
              >
                Chờ xác nhận ({getOrderCount("pending")})
              </div>
              <div
                className={`order-tab ${
                  activeOrderTab === "confirmed" ? "active" : ""
                }`}
                onClick={() => setActiveOrderTab("confirmed")}
              >
                Chờ giao hàng ({getOrderCount("confirmed")})
              </div>
              <div
                className={`order-tab ${
                  activeOrderTab === "shipped" ? "active" : ""
                }`}
                onClick={() => setActiveOrderTab("shipped")}
              >
                Đang giao hàng ({getOrderCount("shipped")})
              </div>
              <div
                className={`order-tab ${
                  activeOrderTab === "delivered" ? "active" : ""
                }`}
                onClick={() => setActiveOrderTab("delivered")}
              >
                Đã nhận ({getOrderCount("delivered")})
              </div>
              <div
                className={`order-tab ${
                  activeOrderTab === "cancelled" ? "active" : ""
                }`}
                onClick={() => setActiveOrderTab("cancelled")}
              >
                Đã hủy ({getOrderCount("cancelled")})
              </div>
            </div>
            <div className="orders-content">
              {ordersLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                  </div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : orders && orders.length > 0 ? (
                getDisplayOrders().length > 0 ? (
                  <div className="orders-list">
                    {getDisplayOrders().map((order) => (
                      <div key={order.orderId} className="order-card">
                        <div className="order-card-header">
                          <div className="order-header-left">
                            <div className="order-id">
                              <i className="fas fa-shopping-bag order-icon"></i>
                              <span className="order-number">
                                Đơn hàng #{order.orderId}
                              </span>
                            </div>
                            <div className="order-date">
                              <i className="fas fa-calendar-alt"></i>
                              <span>
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="order-header-right">
                            <div className="order-status">
                              <span
                                className={`status-badge status-${order.status?.toLowerCase()}`}
                              >
                                <i
                                  className={`fas ${
                                    order.status === "pending"
                                      ? "fa-clock"
                                      : order.status === "confirmed"
                                      ? "fa-check-circle"
                                      : order.status === "shipped"
                                      ? "fa-truck-loading"
                                      : order.status === "delivered"
                                      ? "fa-check-double"
                                      : order.status === "cancelled"
                                      ? "fa-times-circle"
                                      : "fa-hourglass-half"
                                  }`}
                                ></i>
                                {order.status === "pending"
                                  ? "Chờ xác nhận"
                                  : order.status === "confirmed"
                                  ? "Chờ giao hàng"
                                  : order.status === "shipped"
                                  ? "Đang giao hàng"
                                  : order.status === "cancelled"
                                  ? "Đã hủy"
                                  : order.status === "delivered"
                                  ? "Đã nhận"
                                  : order.status || "Đang xử lý"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="order-card-body">
                          <div className="order-info-grid">
                            <div className="info-item">
                              <div className="info-label">
                                <i className="fas fa-money-bill-wave"></i>
                                <span>Tổng tiền</span>
                              </div>
                              <div className="info-value total-amount">
                                {parseInt(order.totalAmount).toLocaleString(
                                  "vi-VN"
                                )}
                                ₫
                              </div>
                            </div>

                            <div className="info-item">
                              <div className="info-label">
                                <i className="fas fa-credit-card"></i>
                                <span>Thanh toán</span>
                              </div>
                              <div className="info-value">
                                {order.paymentMethod === "COD" ||
                                order.paymentMethod === "cod"
                                  ? "COD - Thanh toán khi nhận hàng"
                                  : "Đã thanh toán online"}
                              </div>
                            </div>

                            {order.shippingAddress && (
                              <div className="info-item full-width">
                                <div className="info-label">
                                  <i className="fas fa-map-marker-alt"></i>
                                  <span>Địa chỉ giao hàng</span>
                                </div>
                                <div className="info-value address">
                                  {order.shippingAddress}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="order-card-footer">
                          <div className="order-actions">
                            <button
                              className="btn-secondary"
                              onClick={() => {
                                console.log(
                                  "Contact support for order:",
                                  order.orderId
                                );
                              }}
                            >
                              <i className="fas fa-headset"></i>
                              Liên hệ hỗ trợ
                            </button>

                            {order.status === "pending" && (
                              <button
                                className="btn-outline"
                                onClick={() => handleCancelOrder(order.orderId)}
                                disabled={ordersLoading}
                              >
                                <i className="fas fa-times"></i>
                                {ordersLoading ? "Đang hủy..." : "Hủy đơn"}
                              </button>
                            )}

                            <button
                              className="btn-primary"
                              onClick={() =>
                                handleViewOrderDetail(order.orderId)
                              }
                            >
                              <i className="fas fa-eye"></i>
                              Xem chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-orders-in-tab">
                    <div className="no-orders-illustration">
                      <div className="no-orders-icon">
                        <i className="fas fa-search"></i>
                      </div>
                      <div className="no-orders-content">
                        <h3>Không có đơn hàng trong mục này</h3>
                        <p>
                          {activeOrderTab === "pending" &&
                            "Chưa có đơn hàng nào đang chờ xác nhận"}
                          {activeOrderTab === "confirmed" &&
                            "Chưa có đơn hàng nào đang chờ giao hàng"}
                          {activeOrderTab === "shipped" &&
                            "Chưa có đơn hàng nào đang giao hàng"}
                          {activeOrderTab === "delivered" &&
                            "Chưa có đơn hàng nào đã nhận"}
                          {activeOrderTab === "cancelled" &&
                            "Chưa có đơn hàng nào bị hủy"}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="no-orders">
                  <div className="no-orders-illustration">
                    <div className="no-orders-icon">
                      <i className="fas fa-shopping-bag"></i>
                    </div>
                    <div className="no-orders-content">
                      <h3>Chưa có đơn hàng nào</h3>
                      <p>
                        Hãy khám phá và mua sắm những sản phẩm yêu thích của
                        bạn!
                      </p>
                      <button
                        className="btn-primary start-shopping"
                        onClick={() => (window.location.href = "/")}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Bắt đầu mua sắm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Thông Báo</h2>
            </div>
            <div className="notifications-content">
              <div className="no-notifications">
                <div className="no-notifications-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <p>Không có thông báo mới</p>
              </div>
            </div>
          </div>
        );

      case "vouchers":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Kho Voucher</h2>
            </div>
            <div className="vouchers-content">
              <div className="no-vouchers">
                <div className="no-vouchers-icon">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <p>Chưa có voucher nào</p>
              </div>
            </div>
          </div>
        );

      case "coins":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>PycShop Xu</h2>
            </div>
            <div className="coins-content">
              <div className="coins-balance">
                <div className="balance-card">
                  <div className="balance-icon">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div className="balance-info">
                    <h3>Số dư PycShop Xu</h3>
                    <div className="balance-amount">0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Trang không tồn tại</h2>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <div className="container">
          <div className="profile-layout">
            {/* Sidebar */}
            <aside className="profile-sidebar">
              <div className="profile-user-info">
                <div className="profile-user-avatar">
                  <img
                    src={
                      profileImage ||
                      formData.avatar ||
                      "/images/default-avatar.png"
                    }
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle' dy='3'%3EUser%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="profile-user-details">
                  <div className="profile-username">{formData.name}</div>
                  <div
                    className="profile-edit-link"
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="fas fa-edit"></i>
                    Sửa Hồ Sơ
                  </div>
                </div>
              </div>

              <nav className="sidebar-nav">
                {sidebarMenuItems.map((item, index) => (
                  <div key={index} className="nav-section">
                    {item.isExpandable ? (
                      <>
                        <div className="nav-header">
                          <span className="nav-icon">{item.icon}</span>
                          <span className="nav-title">{item.title}</span>
                        </div>
                        <div className="nav-submenu">
                          {item.subItems.map((subItem) => (
                            <div
                              key={subItem.key}
                              className={`nav-item ${
                                activeTab === subItem.key ? "active" : ""
                              }`}
                              onClick={() => setActiveTab(subItem.key)}
                            >
                              <span className="nav-subicon">
                                {subItem.icon}
                              </span>
                              <span className="nav-label">{subItem.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div
                        className={`nav-item ${
                          activeTab === item.key ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(item.key)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-title">{item.title}</span>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="profile-main">{renderMainContent()}</main>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={showOrderDetail}
        onClose={handleCloseOrderDetail}
      />

      <Footer />
    </div>
  );
};

export default Profile;
