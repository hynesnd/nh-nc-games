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
    return rows;
  } else {
    return rows;
  }
};

exports.insertCommentByReviewId = async (review_id, reqBody) => {
  await checkExists("reviews", "review_id", review_id);
  if (Object.keys(reqBody).length !== 2) {
    return Promise.reject({ status: 400, msg: "invalid query body" });
  }

  const insertKeys = ["username", "body"];
  for (let i = 0; i < insertKeys.length; i++) {
    if (!reqBody.hasOwnProperty(insertKeys[i])) {
      return Promise.reject({ status: 400, msg: "invalid query body" });
    }
  }

  const { username, body } = reqBody;

  await checkExists("users", "username", username);

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

exports.removeComment = async (comment_id) => {
  await checkExists("comments", "comment_id", comment_id);
  const deleteStr = `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`;

  const { rows } = await db.query(deleteStr, [comment_id]);

  return rows[0];
};

exports.updateCommentVotes = async (comment_id, body) => {
  await checkExists("comments", "comment_id", comment_id);

  if (Object.keys(body).length !== 1) {
    return Promise.reject({ status: 400, msg: "invalid query body" });
  }

  const { inc_votes } = body;

  if (inc_votes === undefined || inc_votes === null) {
    return Promise.reject({ status: 400, msg: "invalid query body" });
  }

  const updateStr = `
  UPDATE comments
  SET votes = votes + $2
  WHERE comment_id = $1
  RETURNING *`;

  const queryParams = [comment_id, inc_votes];

  const { rows } = await db.query(updateStr, queryParams);

  return rows[0];
};
