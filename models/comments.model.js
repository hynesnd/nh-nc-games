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

  if (rows.length === 0) {
    await checkExists("reviews", "review_id", review_id);
    return Promise.reject({
      status: 404,
      msg: "no comments found under review",
    });
  } else {
    return rows;
  }
};

exports.insertCommentByReviewId = async (review_id, reqBody) => {
  const { username, body } = reqBody;
  const insertQuery = `
  INSERT INTO comments
  (review_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *`;

  queryValues = [review_id, username, body];

  const { rows } = await db.query(insertQuery, queryValues);

  return rows[0];
};
