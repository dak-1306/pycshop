import Seller from "../../models/seller/SellerModel.js";
import Product from "../../models/buyer/getProductModel.js";

// Get seller shop information
export const getShopInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log(`[SELLER_CONTROLLER] Get shop info for seller: ${sellerId}`);

    const shopInfo = await Seller.getShopInfo(sellerId);

    if (!shopInfo) {
      // Seller chưa có cửa hàng - trả về empty data thay vì lỗi
      return res.json({
        success: true,
        data: null,
        message:
          "Bạn chưa có thông tin cửa hàng. Vui lòng cập nhật thông tin cửa hàng.",
      });
    }

    console.log(`[SELLER_CONTROLLER] Found shop: ${shopInfo.TenCuaHang}`);

    res.json({
      success: true,
      data: shopInfo,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getShopInfo:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin cửa hàng",
      error: error.message,
    });
  }
};

// Update shop information (or create if not exists)
export const updateShopInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { tenCuaHang, danhMuc, diaChi, soDienThoai } = req.body;

    console.log(
      `[SELLER_CONTROLLER] Update/Create shop info for seller: ${sellerId}`
    );

    // Validate required fields
    if (!tenCuaHang || !danhMuc || !diaChi || !soDienThoai) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cửa hàng",
      });
    }

    // Check if shop exists
    const existingShop = await Seller.getShopInfo(sellerId);
    let result;

    if (existingShop) {
      // Update existing shop
      result = await Seller.updateShopInfo(sellerId, {
        tenCuaHang,
        danhMuc,
        diaChi,
        soDienThoai,
      });

      if (!result) {
        return res.status(400).json({
          success: false,
          message: "Không thể cập nhật thông tin cửa hàng",
        });
      }

      console.log(`[SELLER_CONTROLLER] Shop info updated successfully`);

      res.json({
        success: true,
        message: "Cập nhật thông tin cửa hàng thành công",
      });
    } else {
      // Create new shop
      const shopId = await Seller.createShop(sellerId, {
        tenCuaHang,
        danhMuc,
        diaChi,
        soDienThoai,
      });

      console.log(`[SELLER_CONTROLLER] Shop created with ID: ${shopId}`);

      res.json({
        success: true,
        message: "Tạo thông tin cửa hàng thành công",
        data: { shopId },
      });
    }
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in updateShopInfo:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thông tin cửa hàng",
      error: error.message,
    });
  }
};

// Get seller's products
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      page = 1,
      limit = 20,
      search,
      status,
      sortBy = "created_date",
      sortOrder = "DESC",
    } = req.query;

    console.log(`[SELLER_CONTROLLER] Get products for seller: ${sellerId}`, {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    // Check if seller has shop first
    const shopInfo = await Seller.getShopInfo(sellerId);
    if (!shopInfo) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        message:
          "Bạn chưa có cửa hàng. Vui lòng cập nhật thông tin cửa hàng trước.",
      });
    }

    // Validate pagination params
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 50);

    const result = await Seller.getSellerProducts({
      sellerId,
      page: pageNum,
      limit: limitNum,
      search: search || null,
      status: status || null,
      sortBy,
      sortOrder,
    });

    console.log(`[SELLER_CONTROLLER] Found ${result.products.length} products`);

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      filters: {
        search: search || null,
        status: status || null,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getSellerProducts:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { tenSanPham, moTa, gia, tonKho, danhMuc, trangThai } = req.body;

    console.log(`[SELLER_CONTROLLER] Add product for seller: ${sellerId}`);

    // Validate required fields
    if (!tenSanPham || !gia || !tonKho || !danhMuc) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin sản phẩm",
      });
    }

    // Validate price and stock
    if (gia <= 0 || tonKho < 0) {
      return res.status(400).json({
        success: false,
        message: "Giá phải lớn hơn 0 và tồn kho không được âm",
      });
    }

    const productId = await Seller.addProduct(sellerId, {
      tenSanPham,
      moTa,
      gia: parseFloat(gia),
      tonKho: parseInt(tonKho),
      danhMuc: parseInt(danhMuc),
      trangThai: trangThai || "active",
    });

    console.log(`[SELLER_CONTROLLER] Product added with ID: ${productId}`);

    res.json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: { productId },
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in addProduct:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm sản phẩm",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { tenSanPham, moTa, gia, tonKho, danhMuc, trangThai } = req.body;

    console.log(
      `[SELLER_CONTROLLER] Update product ${id} for seller: ${sellerId}`
    );

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    // Validate required fields
    if (!tenSanPham || !gia || !tonKho || !danhMuc) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin sản phẩm",
      });
    }

    // Validate price and stock
    if (gia <= 0 || tonKho < 0) {
      return res.status(400).json({
        success: false,
        message: "Giá phải lớn hơn 0 và tồn kho không được âm",
      });
    }

    const updated = await Seller.updateProduct(sellerId, parseInt(id), {
      tenSanPham,
      moTa,
      gia: parseFloat(gia),
      tonKho: parseInt(tonKho),
      danhMuc: parseInt(danhMuc),
      trangThai,
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Không thể cập nhật sản phẩm",
      });
    }

    console.log(`[SELLER_CONTROLLER] Product ${id} updated successfully`);

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in updateProduct:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    console.log(
      `[SELLER_CONTROLLER] Delete product ${id} for seller: ${sellerId}`
    );

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    const deleted = await Seller.deleteProduct(sellerId, parseInt(id));

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sản phẩm",
      });
    }

    console.log(`[SELLER_CONTROLLER] Product ${id} deleted successfully`);

    res.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error: error.message,
    });
  }
};

