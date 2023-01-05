const { Review } = require('../models');
const { Service } = require('../models');
const { User } = require('../models');

class ReviewRepository {
  findAllReview = async () => {
    const reviews = await Review.findAll();

    return reviews;
  };

  findReviewByOwnerId = async (ownerId) => {
    const review = await Review.findAll({
      raw: true,
      attributes: {
        include: ["Service.customerId", "Service.customer.nickname"],
      },
      include: [
        {
          model: Service,
          attributes: [],
          where: { ownerId },
          include: [
            {
              model: User,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
    });
    return review;
  };

  findReviewByServiceId = async (customerId, serviceId) => {
    const review = await Review.findOne({
      raw: true,
      include: [
        {
          model: Service,
          attributes: [],
          where: { customerId },
          include: [
            {
              model: User,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
      where: { serviceId },
    });
    if (review===null) {
      review = {}
    }
    return review;
  };

  findReviewByCustomerId = async (customerId) => {
    const review = await Review.findAll({
      raw: true,
      attributes: {
        include: ["Service.customerId", "Service.customer.nickname"],
      },
      include: [
        {
          model: Service,
          attributes: [],
          where: { customerId },
          include: [
            {
              model: User,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
    });
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
