import danhGiaModel from '../models/danhGiaModels.js';
import kafkaService from '../services/kafkaService.js';
import jwt from 'jsonwebtoken';

// Middleware to get user info from API Gateway headers
const getUserFromHeaders = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const userType = req.headers['x-user-type'];

  if (userId) {
    req.user = {
      userId: parseInt(userId),
      role: userRole,
      userType: userType
    };
  }

  next();
};

const danhGiaController = {
  // Tạo đánh giá mới
  createReview: async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
      
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập để đánh giá sản phẩm'
        });
      }

      const userId = req.user.userId;

      // Validate input
      if (!productId || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin bắt buộc'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Đánh giá phải từ 1 đến 5 sao'
        });
      }

      if (comment.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Bình luận phải có ít nhất 10 ký tự'
        });
      }

      // Check if user already reviewed this product
      const existingReview = await danhGiaModel.checkUserReview(productId, userId);
      if (existingReview.hasReviewed) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã đánh giá sản phẩm này rồi'
        });
      }

      // Create review
      const reviewData = {
        productId: parseInt(productId),
        userId: userId,
        rating: parseInt(rating),
        comment: comment.trim()
      };

      const result = await danhGiaModel.createReview(reviewData);

      if (result.success) {
        // Get shop ID for Kafka message
        const shopId = await danhGiaModel.getShopIdByProductId(productId);
        
        if (shopId) {
          // Send Kafka message for shop rating update
          await kafkaService.sendReviewCreatedMessage({
            shopId: shopId,
            productId: productId,
            reviewId: result.insertId,
            rating: rating
          });
        }

        res.status(201).json({
          success: true,
          message: 'Đánh giá đã được tạo thành công',
          data: result.data
        });
      } else {
        throw new Error('Failed to create review');
      }
    } catch (error) {
      console.error('Error in createReview:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo đánh giá',
        error: error.message
      });
    }
  },

  // Lấy danh sách đánh giá của sản phẩm
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID là bắt buộc'
        });
      }

      const result = await danhGiaModel.getProductReviews(productId, page, limit);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: result.data,
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          total: result.pagination.total,
          limit: result.pagination.limit
        });
      } else {
        throw new Error('Failed to get reviews');
      }
    } catch (error) {
      console.error('Error in getProductReviews:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tải đánh giá',
        error: error.message
      });
    }
  },

  // Kiểm tra xem user đã đánh giá sản phẩm này chưa
  checkUserReview: async (req, res) => {
    try {
      const { productId } = req.params;
      
      // Check if user is authenticated
      if (!req.user || !req.user.userId) {
        return res.status(200).json({
          success: true,
          hasReviewed: false,
          message: 'Vui lòng đăng nhập để kiểm tra đánh giá'
        });
      }

      const userId = req.user.userId;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID là bắt buộc'
        });
      }

      const result = await danhGiaModel.checkUserReview(productId, userId);

      if (result.success) {
        res.status(200).json({
          success: true,
          hasReviewed: result.hasReviewed,
          review: result.review
        });
      } else {
        throw new Error('Failed to check user review');
      }
    } catch (error) {
      console.error('Error in checkUserReview:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra đánh giá',
        error: error.message
      });
    }
  }
};

export { danhGiaController, getUserFromHeaders };