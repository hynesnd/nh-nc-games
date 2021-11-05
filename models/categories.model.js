const db = require("../db/connection");

exports.selectCategories = async () => {
  const { rows } = await db.query("SELECT slug, description FROM categories;");
  return rows;
};
