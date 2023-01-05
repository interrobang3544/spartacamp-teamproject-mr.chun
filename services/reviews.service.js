const ReviewRepository = require('../repositories/reviews.repository');

class ReviewService {
  reviewRepository = new ReviewRepository();

  findAllReview = async () => {
    const allReview = await this.reviewRepository.findAllReview();

    allReview.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReview.map((review) => {
      return {
        reviewId: review.reviewId,
        title: review.title,
        content: review.content,
        rate: review.rate,
        serviceId: review.serviceId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  findReviewByOwnerId = async (userId) => {
    const findReview = await this.reviewRepository.findReviewByOwnerId(userId);

    return findReview.map((review) => {
      return {
        reviewId: review.reviewId,
        title: review.title,
        content: review.content,
        rate: review.rate,
        serviceId: review.serviceId,
        customerNickname: review.nickname,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  createReview = async (title, content, rate, serviceId) => {
    const createReviewData = await this.reviewRepository.createReview(
      title,
      content,
      rate,
      serviceId
    );

    return {
      reviewId: createReviewData.null,
      title: createReviewData.title,
      content: createReviewData.content,
      rate: createReviewData.rate,
      serviceId: createReviewData.serviceId,
      createdAt: createReviewData.createdAt,
      updatedAt: createReviewData.updatedAt,
    };
  };

  updateReview = async (reviewId, title, content, rate) => {
    const findReview = await this.reviewRepository.findReviewById(reviewId);
    if (!findReview) throw new Error("Review doesn't exist");

    await this.reviewRepository.updateReview(reviewId, title, content, rate);

    const updateReview = await this.reviewRepository.findReviewById(reviewId);

    return {
      reviewId: updateReview.reviewId,
      title: updateReview.title,
      content: updateReview.content,
      rate: updateReview.rate,
      createdAt: updateReview.createdAt,
      updatedAt: updateReview.updatedAt,
    };
  };

  deleteReview = async (reviewId) => {
    const findReview = await this.reviewRepository.findReviewById(reviewId);
    if (!findReview) throw new Error("Review doesn't exist");

    await this.reviewRepository.deleteReview(reviewId);

    return {
      reviewId: findReview.reviewId,
      title: findReview.nickname,
      content: findReview.title,
      rate: findReview.content,
      createdAt: findReview.createdAt,
      updatedAt: findReview.updatedAt,
    };
  };
}

module.exports = ReviewService;
