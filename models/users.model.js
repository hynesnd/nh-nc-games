const db = require("../db/connection");

exports.selectAllUsers = async () => {
  const selectStr = `
SELECT 
username
FROM users;`;

  const { rows } = await db.query(selectStr);

  return rows;
};
