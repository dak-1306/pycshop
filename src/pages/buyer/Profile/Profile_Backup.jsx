import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import "../../../styles/pages/buyer/Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.TenDangNhap || "Người dùng PycShop",
    email: user?.Email || "user@pycshop.com",
    phone: user?.SoDienThoai || "0123456789",
    gender: "male",
    birthDate: "01/01/1990",
    address: "TP.HCM, Việt Nam",
    avatar: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.TenDangNhap || "Người dùng PycShop",
        email: user.Email || "user@pycshop.com", 
        phone: user.SoDienThoai || "0123456789",
        gender: user.GioiTinh || "male",
        birthDate: user.NgaySinh || "01/01/1990",
        address: user.DiaChi || "TP.HCM, Việt Nam",
        avatar: user.Avatar || null
      });
      setProfileImage(user.Avatar);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditMode(false);
    console.log("Saving data:", formData);
  };

  const sidebarMenuItems = [
    {
      icon: "👤",
      title: "Tài khoản của tôi",
      isExpandable: true,
      subItems: [
        { key: "profile", label: "Hồ Sơ", icon: "📝" },
        { key: "addresses", label: "Địa Chỉ", icon: "📍" },
        { key: "payment", label: "Thẻ Tín Dụng/Ghi Nợ", icon: "💳" },
      ]
    },
    { icon: "📦", title: "Đơn Mua", key: "orders" },
    { icon: "🔔", title: "Thông Báo", key: "notifications" },
    { icon: "🎫", title: "Kho Voucher", key: "vouchers" },
    { icon: "💰", title: "PycShop Xu", key: "coins" },
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
                  <label>Giới tính</label>
                  <div className="gender-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-text">Nam</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-text">Nữ</span>
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleInputChange}
                      />
                      <span className="radio-text">Khác</span>
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <label>Ngày sinh</label>
                  <div className="input-wrapper">
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button className="save-btn" onClick={handleSave}>
                      Lưu
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={() => setEditMode(false)}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>

              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <div className="avatar-container">
                    <img
                      src={profileImage || formData.avatar || "/images/default-avatar.png"}
                      alt="Avatar"
                      className="avatar-image"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='12' fill='%23999' text-anchor='middle' dy='5'%3EAvatar%3C/text%3E%3C/svg%3E";
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
                  <label htmlFor="avatar-upload" className="avatar-upload-btn">
                    Chọn Ảnh
                  </label>
                  <div className="avatar-note">
                    <p>Dung lượng file tối đa 1 MB</p>
                    <p>Định dạng: JPEG, PNG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "addresses":
        return (
          <div className="profile-content">
            <div className="profile-header">
              <h2>Địa Chỉ Của Tôi</h2>
            </div>
            <div className="addresses-content">
              <div className="address-item">
                <div className="address-info">
                  <div className="address-header">
                    <span className="address-name">{formData.name}</span>
                    <span className="address-phone">{formData.phone}</span>
                    <span className="address-default">Mặc định</span>
                  </div>
                  <div className="address-detail">
                    {formData.address}
                  </div>
                </div>
                <div className="address-actions">
                  <button className="edit-address-btn">Cập nhật</button>
                </div>
              </div>
              <button className="add-address-btn">+ Thêm Địa Chỉ Mới</button>
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
                <div className="no-payment-icon">💳</div>
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
              <div className="order-tab active">Tất cả</div>
              <div className="order-tab">Chờ thanh toán</div>
              <div className="order-tab">Vận chuyển</div>
              <div className="order-tab">Chờ giao hàng</div>
              <div className="order-tab">Hoàn thành</div>
              <div className="order-tab">Đã hủy</div>
              <div className="order-tab">Trả hàng/Hoàn tiền</div>
            </div>
            <div className="orders-content">
              <div className="no-orders">
                <div className="no-orders-icon">📦</div>
                <p>Chưa có đơn hàng</p>
              </div>
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
                <div className="no-notifications-icon">🔔</div>
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
                <div className="no-vouchers-icon">🎫</div>
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
                  <div className="balance-icon">💰</div>
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
              <div className="user-info">
                <div className="user-avatar">
                  <img
                    src={profileImage || formData.avatar || "/images/default-avatar.png"}
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle' dy='3'%3EUser%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="user-details">
                  <div className="username">{formData.name}</div>
                  <div className="edit-profile">
                    <span className="edit-icon">✏️</span>
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
                              <span className="nav-subicon">{subItem.icon}</span>
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
            <main className="profile-main">
              {renderMainContent()}
            </main>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleInputChange}
                      />
                      Nữ
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleInputChange}
                      />
                      Khác
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label>Ngày sinh</label>
                <div className="form-value">
                  <input
                    type="text"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="*/*/2005"
                  />
                  <button className="change-btn">Thay Đổi</button>
                </div>
              </div>

              <div className="form-actions">
                {editMode ? (
                  <>
                    <button onClick={handleSave} className="btn-save">
                      Lưu
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="btn-cancel"
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="btn-edit"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Ngân Hàng</h2>
              <p>Quản lý thông tin ngân hàng của bạn</p>
            </div>
            <div className="empty-state">
              <i className="fas fa-university"></i>
              <p>Chưa có thông tin ngân hàng</p>
            </div>
          </div>
        );

      case "address":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Địa Chỉ</h2>
              <p>Quản lý địa chỉ giao hàng</p>
            </div>
            <div className="empty-state">
              <i className="fas fa-map-marker-alt"></i>
              <p>Chưa có địa chỉ giao hàng</p>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Đổi Mật Khẩu</h2>
              <p>
                Để bảo mật tài khoản, bạn vui lòng không chia sẻ mật khẩu cho
                người khác
              </p>
            </div>
            <div className="profile-form">
              <div className="form-row">
                <label>Mật khẩu hiện tại</label>
                <input type="password" className="form-input" />
              </div>
              <div className="form-row">
                <label>Mật khẩu mới</label>
                <input type="password" className="form-input" />
              </div>
              <div className="form-row">
                <label>Xác nhận mật khẩu</label>
                <input type="password" className="form-input" />
              </div>
              <div className="form-actions">
                <button className="btn-save">Xác nhận</button>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Thông Báo</h2>
              <p>Cài đặt thông báo</p>
            </div>
            <div className="empty-state">
              <i className="fas fa-bell"></i>
              <p>Không có thông báo mới</p>
            </div>
          </div>
        );

      case "vouchers":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Kho Voucher</h2>
              <p>Quản lý voucher của bạn</p>
            </div>
            <div className="empty-state">
              <i className="fas fa-ticket-alt"></i>
              <p>Chưa có voucher nào</p>
            </div>
          </div>
        );

      case "coins":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Shopee Xu</h2>
              <p>Quản lý Shopee Xu của bạn</p>
            </div>
            <div className="empty-state">
              <i className="fas fa-coins"></i>
              <p>Bạn có 0 Shopee Xu</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="profile-avatar">
              <img
                src={profileImage || ""}
                alt="Avatar"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
              <div className="avatar-edit">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="avatar-upload-btn">
                  <i className="fas fa-camera"></i>
                </label>
              </div>
            </div>
            <div className="user-details">
              <h3>{user?.username || "phuongji1108"}</h3>
              <p className="user-edit-link">
                <i className="fas fa-edit"></i>
                Sửa hồ sơ
              </p>
            </div>
          </div>

          <div className="profile-menu">
            <div
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i>
              <span>Tài Khoản Của Tôi</span>
            </div>
            <div className="menu-submenu">
              <div
                className={`submenu-item ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Hồ Sơ
              </div>
              <div
                className={`submenu-item ${
                  activeTab === "bank" ? "active" : ""
                }`}
                onClick={() => setActiveTab("bank")}
              >
                Ngân Hàng
              </div>
              <div
                className={`submenu-item ${
                  activeTab === "address" ? "active" : ""
                }`}
                onClick={() => setActiveTab("address")}
              >
                Địa Chỉ
              </div>
              <div
                className={`submenu-item ${
                  activeTab === "password" ? "active" : ""
                }`}
                onClick={() => setActiveTab("password")}
              >
                Đổi Mật Khẩu
              </div>
            </div>

            <div
              className={`menu-item ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <i className="fas fa-bell"></i>
              <span>Thông Báo</span>
            </div>

            <div
              className={`menu-item ${
                activeTab === "vouchers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("vouchers")}
            >
              <i className="fas fa-ticket-alt"></i>
              <span>Kho Voucher</span>
            </div>

            <div
              className={`menu-item ${activeTab === "coins" ? "active" : ""}`}
              onClick={() => setActiveTab("coins")}
            >
              <i className="fas fa-coins"></i>
              <span>Shopee Xu</span>
            </div>
          </div>
        </div>

        <div className="profile-content">{renderProfileContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
