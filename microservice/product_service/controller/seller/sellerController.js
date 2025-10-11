import Seller from "../../models/seller/SellerModel.js";
import Product from "../../models/buyer/getProductModel.js";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

// ================== IMAGE MANAGEMENT FUNCTIONS ==================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm helper để xử lý upload file
const handleFileUpload = async (file, productId) => {
  const timestamp = Date.now();
  const fileExtension = path.extname(file.originalname);
  const fileName = `product_${productId}_${timestamp}_${Math.random()
    .toString(36)
    .substr(2, 9)}${fileExtension}`;

  const uploadDir = path.join(__dirname, "../../uploads/product_images");

  // Tạo thư mục nếu chưa tồn tại
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, fileName);
  await fs.writeFile(uploadPath, file.buffer);

  return `/uploads/product_images/${fileName}`;
};

// Upload ảnh sản phẩm (hỗ trợ cả file upload và URL) - FUNCTION DUY NHẤT
export const uploadProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.user.id;
    const { imageUrls } = req.body; // URLs từ body (nếu có)

    console.log(
      `[SELLER_CONTROLLER] Upload request - ProductID: ${productId}, SellerID: ${sellerId}`
    );

    // Kiểm tra sản phẩm có thuộc về seller không
    const isOwner = await Seller.checkProductOwnership(productId, sellerId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền upload ảnh cho sản phẩm này",
      });
    }

    // Kiểm tra số lượng ảnh hiện tại
    const currentImageCount = await Seller.getImageCountByProductId(productId);

    let uploadedImages = [];
    let errors = [];
    let totalNewImages = 0;

    // Đếm tổng số ảnh mới
    const fileCount = req.files ? req.files.length : 0;
    const urlCount =
      imageUrls && Array.isArray(imageUrls) ? imageUrls.length : 0;
    totalNewImages = fileCount + urlCount;

    // Kiểm tra giới hạn 15 ảnh
    if (currentImageCount + totalNewImages > 15) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm chỉ được có tối đa 15 ảnh. Hiện tại có ${currentImageCount} ảnh, bạn chỉ có thể thêm ${
          15 - currentImageCount
        } ảnh nữa.`,
      });
    }

    // Xử lý file upload nếu có
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const imageUrl = await handleFileUpload(file, productId);
          await Seller.addProductImage(productId, imageUrl);

          uploadedImages.push({
            type: "file",
            fileName: path.basename(imageUrl),
            url: imageUrl,
            originalName: file.originalname,
          });
        } catch (error) {
          errors.push({
            type: "file",
            fileName: file.originalname,
            error: error.message,
          });
        }
      }
    }

    // Xử lý URL ảnh nếu có
    if (imageUrls && Array.isArray(imageUrls)) {
      const validImageUrls = imageUrls.filter(
        (url) => typeof url === "string" && url.trim().length > 0
      );

      for (const url of validImageUrls) {
        try {
          await Seller.addProductImage(productId, url);
          uploadedImages.push({
            type: "url",
            url: url,
          });
        } catch (error) {
          errors.push({
            type: "url",
            url: url,
            error: error.message,
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Upload thành công ${uploadedImages.length} ảnh`,
      data: {
        uploadedImages,
        errors: errors.length > 0 ? errors : null,
        totalImages: currentImageCount + uploadedImages.length,
      },
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error uploading images:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi upload ảnh",
      error: error.message,
    });
  }
};

// Lấy danh sách ảnh của sản phẩm
export const getProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    console.log(
      `[SELLER_CONTROLLER] Get images for product ${id}, seller: ${sellerId}`
    );

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    // Kiểm tra sản phẩm có thuộc về seller không
    const isOwner = await Seller.checkProductOwnership(id, sellerId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem ảnh của sản phẩm này",
      });
    }

    const images = await Seller.getImagesByProductId(id, sellerId);

    console.log(
      `[SELLER_CONTROLLER] Found ${images.length} images for product ${id}`
    );

    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error getting product images:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách ảnh",
      error: error.message,
    });
  }
};

