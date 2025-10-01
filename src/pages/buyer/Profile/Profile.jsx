import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/buyers/Header";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    gender: user?.gender || "male",
    birthday: user?.birthday || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Gọi API để cập nhật thông tin user
    console.log("Save user data:", formData);
    setEditMode(false);
  };

  const menuItems = [
    {
      id: "profile",
      label: "Hồ Sơ Của Tôi",
      icon: "fas fa-user",
      submenu: [
        { id: "profile", label: "Hồ Sơ" },
        { id: "address", label: "Địa Chỉ" },
        { id: "password", label: "Đổi Mật Khẩu" },
      ],
    },
    {
      id: "orders",
      label: "Đơn Mua",
      icon: "fas fa-shopping-bag",
      submenu: [
        { id: "all", label: "Tất cả" },
        { id: "pending", label: "Chờ thanh toán" },
        { id: "processing", label: "Vận chuyển" },
        { id: "completed", label: "Hoàn thành" },
        { id: "cancelled", label: "Đã hủy" },
      ],
    },
    {
      id: "notifications",
      label: "Thông Báo",
      icon: "fas fa-bell",
    },
    {
      id: "vouchers",
      label: "Kho Voucher",
      icon: "fas fa-ticket-alt",
    },
    {
      id: "coins",
      label: "PycShop Xu",
      icon: "fas fa-coins",
    },
  ];

  const renderProfileContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="profile-content">
          <div className="profile-header">
            <h2>Hồ Sơ Của Tôi</h2>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          </div>

          <div className="profile-body">
            <div className="profile-form">
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={user?.email || ""}
                    disabled
                    className="form-input disabled"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tên</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
                  />
                  <button className="btn-link">Thay Đổi</button>
                </div>
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
                  />
                  <button className="btn-link">Thay Đổi</button>
                </div>
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                    Nam
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleInputChange}
                      disabled={!editMode}
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
                      disabled={!editMode}
                    />
                    Khác
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <div className="input-wrapper">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
                  />
                </div>
              </div>

              <div className="form-actions">
                {editMode ? (
                  <>
                    <button className="btn-save" onClick={handleSave}>
                      Lưu
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditMode(false)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-edit"
                    onClick={() => setEditMode(true)}
                  >
                    Sửa
                  </button>
                )}
              </div>
            </div>

            <div className="profile-avatar">
              <div className="avatar-container">
                <div className="avatar-circle">
                  <i className="fas fa-user"></i>
                </div>
                <button className="btn-upload">Chọn Ảnh</button>
                <p className="avatar-note">
                  Dung lượng file tối đa 1 MB
                  <br />
                  Định dạng: .JPEG, .PNG
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "orders" || activeTab === "all") {
      return (
        <div className="orders-content">
          <div className="orders-header">
            <h2>Đơn Hàng Của Tôi</h2>
          </div>
          <div className="orders-tabs">
            {menuItems
              .find((item) => item.id === "orders")
              .submenu.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
          </div>
          <div className="orders-list">
            <div className="empty-state">
              <i className="fas fa-shopping-bag"></i>
              <p>Chưa có đơn hàng</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="coming-soon">
        <i className="fas fa-tools"></i>
        <h3>Tính năng đang phát triển</h3>
        <p>Chúng tôi đang cố gắng hoàn thiện tính năng này</p>
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        <div className="profile-wrapper">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-user-info">
              <div className="profile-user-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="profile-user-details">
                <h3>{user?.name || "Người dùng"}</h3>
                <p>
                  <i className="fas fa-edit"></i>
                  Sửa Hồ Sơ
                </p>
              </div>
            </div>

            <nav className="profile-nav">
              {menuItems.map((item) => (
                <div key={item.id} className="nav-item">
                  <div
                    className={`nav-link ${
                      activeTab === item.id ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <div className="submenu">
                      {item.submenu.map((subitem) => (
                        <div
                          key={subitem.id}
                          className={`submenu-link ${
                            activeTab === subitem.id ? "active" : ""
                          }`}
                          onClick={() => setActiveTab(subitem.id)}
                        >
                          {subitem.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-main">{renderProfileContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
