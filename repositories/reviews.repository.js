const { Review } = require('../models');

class ReviewRepository {
  findAllReview = async () => {
    const reviews = await Review.findAll();

    return reviews;
  };

  findReviewById = async (reviewId) => {
    const review = await Review.findByPk(reviewId);

    return review;
  };

  createReview = async (title, content, rate, serviceId) => {
    const createReviewData = await Review.create({
      title,
      content,
      rate,
      serviceId,
    });

    return createReviewData;
  };

  updateReview = async (reviewId, title, content, rate) => {
    const updateReviewData = await Review.update(
      { title, content, rate },
      { where: { reviewId } }
    );

    return updateReviewData;
  };

  deleteReview = async (reviewId) => {
    const deleteReviewData = await Review.destroy({ where: { postId } });

    return deleteReviewData;
  };
}

module.exports = ReviewRepository;
