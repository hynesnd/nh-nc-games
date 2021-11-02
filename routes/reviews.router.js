const reviewsRouter = require("express").Router();
const { getReview, patchReview } = require("../controllers/reviews.controller");

reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

module.exports = reviewsRouter;