// Get product by ID (seller-specific)
export const getProductById = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    console.log(
      `[SELLER_CONTROLLER] Get product ${id} for seller: ${sellerId}`
    );

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    const product = await Seller.getProductById(sellerId, parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại",
      });
    }

    console.log(`[SELLER_CONTROLLER] Found product: ${product.TenSanPham}`);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getProductById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sản phẩm",
      error: error.message,
    });
  }
};

// Get categories (reuse from buyer)
export const getCategories = async (req, res) => {
  try {
    console.log(`[SELLER_CONTROLLER] Get categories request`);

    const categories = await Product.getCategories();

    console.log(`[SELLER_CONTROLLER] Found ${categories.length} categories`);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh mục",
      error: error.message,
    });
  }
};

// Add stock to product (import goods)
export const addStock = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const { soLuongThayDoi, hanhDong } = req.body;

    console.log(
      `[SELLER_CONTROLLER] Add stock for product: ${productId}, seller: ${sellerId}`
    );

    // Validate required fields
    if (!soLuongThayDoi || soLuongThayDoi <= 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập số lượng hợp lệ (lớn hơn 0)",
      });
    }

    // Set timeout for this operation
    const timeoutId = setTimeout(() => {
      console.log(
        `[SELLER_CONTROLLER] Operation timeout for product: ${productId}`
      );
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Thao tác quá lâu, vui lòng thử lại",
          error: "Request timeout",
        });
      }
    }, 30000); // 30 seconds timeout

    try {
      const result = await Seller.addStock(sellerId, productId, {
        soLuongThayDoi: parseInt(soLuongThayDoi),
        hanhDong: hanhDong || "import",
      });

      clearTimeout(timeoutId);

      console.log(
        `[SELLER_CONTROLLER] Stock added successfully: ${result.oldStock} -> ${result.newStock}`
      );

      if (!res.headersSent) {
        res.json({
          success: true,
          message: `Nhập thêm ${soLuongThayDoi} sản phẩm thành công`,
          data: result,
        });
      }
    } catch (dbError) {
      clearTimeout(timeoutId);
      throw dbError;
    }
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in addStock:", error);

    if (!res.headersSent) {
      // Check for specific error types
      if (
        error.message.includes("Token") ||
        error.message.includes("expired")
      ) {
        return res.status(401).json({
          success: false,
          message: "Phiên đăng nhập đã hết hạn",
          error: "Token expired",
          requireAuth: true,
          tokenExpired: true,
        });
      }

      res.status(500).json({
        success: false,
        message: "Lỗi khi nhập thêm hàng",
        error: error.message,
      });
    }
  }
};

// Get stock change history
export const getStockHistory = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const productId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    console.log(
      `[SELLER_CONTROLLER] Get stock history for product: ${productId}, seller: ${sellerId}`
    );

    const result = await Seller.getStockHistory(
      sellerId,
      productId,
      parseInt(page),
      parseInt(limit)
    );

    console.log(
      `[SELLER_CONTROLLER] Found ${result.history.length} stock history records`
    );

    res.json({
      success: true,
      data: result.history,
      pagination: result.pagination,
      productName: result.productName,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getStockHistory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử tồn kho",
      error: error.message,
    });
  }
};
