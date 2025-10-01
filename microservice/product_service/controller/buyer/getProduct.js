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

    console.log(`[PRODUCT_CONTROLLER] Found product: ${product.TenSanPham}`);

    res.json({
      success: true,
      data: product,
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

    if (!search || search.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
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
