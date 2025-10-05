import Shop from "../models/Shop.js";
import jwt from "jsonwebtoken";
import db from "../../db/index.js";

// Get shop information for current seller
export const getShopInfo = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log(`[SHOP_CONTROLLER] Get shop info for seller: ${sellerId}`);

    const shop = await Shop.getShopBySellerId(sellerId);

    if (!shop) {
      return res.json({
        success: true,
        shop: null,
        message: "Bạn chưa có cửa hàng. Vui lòng tạo cửa hàng mới.",
      });
    }

    console.log(`[SHOP_CONTROLLER] Found shop: ${shop.name}`);

    res.json({
      success: true,
      shop: shop,
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in getShopInfo:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin cửa hàng",
      error: error.message,
    });
  }
};

// Create new shop
export const createShop = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { name, description, category_id, address, phone } = req.body;

    console.log(`[SHOP_CONTROLLER] Create shop for seller: ${sellerId}`);

    // Validate required fields
    if (!name || !category_id || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cửa hàng",
      });
    }

    // Check if seller already has a shop
    const existingShop = await Shop.getShopBySellerId(sellerId);
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã có cửa hàng rồi",
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ",
      });
    }

    const shopId = await Shop.createShop(sellerId, {
      name,
      description,
      category_id: parseInt(category_id),
      address,
      phone,
    });

    console.log(`[SHOP_CONTROLLER] Shop created with ID: ${shopId}`);

    res.json({
      success: true,
      message: "Tạo cửa hàng thành công",
      shop: {
        id: shopId,
        name,
        category_id: parseInt(category_id),
        address,
        phone,
      },
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in createShop:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo cửa hàng",
      error: error.message,
    });
  }
};

// Update shop information
export const updateShop = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { name, description, category_id, address, phone } = req.body;

    console.log(`[SHOP_CONTROLLER] Update shop for seller: ${sellerId}`);

    // Validate required fields
    if (!name || !category_id || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cửa hàng",
      });
    }

    // Check if shop exists
    const existingShop = await Shop.getShopBySellerId(sellerId);
    if (!existingShop) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cửa hàng",
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại không hợp lệ",
      });
    }

    const updated = await Shop.updateShop(sellerId, {
      name,
      description,
      category_id: parseInt(category_id),
      address,
      phone,
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Không thể cập nhật thông tin cửa hàng",
      });
    }

    console.log(`[SHOP_CONTROLLER] Shop updated successfully`);

    res.json({
      success: true,
      message: "Cập nhật thông tin cửa hàng thành công",
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in updateShop:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật cửa hàng",
      error: error.message,
    });
  }
};

// Delete shop
export const deleteShop = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log(`[SHOP_CONTROLLER] Delete shop for seller: ${sellerId}`);

    // Check if shop exists
    const existingShop = await Shop.getShopBySellerId(sellerId);
    if (!existingShop) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cửa hàng",
      });
    }

    const deleted = await Shop.deleteShop(sellerId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa cửa hàng",
      });
    }

    console.log(`[SHOP_CONTROLLER] Shop deleted successfully`);

    res.json({
      success: true,
      message: "Xóa cửa hàng thành công",
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in deleteShop:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa cửa hàng",
      error: error.message,
    });
  }
};

// Get categories for shop selection
export const getCategories = async (req, res) => {
  try {
    console.log(`[SHOP_CONTROLLER] Get categories request`);

    const categories = await Shop.getCategories();

    console.log(`[SHOP_CONTROLLER] Found ${categories.length} categories`);

    res.json({
      success: true,
      categories: categories,
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh mục",
      error: error.message,
    });
  }
};

// Get shops by category (public endpoint)
export const getShopsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    console.log(`[SHOP_CONTROLLER] Get shops by category: ${categoryId}`);

    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "ID danh mục không hợp lệ",
      });
    }

    const result = await Shop.getShopsByCategory(
      parseInt(categoryId),
      parseInt(page),
      parseInt(limit)
    );

    console.log(`[SHOP_CONTROLLER] Found ${result.shops.length} shops`);

    res.json({
      success: true,
      shops: result.shops,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in getShopsByCategory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách cửa hàng",
      error: error.message,
    });
  }
};

// Search shops (public endpoint)
export const searchShops = async (req, res) => {
  try {
    const { q: searchTerm, page = 1, limit = 20 } = req.query;

    console.log(`[SHOP_CONTROLLER] Search shops: ${searchTerm}`);

    if (!searchTerm || searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Từ khóa tìm kiếm phải có ít nhất 2 ký tự",
      });
    }

    const result = await Shop.searchShops(
      searchTerm.trim(),
      parseInt(page),
      parseInt(limit)
    );

    console.log(`[SHOP_CONTROLLER] Found ${result.shops.length} shops`);

    res.json({
      success: true,
      shops: result.shops,
      pagination: result.pagination,
      filters: {
        search: searchTerm.trim(),
      },
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in searchShops:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm cửa hàng",
      error: error.message,
    });
  }
};

