const reviewsRouter = require("express").Router();
const {
  getReview,
  patchReview,
  getAllReviews,
} = require("../controllers/reviews.controller");
const { getCommentsByReviewId } = require("../controllers/comments.controller");

reviewsRouter.route("/").get(getAllReviews);
reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);
reviewsRouter.route("/:review_id/comments").get(getCommentsByReviewId);

module.exports = reviewsRouter;
