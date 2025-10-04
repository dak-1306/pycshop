import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import ImageModel from "../../models/seller/ImageModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageController {
  // Upload ảnh sản phẩm
  static async uploadProductImages(req, res) {
    try {
      const { productId } = req.params;
      const sellerId = req.user.id; // Lấy từ middleware auth

      console.log(
        `[IMAGE_CONTROLLER] Upload request - ProductID: ${productId}, SellerID: ${sellerId}`
      );

      // Kiểm tra sản phẩm có thuộc về seller không
      const isOwner = await ImageModel.checkProductOwnership(
        productId,
        sellerId
      );
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền upload ảnh cho sản phẩm này",
        });
      }

      // Kiểm tra số lượng ảnh hiện tại
      const currentImageCount = await ImageModel.getImageCountByProductId(
        productId
      );

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Không có file ảnh nào được upload",
        });
      }

      // Kiểm tra giới hạn 15 ảnh
      if (currentImageCount + req.files.length > 15) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm chỉ được có tối đa 15 ảnh. Hiện tại có ${currentImageCount} ảnh, bạn chỉ có thể thêm ${
            15 - currentImageCount
          } ảnh nữa.`,
        });
      }

      const uploadedImages = [];
      const errors = [];

      // Xử lý từng file
      for (const file of req.files) {
        try {
          // Tạo tên file unique
          const timestamp = Date.now();
          const fileExtension = path.extname(file.originalname);
          const fileName = `product_${productId}_${timestamp}_${Math.random()
            .toString(36)
            .substr(2, 9)}${fileExtension}`;

          // Đường dẫn lưu file
          const uploadPath = path.join(
            __dirname,
            "../../uploads/product_images",
            fileName
          );

          // Lưu file vào thư mục
          await fs.writeFile(uploadPath, file.buffer);

          // URL để truy cập file
          const imageUrl = `/uploads/product_images/${fileName}`;

          // Lưu thông tin vào database
          await ImageModel.addProductImage(productId, imageUrl);

          uploadedImages.push({
            fileName: fileName,
            url: imageUrl,
            originalName: file.originalname,
          });
        } catch (error) {
          errors.push({
            fileName: file.originalname,
            error: error.message,
          });
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
      console.error("Error uploading images:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi upload ảnh",
        error: error.message,
      });
    }
  }

  // Lấy danh sách ảnh của sản phẩm
  static async getProductImages(req, res) {
    try {
      const { productId } = req.params;

      const images = await ImageModel.getImagesByProductId(productId);

      res.status(200).json({
        success: true,
        data: {
          productId: productId,
          images: images,
          totalImages: images.length,
        },
      });
    } catch (error) {
      console.error("Error getting product images:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách ảnh",
        error: error.message,
      });
    }
  }

  // Xóa ảnh sản phẩm
  static async deleteProductImage(req, res) {
    try {
      const { productId, imageId } = req.params;
      const sellerId = req.user.id;

      console.log(
        `[IMAGE_CONTROLLER] Delete request - ProductID: ${productId}, ImageID: ${imageId}, SellerID: ${sellerId}`
      );

      // Lấy thông tin ảnh và kiểm tra quyền sở hữu
      const imageInfo = await ImageModel.getImageById(imageId);

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

      // Xóa file vật lý
      try {
        const filePath = path.join(__dirname, "../..", imageInfo.Url);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn("Could not delete physical file:", fileError.message);
      }

      // Xóa record trong database
      await ImageModel.deleteProductImage(imageId, productId);

      res.status(200).json({
        success: true,
        message: "Xóa ảnh thành công",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({
        success: false,
        message: "Lỗi server khi xóa ảnh",
        error: error.message,
      });
    }
  }
}

export default ImageController;
