const db = require("../db/connection");

exports.selectAllUsers = async () => {
  const selectStr = `
SELECT 
username
FROM users;`;

  const { rows } = await db.query(selectStr);

  return rows;
};

exports.selectUser = async (username) => {
  const selectStr = `
  SELECT
  username,
  avatar_url,
  name
  FROM users
  WHERE username = $1`;

  const { rows } = await db.query(selectStr, [username]);

  return rows[0];
};
