const reviewsRouter = require("express").Router();
const {
  getReview,
  patchReview,
  getAllReviews,
} = require("../controllers/reviews.controller");
const reviews = require("../db/data/test-data/reviews");

reviewsRouter.route("/").get(getAllReviews);
reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

module.exports = reviewsRouter;
