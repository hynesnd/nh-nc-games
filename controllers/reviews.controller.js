const {
  selectReview,
  updateReview,
  selectAllReviews,
} = require("../models/reviews.model");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  //if !review_id next({status, msg})
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  updateReview(review_id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getAllReviews = (req, res, next) => {
  selectAllReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
