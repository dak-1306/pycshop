import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import apiService from "../../services/apiService";

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

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await apiService.get("/products/categories");
        if (response && response.data) {
          setCategories(response.data);
        } else {
          // Fallback categories if API fails
          setCategories([
            { ID_DanhMuc: 1, TenDanhMuc: "Thời Trang Nam" },
            { ID_DanhMuc: 2, TenDanhMuc: "Thời Trang Nữ" },
            { ID_DanhMuc: 3, TenDanhMuc: "Điện Thoại & Phụ Kiện" },
            { ID_DanhMuc: 4, TenDanhMuc: "Máy Tính & Laptop" },
            { ID_DanhMuc: 18, TenDanhMuc: "Nhà Sách Online" },
            { ID_DanhMuc: 19, TenDanhMuc: "Bách Hóa Online" },
          ]);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback categories
        setCategories([
          { ID_DanhMuc: 1, TenDanhMuc: "Thời Trang Nam" },
          { ID_DanhMuc: 2, TenDanhMuc: "Thời Trang Nữ" },
          { ID_DanhMuc: 3, TenDanhMuc: "Điện Thoại & Phụ Kiện" },
          { ID_DanhMuc: 4, TenDanhMuc: "Máy Tính & Laptop" },
          { ID_DanhMuc: 18, TenDanhMuc: "Nhà Sách Online" },
          { ID_DanhMuc: 19, TenDanhMuc: "Bách Hóa Online" },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.shopName.trim()) {
      alert("Vui lòng nhập tên shop");
      return;
    }

    if (!formData.shopDescription.trim()) {
      alert("Vui lòng nhập mô tả shop");
      return;
    }

    if (!formData.shopCategory) {
      alert("Vui lòng chọn danh mục shop");
      return;
    }

    if (!formData.shopAddress.trim()) {
      alert("Vui lòng nhập địa chỉ shop");
      return;
    }

    if (!formData.shopPhone.trim()) {
      alert("Vui lòng nhập số điện thoại shop");
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

      const result = await authService.becomeSeller(formData);
      console.log("becomeSeller result:", result);

      if (result.success) {
        alert("Đăng ký thành seller thành công!");
        // Redirect to seller dashboard
        navigate("/seller/dashboard");
      } else {
        alert(result.message || "Có lỗi xảy ra trong quá trình đăng ký");
      }
    } catch (error) {
      console.error("Become seller error:", error);
      console.error("Error details:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
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
                  key={category.ID_DanhMuc || category}
                  value={category.TenDanhMuc || category}
                >
                  {category.TenDanhMuc || category}
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
