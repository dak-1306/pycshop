import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useProfile } from "../../../hooks/user/useProfile.js";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, loading, login } = useAuth();
  const { 
    profile, 
    addresses,
    loading: profileLoading, 
    uploading, 
    error,
    updateProfile, 
    uploadAvatar,
    clearError 
  } = useProfile();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "Người dùng PycShop",
    email: "user@pycshop.com",
    phone: "0123456789",
    gender: "male",
    birthDate: "1990-01-01",
    address: "TP.HCM, Việt Nam",
    avatar: null
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
      Avatar: null
    };

    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJidXllciIsImlhdCI6MTYzNzM0NTY3OH0.mock_token_for_testing";
    login(mockUserData, mockToken);
  };

  useEffect(() => {
    const currentUser = profile || user;
    if (currentUser) {
      setFormData({
        name: currentUser.TenDangNhap || currentUser.HoTen || "Người dùng PycShop",
        email: currentUser.Email || "user@pycshop.com", 
        phone: currentUser.SoDienThoai || "0123456789",
        gender: currentUser.GioiTinh || "male",
        birthDate: currentUser.NgaySinh || "1990-01-01",
        address: currentUser.DiaChi || "TP.HCM, Việt Nam",
        avatar: currentUser.Avatar || null
      });
      setProfileImage(currentUser.Avatar);
    }
  }, [profile, user]);

  // Show login prompt if not authenticated
  if (!loading && (!isAuthenticated || !user)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div>
          <i className="fas fa-user-circle" style={{ fontSize: '4rem', marginBottom: '20px', color: '#ffd700' }}></i>
          <h1>Database Profile Test</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Click để test profile với database
          </p>
          <button 
            onClick={handleQuickLogin}
            style={{
              padding: '15px 30px',
              background: '#28a745',
              color: 'white', 
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
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

      // Upload to server
      try {
        await uploadAvatar(file);
        // Profile will be refreshed automatically by the hook
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        // Revert preview on error
        setProfileImage(formData.avatar);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birthDate: formData.birthDate,
        address: formData.address
      });
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Keep edit mode open on error
    }
  };

  const sidebarMenuItems = [
    {
      icon: <i className="fas fa-user"></i>,
      title: "Tài khoản của tôi",
      isExpandable: true,
      subItems: [
        { key: "profile", label: "Hồ Sơ", icon: <i className="fas fa-edit"></i> },
        { key: "addresses", label: "Địa Chỉ", icon: <i className="fas fa-map-marker-alt"></i> },
        { key: "payment", label: "Thẻ Tín Dụng/Ghi Nợ", icon: <i className="fas fa-credit-card"></i> },
      ]
    },
    { icon: <i className="fas fa-shopping-bag"></i>, title: "Đơn Mua", key: "orders" },
    { icon: <i className="fas fa-bell"></i>, title: "Thông Báo", key: "notifications" },
    { icon: <i className="fas fa-ticket-alt"></i>, title: "Kho Voucher", key: "vouchers" },
    { icon: <i className="fas fa-coins"></i>, title: "PycShop Xu", key: "coins" },
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
                    <button 
                      className="save-btn" 
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                    <button 
                      className="cancel-btn" 
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Hủy
                    </button>
                  </div>
                )}

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                    <button onClick={clearError} className="error-close">×</button>
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
                    {uploading ? "Đang tải..." : "Chọn Ảnh"}
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
              {addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <div key={address.id} className="address-item">
                    <div className="address-info">
                      <div className="address-header">
                        <span className="address-name">{address.name || formData.name}</span>
                        <span className="address-phone">{address.phone || formData.phone}</span>
                        {address.isDefault && <span className="address-default">Mặc định</span>}
                      </div>
                      <div className="address-detail">
                        {address.address || address.fullAddress}
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
              ) : (
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
                <div className="no-orders-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
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
                    src={profileImage || formData.avatar || "/images/default-avatar.png"}
                    alt="User Avatar"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='10' fill='%23999' text-anchor='middle' dy='3'%3EUser%3C/text%3E%3C/svg%3E";
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

export default Profile;