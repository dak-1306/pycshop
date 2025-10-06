import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout, Button, Input, Select, Card } from "../../components";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const ProductForm = () => {
  const { user, logout } = useAuth();
  const { canAccess } = usePermissions();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = !!id;
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    status: "active",
  });

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
          name: "Sản phẩm",
          href: "/admin/products",
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l5-3v12m0-12l6 3v12"
              />
            </svg>
          ),
        },
      ]
    : [
        {
          name: "Dashboard",
          href: "/seller",
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
          name: "Sản phẩm của tôi",
          href: "/seller/products",
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l5-3v12m0-12l6 3v12"
              />
            </svg>
          ),
        },
      ];

  // Categories options
  const categoryOptions = [
    { value: "", label: "Chọn danh mục" },
    { value: "electronics", label: "Điện tử" },
    { value: "fashion", label: "Thời trang" },
    { value: "home", label: "Nhà cửa & Đời sống" },
    { value: "sports", label: "Thể thao & Du lịch" },
    { value: "beauty", label: "Làm đẹp" },
    { value: "books", label: "Sách" },
    { value: "toys", label: "Đồ chơi" },
  ];

  const statusOptions = [
    { value: "active", label: "Đang bán" },
    { value: "inactive", label: "Ngừng bán" },
    { value: "draft", label: "Bản nháp" },
  ];

  // Load product data for editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockProduct = {
          name: "iPhone 15 Pro Max",
          description: "Điện thoại thông minh cao cấp với chip A17 Pro",
          price: "29990000",
          stock: "15",
          category: "electronics",
          status: "active",
          images: [],
        };
        setFormData(mockProduct);
        setLoading(false);
      }, 1000);
    }
  }, [isEditing, id]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canAccess("products", isEditing ? "update" : "create")) {
      alert("Bạn không có quyền thực hiện hành động này");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        isEditing
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm thành công!"
      );
      navigate(isAdmin ? "/admin/products" : "/seller/products");
    } catch (error) {
      alert("Có lỗi xảy ra: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
    console.log("Uploading images:", files);
  };

  if (loading && isEditing) {
    return (
      <DashboardLayout user={user} navigation={navigation} onLogout={logout}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} navigation={navigation} onLogout={logout}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditing
                ? "Cập nhật thông tin sản phẩm"
                : "Thêm sản phẩm mới vào cửa hàng của bạn"}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() =>
              navigate(isAdmin ? "/admin/products" : "/seller/products")
            }
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic information */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Tên sản phẩm"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập tên sản phẩm"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả sản phẩm
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Mô tả chi tiết về sản phẩm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Giá (VNĐ)"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                    />

                    <Input
                      label="Số lượng tồn kho"
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Images */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Hình ảnh sản phẩm
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                          <span>Tải lên hình ảnh</span>
                          <input
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category and status */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Phân loại
                </h3>
                <div className="space-y-4">
                  <Select
                    label="Danh mục"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    options={categoryOptions}
                    required
                  />

                  <Select
                    label="Trạng thái"
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    options={statusOptions}
                    required
                  />
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6">
                <div className="space-y-4">
                  <Button type="submit" loading={loading} className="w-full">
                    {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate(isAdmin ? "/admin/products" : "/seller/products")
                    }
                    className="w-full"
                  >
                    Hủy bỏ
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProductForm;
