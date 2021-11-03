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
  const { review_id } = req.params;
  insertCommentByReviewId(review_id, req.body)
    .then((comment) => {
      console.log(comment);
      res.status(201).send({ comment });
    })
    .catch(next);
};
