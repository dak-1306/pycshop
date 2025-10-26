import Product from "../../models/buyer/getProductModel.js";

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      sortBy = "created_date",
      sortOrder = "DESC",
    } = req.query;

    console.log(`[PRODUCT_CONTROLLER] Get products request:`, {
      page,
      limit,
      category,
      search,
      sortBy,
      sortOrder,
    });

    // Validate pagination params
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 50); // Max 50 items per page

    const result = await Product.getProducts({
      page: pageNum,
      limit: limitNum,
      category: category || null,
      search: search || null,
      sortBy,
      sortOrder,
    });

    console.log(
      `[PRODUCT_CONTROLLER] Found ${result.products.length} products`
    );

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      filters: {
        category: category || null,
        search: search || null,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[PRODUCT_CONTROLLER] Get product by ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Transform the data for frontend compatibility
    const transformedProduct = {
      id: product.ID_SanPham,
      name: product.TenSanPham,
      description: product.MoTa,
      price: parseFloat(product.Gia),
      stock_quantity: product.TonKho,
      category: product.TenDanhMuc,
      category_id: product.ID_DanhMuc,
      images: product.image_urls ? product.image_urls.split(",") : [],
      average_rating: parseFloat(product.average_rating) || 0,
      review_count: product.review_count || 0,
      shop_name: product.TenCuaHang,
      shop_id: product.ID_CuaHang,
      shop_location: product.shop_location
        ? product.shop_location.trim()
        : "TP.HCM",
      shop_product_count: product.shop_product_count || 0,
      shop_average_rating: parseFloat(product.shop_average_rating) || 0,
      created_date: product.created_date,
    };

    console.log(`[PRODUCT_CONTROLLER] Found product: ${product.TenSanPham}`);

    res.json({
      success: true,
      data: transformedProduct,
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getProductById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    console.log(`[PRODUCT_CONTROLLER] Get categories request`);

    const categories = await Product.getCategories();

    console.log(`[PRODUCT_CONTROLLER] Found ${categories.length} categories`);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const {
      q: search,
      page = 1,
      limit = 20,
      category,
      sortBy = "created_date",
      sortOrder = "DESC",
    } = req.query;

    console.log(`[PRODUCT_CONTROLLER] Search products:`, {
      search,
      page,
      limit,
      category,
      sortBy,
      sortOrder,
    });

    if (!search || search.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 1 character",
      });
    }

    // Validate pagination params
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 50);

    const result = await Product.getProducts({
      page: pageNum,
      limit: limitNum,
      category: category || null,
      search: search.trim(),
      sortBy,
      sortOrder,
    });

    console.log(
      `[PRODUCT_CONTROLLER] Search found ${result.products.length} products`
    );

    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      filters: {
        search: search.trim(),
        category: category || null,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in searchProducts:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

// Get product reviews
export const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    console.log(`[PRODUCT_CONTROLLER] Get reviews for product ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 50);

    const result = await Product.getProductReviews(id, pageNum, limitNum);

    console.log(`[PRODUCT_CONTROLLER] Found ${result.reviews.length} reviews`);

    res.json({
      success: true,
      data: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getProductReviews:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Get product rating statistics
export const getProductRatingStats = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`[PRODUCT_CONTROLLER] Get rating stats for product ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const stats = await Product.getProductRatingStats(id);

    console.log(
      `[PRODUCT_CONTROLLER] Rating stats: ${stats.average_rating}/5 (${stats.total_reviews} reviews)`
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "[PRODUCT_CONTROLLER] Error in getProductRatingStats:",
      error
    );
    res.status(500).json({
      success: false,
      message: "Failed to fetch rating statistics",
      error: error.message,
    });
  }
};

// Get similar products by category
export const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    console.log(`[PRODUCT_CONTROLLER] Get similar products for ID: ${id}`);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // First get the product to know its category
    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get similar products
    const similarProducts = await Product.getSimilarProducts(
      id,
      product.ID_DanhMuc,
      parseInt(limit)
    );

    // Transform data
    const transformedProducts = similarProducts.map((item) => ({
      id: item.ID_SanPham,
      name: item.TenSanPham,
      price: parseFloat(item.Gia),
      image: item.first_image || null,
      rating: parseFloat(item.average_rating) || 0,
    }));

    console.log(
      `[PRODUCT_CONTROLLER] Found ${transformedProducts.length} similar products`
    );

    res.json({
      success: true,
      data: transformedProducts,
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getSimilarProducts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch similar products",
      error: error.message,
    });
  }
};
//lấy sản phẩm theo id shop
export const getProductsByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { last_id, limit } = req.query;
    console.log(`[PRODUCT_CONTROLLER] Get products for shop ID: ${shopId}`);

    if (!shopId || isNaN(shopId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid shop ID",
      });
    }
    const products = await Product.getProductsByShop(
      shopId,
      last_id || null,
      parseInt(limit) || 10
    );

    console.log(
      `[PRODUCT_CONTROLLER] Found ${products.length} products for shop ID: ${shopId}`
    );
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("[PRODUCT_CONTROLLER] Error in getProductsByShopId:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by shop ID",
      error: error.message,
    });
  }
};
