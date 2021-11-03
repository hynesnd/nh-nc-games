const db = require("../db/connection");
const { convertBigintStrToNum } = require("../utils");

exports.selectReview = async (review_id) => {
  //if review === undefined return a promise reject

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
  CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id`;

  const { rows } = await db.query(selectQuery, [review_id]);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "id not found" });
  } else {
    return rows[0];
  }
};

exports.updateReview = async (review_id, body) => {
  if (Object.keys(body).length > 1) {
    return Promise.reject({ status: 400, msg: "invalid query body" });
  }

  const { inc_votes } = body;

  if (inc_votes === undefined || inc_votes === null) {
    return Promise.reject({ status: 400, msg: "invalid query body" });
  }

  const updateQuery = `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *`;

  const queryParams = [review_id, body.inc_votes];

  const { rows } = await db.query(updateQuery, queryParams);

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "id not found" });
  } else {
    return rows[0];
  }
};

exports.selectAllReviews = async (sort_by = "created_at", order = "DESC") => {
  const selectQuery = `
  SELECT
  reviews.owner,
  reviews.title,
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  reviews.votes,
  CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}`;

  const { rows } = await db.query(selectQuery);

  return rows;
};
