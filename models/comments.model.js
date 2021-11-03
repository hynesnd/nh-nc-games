const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.selectCommentsByReviewId = async (review_id) => {
  const selectStr = `
  SELECT
  comment_id,
  votes,
  created_at,
  author,
  body
  FROM comments
  WHERE review_id = $1`;

  const { rows } = await db.query(selectStr, [review_id]);

  return rows;
};
