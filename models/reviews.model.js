const db = require("../db/connection");

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
  JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id`;

  const { rows } = await db.query(selectQuery);
  return rows[0];
};