// Xóa ảnh sản phẩm
export const deleteProductImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const sellerId = req.user.id;

    console.log(
      `[SELLER_CONTROLLER] Delete request - ProductID: ${id}, ImageID: ${imageId}, SellerID: ${sellerId}`
    );

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    if (!imageId || isNaN(imageId)) {
      return res.status(400).json({
        success: false,
        message: "ID ảnh không hợp lệ",
      });
    }

    // Lấy thông tin ảnh và kiểm tra quyền sở hữu
    const imageInfo = await Seller.getImageById(imageId);

    if (!imageInfo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy ảnh",
      });
    }

    if (imageInfo.ID_NguoiBan !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa ảnh này",
      });
    }

    // Xóa file vật lý nếu là file upload local
    if (imageInfo.Url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(__dirname, "../..", imageInfo.Url);
        await fs.unlink(filePath);
        console.log(`[SELLER_CONTROLLER] Deleted physical file: ${filePath}`);
      } catch (fileError) {
        console.warn("Could not delete physical file:", fileError.message);
      }
    }

    // Xóa record trong database
    await Seller.deleteProductImage(imageId, id);

    console.log(
      `[SELLER_CONTROLLER] Successfully deleted image ${imageId} from product ${id}`
    );

    res.status(200).json({
      success: true,
      message: "Xóa ảnh thành công",
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa ảnh",
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
    console.log(
      `[SELLER_CONTROLLER] Request body size:`,
      JSON.stringify(req.body).length,
      "bytes"
    );
    console.log(`[SELLER_CONTROLLER] Product data:`, {
      tenSanPham,
      gia,
      tonKho,
      danhMuc,
      moTaLength: moTa?.length,
    });

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

// Update product với hỗ trợ update ảnh
export const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const {
      tenSanPham,
      moTa,
      gia,
      danhMuc,
      trangThai,
      imagesToDelete: imagesToDeleteRaw,
      newImageUrls: newImageUrlsRaw,
      imageOrder: imageOrderRaw,
    } = req.body;

    // Parse JSON strings nếu cần
    let imagesToDelete = null;
    let newImageUrls = null;
    let imageOrder = null;

    try {
      imagesToDelete = imagesToDeleteRaw ? JSON.parse(imagesToDeleteRaw) : null;
    } catch (e) {
      imagesToDelete = Array.isArray(imagesToDeleteRaw)
        ? imagesToDeleteRaw
        : null;
    }

    try {
      newImageUrls = newImageUrlsRaw ? JSON.parse(newImageUrlsRaw) : null;
    } catch (e) {
      newImageUrls = Array.isArray(newImageUrlsRaw) ? newImageUrlsRaw : null;
    }

    try {
      imageOrder = imageOrderRaw ? JSON.parse(imageOrderRaw) : null;
    } catch (e) {
      imageOrder = Array.isArray(imageOrderRaw) ? imageOrderRaw : null;
    }

    console.log(
      `[SELLER_CONTROLLER] Update product ${id} for seller: ${sellerId}`
    );
    console.log(
      `[SELLER_CONTROLLER] Request Content-Type:`,
      req.headers["content-type"]
    );
    console.log(
      `[SELLER_CONTROLLER] Request body keys:`,
      Object.keys(req.body)
    );
    console.log(`[SELLER_CONTROLLER] Request body:`, req.body);
    console.log(`[SELLER_CONTROLLER] Request files:`, req.files?.length || 0);
    console.log(`[SELLER_CONTROLLER] Images to delete:`, imagesToDelete);
    console.log(`[SELLER_CONTROLLER] New image URLs:`, newImageUrls);
    console.log(`[SELLER_CONTROLLER] Image order:`, imageOrder);

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    // Validate required fields
    if (!tenSanPham || !gia || !danhMuc) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin sản phẩm",
      });
    }

    // Validate price
    if (gia <= 0) {
      return res.status(400).json({
        success: false,
        message: "Giá phải lớn hơn 0",
      });
    }

    // Kiểm tra quyền sở hữu sản phẩm
    const isOwner = await Seller.checkProductOwnership(id, sellerId);
    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật sản phẩm này",
      });
    }

    // Update thông tin cơ bản của sản phẩm
    const updated = await Seller.updateProduct(sellerId, parseInt(id), {
      tenSanPham,
      moTa,
      gia: parseFloat(gia),
      danhMuc: parseInt(danhMuc),
      trangThai,
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Không thể cập nhật sản phẩm",
      });
    }

    let imageUpdateResults = {
      deleted: [],
      added: [],
      errors: [],
    };

    // Xử lý xóa ảnh nếu có
    if (
      imagesToDelete &&
      Array.isArray(imagesToDelete) &&
      imagesToDelete.length > 0
    ) {
      console.log(
        `[SELLER_CONTROLLER] Deleting ${imagesToDelete.length} images`
      );

      for (const imageId of imagesToDelete) {
        try {
          // Lấy thông tin ảnh để xóa file vật lý
          const imageInfo = await Seller.getImageById(imageId);

          if (imageInfo && imageInfo.ID_NguoiBan === sellerId) {
            // Xóa file vật lý nếu là file upload local
            if (imageInfo.Url.startsWith("/uploads/")) {
              try {
                const filePath = path.join(__dirname, "../..", imageInfo.Url);
                await fs.unlink(filePath);
                console.log(
                  `[SELLER_CONTROLLER] Deleted physical file: ${filePath}`
                );
              } catch (fileError) {
                console.warn(
                  "Could not delete physical file:",
                  fileError.message
                );
              }
            }

            // Xóa record trong database
            await Seller.deleteProductImage(imageId, id);
            imageUpdateResults.deleted.push(imageId);
          }
        } catch (error) {
          imageUpdateResults.errors.push({
            type: "delete",
            imageId: imageId,
            error: error.message,
          });
        }
      }
    }

    // Kiểm tra số lượng ảnh hiện tại sau khi xóa
    const currentImageCount = await Seller.getImageCountByProductId(id);
    let totalNewImages = 0;

    // Đếm số ảnh mới sẽ thêm
    const fileCount = req.files ? req.files.length : 0;
    const urlCount =
      newImageUrls && Array.isArray(newImageUrls) ? newImageUrls.length : 0;
    totalNewImages = fileCount + urlCount;

    // Kiểm tra giới hạn 15 ảnh
    if (currentImageCount + totalNewImages > 15) {
      return res.status(400).json({
        success: false,
        message: `Sản phẩm chỉ được có tối đa 15 ảnh. Hiện tại có ${currentImageCount} ảnh, bạn chỉ có thể thêm ${
          15 - currentImageCount
        } ảnh nữa.`,
      });
    }

    // Xử lý upload file ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      console.log(
        `[SELLER_CONTROLLER] Processing ${req.files.length} new file uploads`
      );

      for (const file of req.files) {
        try {
          const imageUrl = await handleFileUpload(file, id);
          await Seller.addProductImage(id, imageUrl);

          imageUpdateResults.added.push({
            type: "file",
            fileName: path.basename(imageUrl),
            url: imageUrl,
            originalName: file.originalname,
          });
        } catch (error) {
          imageUpdateResults.errors.push({
            type: "file",
            fileName: file.originalname,
            error: error.message,
          });
        }
      }
    }

    // Xử lý thêm ảnh từ URL nếu có
    if (
      newImageUrls &&
      Array.isArray(newImageUrls) &&
      newImageUrls.length > 0
    ) {
      console.log(
        `[SELLER_CONTROLLER] Adding ${newImageUrls.length} new image URLs`
      );

      const validImageUrls = newImageUrls.filter(
        (url) => typeof url === "string" && url.trim().length > 0
      );

      for (const url of validImageUrls) {
        try {
          await Seller.addProductImage(id, url);
          imageUpdateResults.added.push({
            type: "url",
            url: url,
          });
        } catch (error) {
          imageUpdateResults.errors.push({
            type: "url",
            url: url,
            error: error.message,
          });
        }
      }
    }

    // Xử lý thay đổi thứ tự ảnh nếu có
    if (imageOrder && Array.isArray(imageOrder) && imageOrder.length > 0) {
      console.log(
        `[SELLER_CONTROLLER] Updating image order for ${imageOrder.length} images`
      );

      try {
        // Update image order in database
        await Seller.updateImageOrder(id, imageOrder, sellerId);
        imageUpdateResults.reordered = imageOrder.length;
        console.log(
          `[SELLER_CONTROLLER] Successfully reordered ${imageOrder.length} images`
        );
      } catch (error) {
        console.error(`[SELLER_CONTROLLER] Error reordering images:`, error);
        imageUpdateResults.errors.push({
          type: "reorder",
          error: error.message,
        });
      }
    }

    console.log(`[SELLER_CONTROLLER] Product ${id} updated successfully`);
    console.log(
      `[SELLER_CONTROLLER] Image update results:`,
      imageUpdateResults
    );

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: {
        productUpdated: true,
        imageUpdates: imageUpdateResults,
        totalImages: await Seller.getImageCountByProductId(id),
      },
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

// ================== ORDER MANAGEMENT FUNCTIONS ==================

// Get seller's orders
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { page = 1, limit = 10, search = "", status = "" } = req.query;

    console.log(`[SELLER_CONTROLLER] Get orders for seller ${sellerId}`);

    const orders = await Seller.getSellerOrders(sellerId, {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status: status || null,
    });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getSellerOrders:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    console.log(`[SELLER_CONTROLLER] Get order ${id} for seller ${sellerId}`);

    const order = await Seller.getOrderById(id, sellerId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getOrderById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin đơn hàng",
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    console.log(
      `[SELLER_CONTROLLER] Update order ${id} status to ${status} for seller ${sellerId}`
    );

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    const updated = await Seller.updateOrderStatus(id, sellerId, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng hoặc bạn không có quyền cập nhật",
      });
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in updateOrderStatus:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    console.log(`[SELLER_CONTROLLER] Get order stats for seller ${sellerId}`);

    const stats = await Seller.getOrderStats(sellerId);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("[SELLER_CONTROLLER] Error in getOrderStats:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thống kê đơn hàng",
      error: error.message,
    });
  }
};
