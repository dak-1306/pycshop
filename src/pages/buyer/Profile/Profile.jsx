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
    name: "Trần Hoàng Phương",
    email: "ph***********@gmail.com",
    phone: "*******72",
    gender: "male",
    birthDate: "*/*/2005",
  });

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

  const renderProfileContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-form-container">
            <div className="profile-form-header">
              <h2>Hồ Sơ Của Tôi</h2>
              <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <label>Tên đăng nhập</label>
                <div className="form-value">
                  <span>{user?.username || "phuongji1108"}</span>
                </div>
              </div>

              <div className="form-row">
                <label>Tên</label>
                <div className="form-value">
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <span>{formData.name}</span>
                      <button
                        className="change-btn"
                        onClick={() => setEditMode(true)}
                      >
                        Thay Đổi
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <label>Email</label>
                <div className="form-value">
                  <div className="form-display">
                    <span>{formData.email}</span>
                    <button className="change-btn">Thay Đổi</button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label>Số điện thoại</label>
                <div className="form-value">
                  <div className="form-display">
                    <span>{formData.phone}</span>
                    <button className="change-btn">Thay Đổi</button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label>Giới tính</label>
                <div className="form-value">
                  <div className="gender-options">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleInputChange}
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
