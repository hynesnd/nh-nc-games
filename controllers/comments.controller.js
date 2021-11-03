const {
  selectCommentsByReviewId,
  insertCommentByReviewId,
} = require("../models/comments.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  insertCommentByReviewId()
    .then(() => {})
    .catch(next);
};
