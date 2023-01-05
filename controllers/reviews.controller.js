const ReviewService = require('../services/reviews.service');

class ReviewsController {
  reviewService = new ReviewService();

  getReviews = async (req, res, next) => {
    try {
      const reviews = await this.reviewService.findAllReview();

      res.status(200).json({ data: reviews });
    } catch (err) {
      res.status(400).send({
        errorMessage: '리뷰 조회에 실패하였습니다.',
      });
      return;
    }
  };

  getReviewById = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await this.reviewService.findReviewById(reviewId);

    res.status(200).json({ data: review });
  };

  createReview = async (req, res, next) => {
    const { nickname, password, title, content } = req.body;
    const createReviewData = await this.reviewService.createReview(
      nickname,
      password,
      title,
      content
    );

    res.status(201).json({ data: createReviewData });
  };

  updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { password, title, content } = req.body;

    const updateReview = await this.reviewService.updateReview(
      reviewId,
      password,
      title,
      content
    );

    res.status(200).json({ data: updateReview });
  };

  deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { password } = req.body;

    const deleteReview = await this.reviewService.deleteReview(
      reviewId,
      password
    );

    res.status(200).json({ data: deleteReview });
  };
}

module.exports = ReviewsController;
