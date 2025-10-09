import express from 'express';
import { danhGiaController, getUserFromHeaders } from '../controller/danhGiaController.js';

const router = express.Router();

// Create a new review (requires user info from headers)
router.post('/reviews', getUserFromHeaders, danhGiaController.createReview);

// Get reviews for a product (public - no auth required)
router.get('/products/:productId/reviews', danhGiaController.getProductReviews);

// Check if user has reviewed a product (requires user info from headers)
router.get('/reviews/check/:productId', getUserFromHeaders, danhGiaController.checkUserReview);

export default router;