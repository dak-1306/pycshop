import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import ImageController from "../../controller/seller/ImageController.js";
import sellerAuthMiddleware from "../../middleware/sellerAuthMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Cấu hình multer để xử lý upload file
const storage = multer.memoryStorage(); // Lưu file trong memory trước khi xử lý

const fileFilter = (req, file, cb) => {
  // Chỉ cho phép các file ảnh
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB per file
    files: 15, // Tối đa 15 files
  },
});

// Route upload ảnh sản phẩm
router.post(
  "/products/:productId/images",
  sellerAuthMiddleware,
  upload.array("images", 15),
  ImageController.uploadProductImages
);

// Route lấy danh sách ảnh sản phẩm
router.get("/products/:productId/images", ImageController.getProductImages);

// Route xóa ảnh sản phẩm
router.delete(
  "/products/:productId/images/:imageId",
  sellerAuthMiddleware,
  ImageController.deleteProductImage
);

// Route để serve static files (ảnh)
router.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

export default router;
