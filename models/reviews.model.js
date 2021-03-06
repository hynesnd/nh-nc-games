const db = require("../db/connection");
const { checkExists } = require("../utils");

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
  CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id`;

  const { rows } = await db.query(selectQuery, [review_id]);

  if (rows.length === 0) {
    await checkExists("reviews", "review_id", review_id);
  } else {
    return rows[0];
  }
};

exports.updateReview = async (review_id, body) => {
  await checkExists("reviews", "review_id", review_id);

  if (Object.keys(body).length !== 1) {
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

  return rows[0];
};

exports.selectAllReviews = async (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  const sortColumns = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count",
  ];

  const orderQueries = ["asc", "desc"];

  if (!sortColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort_by query" });
  }
  if (!orderQueries.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  const queryParams = [];
  const catWhere = category ? " WHERE category = $1 " : "";
  if (category) queryParams.push(category);

  let selectQuery = `
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
  ${catWhere}
  GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}`;

  const { rows } = await db.query(selectQuery, queryParams);

  if (rows.length === 0) {
    await checkExists("categories", "slug", category);
    return rows;
  } else {
    return rows;
  }
};
