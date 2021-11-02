const { selectReview, updateReview } = require("../models/reviews.model");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateReview(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
