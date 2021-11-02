const db = require("../db/connection");
const { convertStrToBigInt } = require("../utils");

exports.selectReview = async (review_id) => {
  const selectQuery = `
  SELECT 
  reviews.owner,
  reviews.title,
  reviews.review_id AS review_id,
  reviews.review_body,
  reviews.designer,
  reviews.review_img_url,
  reviews.category,
  reviews.created_at,
  reviews.votes,
  count(comments.comment_id) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id`;

  const { rows } = await db.query(selectQuery, [review_id]);

  rows.forEach(
    (review) =>
      (review.comment_count = convertStrToBigInt(review.comment_count))
  );

  console.log(rows);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "no items found" });
  } else {
    return rows[0];
  }
};