// Get shop by ID (public endpoint)
export const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;

    console.log(`[SHOP_CONTROLLER] Get shop by ID: ${shopId}`);

    if (!shopId || isNaN(shopId)) {
      return res.status(400).json({
        success: false,
        message: "ID cửa hàng không hợp lệ",
      });
    }

    const shop = await Shop.getShopById(parseInt(shopId));

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy cửa hàng",
      });
    }

    console.log(`[SHOP_CONTROLLER] Found shop: ${shop.name}`);

    res.json({
      success: true,
      shop: shop,
    });
  } catch (error) {
    console.error("[SHOP_CONTROLLER] Error in getShopById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin cửa hàng",
      error: error.message,
    });
  }
};

// Become seller - move user from buyer to seller and create shop
export const becomeSeller = async (req, res) => {
  try {
    console.log("🔍 [BECOME_SELLER] All headers:", req.headers);
    console.log("🔍 [BECOME_SELLER] Request body:", req.body);

    const { shopName, shopDescription, shopCategory, shopAddress, shopPhone } =
      req.body;

    // Validate required shop data
    if (
      !shopName ||
      !shopDescription ||
      !shopCategory ||
      !shopAddress ||
      !shopPhone
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin cửa hàng",
      });
    }

    // Get user info from headers (passed from API Gateway) or decode from token
    let userId = req.headers["x-user-id"];
    let userRole = req.headers["x-user-role"];

    // If no headers, try to decode from authorization token
    if (!userId) {
      console.log(
        "🔍 [BECOME_SELLER] No x-user-id header, trying to decode token..."
      );
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.slice(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          userRole = decoded.role;
          console.log(
            `🔍 [BECOME_SELLER] Decoded from token: userId=${userId}, role=${userRole}`
          );
        } catch (tokenError) {
          console.error(
            "❌ [BECOME_SELLER] Token decode error:",
            tokenError.message
          );
          return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
          });
        }
      }
    }

    console.log(
      `🔄 [BECOME_SELLER] User ${userId} (current role: ${userRole}) requesting to become seller`
    );

    if (!userId) {
      console.log("❌ [BECOME_SELLER] No userId found in headers or token");
      return res.status(401).json({
        success: false,
        message: "Thông tin người dùng không hợp lệ",
      });
    }

    // Get current user
    const [userResult] = await db.execute(
      "SELECT * FROM NguoiDung WHERE ID_NguoiDung = ?",
      [userId]
    );

    if (userResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const currentUser = userResult[0];

    // Check if already seller
    if (currentUser.VaiTro === "seller") {
      return res.status(400).json({
        success: false,
        message: "Bạn đã là seller rồi",
      });
    }

    // Find category ID by name
    const [categoryResult] = await db.execute(
      "SELECT ID_DanhMuc FROM DanhMuc WHERE TenDanhMuc = ?",
      [shopCategory]
    );

    let categoryId = 1; // Default category
    if (categoryResult.length > 0) {
      categoryId = categoryResult[0].ID_DanhMuc;
    }

    // Get a connection for transaction
    const connection = await db.getConnection();

    try {
      // Begin transaction
      await connection.beginTransaction();

      // Update user role to seller first
      await connection.execute(
        "UPDATE NguoiDung SET VaiTro = ? WHERE ID_NguoiDung = ?",
        ["seller", userId]
      );

      // Create shop
      const shopId = await Shop.createShop(userId, {
        name: shopName,
        description: shopDescription,
        category_id: categoryId,
        address: shopAddress,
        phone: shopPhone,
      });

      // Commit transaction
      await connection.commit();

      // Generate new token with seller role
      const token = jwt.sign(
        {
          id: userId,
          email: currentUser.Email,
          role: "seller",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log(
        `✅ [BECOME_SELLER] User ${userId} is now a seller with shop ${shopId}`
      );

      res.json({
        success: true,
        message: "Chúc mừng! Bạn đã trở thành seller thành công!",
        token,
        user: {
          id: userId,
          name: currentUser.HoTen,
          email: currentUser.Email,
          role: "seller",
          shopId: shopId,
        },
      });
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      throw transactionError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("❌ [BECOME_SELLER] Error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi trở thành seller",
      error: error.message,
    });
  }
};
