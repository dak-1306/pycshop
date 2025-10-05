import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/buyers/Header";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "Trần Hoàng Phương",
    email: user?.email || "phuongji1108",
    phone: user?.phone || "********72",
    gender: user?.gender || "Nam",
    birthday: user?.birthday || "**/*/2005",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const menuItems = [
    {
      id: "notifications",
      label: "Thông Báo",
      icon: "fas fa-bell",
      isActive: false,
    },
    {
      id: "account",
      label: "Tài Khoản Của Tôi",
      icon: "fas fa-user",
      isActive: true,
      submenu: [
        { id: "profile", label: "Hồ Sơ", isActive: true },
        { id: "bank", label: "Ngân Hàng" },
        { id: "address", label: "Địa Chỉ" },
        { id: "password", label: "Đổi Mật Khẩu" },
        { id: "settings", label: "Cài Đặt Thông Báo" },
        { id: "privacy", label: "Những Thiết Lập Riêng Tư" },
        { id: "personal", label: "Thông Tin Cá Nhân" },
      ],
    },
    {
      id: "orders",
      label: "Đơn Mua",
      icon: "fas fa-clipboard-list",
      isActive: false,
    },
    {
      id: "vouchers",
      label: "Kho Voucher",
      icon: "fas fa-ticket-alt",
      isActive: false,
    },
    {
      id: "coins",
      label: "PycShop Xu",
      icon: "fas fa-coins",
      isActive: false,
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
                    value={formData.email}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
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
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="Nam"
                      checked={formData.gender === "Nam"}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                    <span>Nam</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="Nữ"
                      checked={formData.gender === "Nữ"}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                    <span>Nữ</span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="gender"
                      value="Khác"
                      checked={formData.gender === "Khác"}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                    <span>Khác</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className={`form-input ${!editMode ? "disabled" : ""}`}
                    placeholder="dd/mm/yyyy"
                  />
                  <button className="btn-link">Thay Đổi</button>
                </div>
              </div>

              <div className="form-actions">
                {editMode ? (
                  <>
                    <button 
                      className="btn-save"
                      onClick={handleSave}
                    >
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
                <div className="avatar-image">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>
                <div className="avatar-info">
                  <button 
                    className="btn-choose-image"
                    onClick={() => document.getElementById('avatar-input').click()}
                  >
                    Chọn Ảnh
                  </button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div className="image-requirements">
                    <p>Dung lượng file tối đa 1 MB</p>
                    <p>Định dạng: JPEG, PNG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Render other tabs content
    return (
      <div className="profile-content">
        <div className="coming-soon">
          <i className="fas fa-tools"></i>
          <h3>Đang phát triển</h3>
          <p>Tính năng này đang được phát triển</p>
        </div>
      </div>
    );
  };

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
