import React, { useState } from "react";
import { DashboardLayout, Card, Button, Input } from "../..";
import { useAuth } from "../../hooks/useAuth";

const Settings = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const isAdmin = user?.role === "admin";
  const isSeller = user?.role === "seller";

  // Navigation based on user role
  const navigation = isAdmin
    ? [
        {
          name: "Dashboard",
          href: "/admin",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
          ),
        },
        {
          name: "Cài đặt",
          href: "/admin/settings",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
        },
      ]
    : [
        {
          name: "Dashboard",
          href: isSeller ? "/seller" : "/buyer",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
              />
            </svg>
          ),
        },
        {
          name: "Cài đặt",
          href: `/${user?.role}/settings`,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
        },
      ];

  // Settings tabs
  const tabs = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      key: "security",
      label: "Bảo mật",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      key: "notifications",
      label: "Thông báo",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5zM9.586 3H5a2 2 0 00-2 2v4.586a1 1 0 00.293.707L9 16l5.707-5.707A1 1 0 0015 9.586V5a2 2 0 00-2-2h-4.586z"
          />
        </svg>
      ),
    },
  ];

  // Add shop settings for sellers
  if (isSeller) {
    tabs.splice(1, 0, {
      key: "shop",
      label: "Cửa hàng",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    });
  }

  // Add system settings for admins
  if (isAdmin) {
    tabs.push({
      key: "system",
      label: "Hệ thống",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
    });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={user} />;
      case "shop":
        return isSeller ? <ShopSettings user={user} /> : null;
      case "security":
        return <SecuritySettings user={user} />;
      case "notifications":
        return <NotificationSettings user={user} />;
      case "system":
        return isAdmin ? <SystemSettings user={user} /> : null;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation} onLogout={logout}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý cài đặt tài khoản và hệ thống
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{renderTabContent()}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Profile Settings Component
const ProfileSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    console.log("Updating profile:", formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Thông tin cá nhân
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Họ và tên"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <Input
            label="Số điện thoại"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />

          <Input
            label="Địa chỉ"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Cập nhật thông tin</Button>
        </div>
      </form>
    </Card>
  );
};

// Shop Settings Component
const ShopSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    shopName: user?.shopName || "",
    shopDescription: user?.shopDescription || "",
    shopAddress: user?.shopAddress || "",
    shopPhone: user?.shopPhone || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle shop update
    console.log("Updating shop:", formData);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Thông tin cửa hàng
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Tên cửa hàng"
          value={formData.shopName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, shopName: e.target.value }))
          }
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả cửa hàng
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            value={formData.shopDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                shopDescription: e.target.value,
              }))
            }
            placeholder="Mô tả về cửa hàng của bạn"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Địa chỉ cửa hàng"
            value={formData.shopAddress}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shopAddress: e.target.value }))
            }
          />

          <Input
            label="Số điện thoại cửa hàng"
            value={formData.shopPhone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, shopPhone: e.target.value }))
            }
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Cập nhật cửa hàng</Button>
        </div>
      </form>
    </Card>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu mới không khớp");
      return;
    }
    // Handle password change
    console.log("Changing password");
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Đổi mật khẩu</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
          required
        />

        <Input
          label="Mật khẩu mới"
          type="password"
          value={formData.newPassword}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          required
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          required
        />

        <div className="flex justify-end">
          <Button type="submit">Đổi mật khẩu</Button>
        </div>
      </form>
    </Card>
  );
};

// Notification Settings Component
const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailOrders: true,
    emailPromotions: false,
    pushOrders: true,
    pushPromotions: true,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Cài đặt thông báo
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">Email</h4>
          <div className="space-y-4">
            {[
              { key: "emailOrders", label: "Thông báo đơn hàng" },
              { key: "emailPromotions", label: "Khuyến mãi và ưu đãi" },
            ].map((item) => (
              <label key={item.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Push Notification
          </h4>
          <div className="space-y-4">
            {[
              { key: "pushOrders", label: "Thông báo đơn hàng" },
              { key: "pushPromotions", label: "Khuyến mãi và ưu đãi" },
            ].map((item) => (
              <label key={item.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() =>
              console.log("Saving notification settings:", settings)
            }
          >
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </Card>
  );
};

// System Settings Component
const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenance: false,
    registrationEnabled: true,
    emailVerification: true,
    maxFileSize: 10,
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Cài đặt hệ thống
      </h3>

      <div className="space-y-6">
        <div className="space-y-4">
          {[
            {
              key: "maintenance",
              label: "Chế độ bảo trì",
              description: "Tạm thời tắt website cho người dùng thường",
            },
            {
              key: "registrationEnabled",
              label: "Cho phép đăng ký",
              description: "Người dùng có thể tạo tài khoản mới",
            },
            {
              key: "emailVerification",
              label: "Xác thực email",
              description: "Yêu cầu xác thực email khi đăng ký",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Input
          label="Kích thước file tối đa (MB)"
          type="number"
          value={settings.maxFileSize}
          onChange={(e) =>
            setSettings((prev) => ({
              ...prev,
              maxFileSize: parseInt(e.target.value),
            }))
          }
          min="1"
          max="100"
        />

        <div className="flex justify-end">
          <Button
            onClick={() => console.log("Saving system settings:", settings)}
          >
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Settings;
