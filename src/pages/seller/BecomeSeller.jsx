import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import ShopService from "../../services/shopService";

const BecomeSeller = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      alert("Vui lòng đăng nhập trước khi đăng ký seller");
      navigate("/auth/login");
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopCategory: "",
    shopAddress: "",
    shopPhone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Load categories from Shop Service
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await ShopService.getCategories();
        if (response && response.success && response.categories) {
          setCategories(response.categories);
        } else {
          // Fallback categories if API fails
          setCategories([
            { id: 1, name: "Thời Trang Nam" },
            { id: 2, name: "Thời Trang Nữ" },
            { id: 3, name: "Điện Thoại & Phụ Kiện" },
            { id: 4, name: "Máy Tính & Laptop" },
            { id: 18, name: "Nhà Sách Online" },
            { id: 19, name: "Bách Hóa Online" },
          ]);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback categories
        setCategories([
          { id: 1, name: "Thời Trang Nam" },
          { id: 2, name: "Thời Trang Nữ" },
          { id: 3, name: "Điện Thoại & Phụ Kiện" },
          { id: 4, name: "Máy Tính & Laptop" },
          { id: 18, name: "Nhà Sách Online" },
          { id: 19, name: "Bách Hóa Online" },
        ]);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.shopName.trim()) {
      errors.push("Tên shop không được để trống");
    }

    if (!formData.shopDescription.trim()) {
      errors.push("Mô tả shop không được để trống");
    }

    if (!formData.shopCategory) {
      errors.push("Vui lòng chọn danh mục shop");
    }

    if (!formData.shopAddress.trim()) {
      errors.push("Địa chỉ shop không được để trống");
    }

    if (!formData.shopPhone.trim()) {
      errors.push("Số điện thoại shop không được để trống");
    } else {
      // Validate phone number format
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.shopPhone.trim())) {
        errors.push("Số điện thoại phải có 10-11 chữ số");
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.shopPhone)) {
      alert("Số điện thoại không hợp lệ");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending data to becomeSeller:", formData);
      console.log("Current user:", authService.getCurrentUser());
      console.log("Is authenticated:", authService.isAuthenticated());

      const result = await ShopService.becomeSeller(formData);
      console.log("becomeSeller result:", result);

      if (result.success) {
        // Update user context with new token if provided
        if (result.token) {
          authService.setToken(result.token);
        }

        alert("Đăng ký thành seller thành công!");
        // Redirect to seller dashboard
        navigate("/seller/dashboard");
      } else {
        alert(result.message || "Có lỗi xảy ra trong quá trình đăng ký");
      }
    } catch (error) {
      console.error("Become seller error:", error);
      console.error("Error details:", error);

      // Handle specific error messages
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Đăng ký trở thành Seller
          </h1>
          <p className="text-gray-600 mt-2">
            Điền thông tin shop của bạn để bắt đầu bán hàng
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Name */}
          <div>
            <label
              htmlFor="shopName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tên Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên shop của bạn"
              required
            />
          </div>

          {/* Shop Description */}
          <div>
            <label
              htmlFor="shopDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mô tả Shop <span className="text-red-500">*</span>
            </label>
            <textarea
              id="shopDescription"
              name="shopDescription"
              value={formData.shopDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Mô tả về shop và sản phẩm của bạn"
              required
            />
          </div>

          {/* Shop Category */}
          <div>
            <label
              htmlFor="shopCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Danh mục Shop <span className="text-red-500">*</span>
            </label>
            <select
              id="shopCategory"
              name="shopCategory"
              value={formData.shopCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Chọn danh mục shop</option>
              {categories.map((category) => (
                <option
                  key={category.id || category.ID_DanhMuc}
                  value={category.name || category.TenDanhMuc}
                >
                  {category.name || category.TenDanhMuc}
                </option>
              ))}
            </select>
          </div>

          {/* Shop Address */}
          <div>
            <label
              htmlFor="shopAddress"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Địa chỉ Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="shopAddress"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập địa chỉ shop của bạn"
              required
            />
          </div>

          {/* Shop Phone */}
          <div>
            <label
              htmlFor="shopPhone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số điện thoại Shop <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="shopPhone"
              name="shopPhone"
              value={formData.shopPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số điện thoại liên hệ"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allow"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký Seller"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeSeller;
