const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.get('/', authMiddleware, reviewsController.getReviews);

module.exports = router;
