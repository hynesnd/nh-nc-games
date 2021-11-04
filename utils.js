const format = require("pg-format");
const db = require("./db/connection");

//psql bigInt datatype is coerced to string on output.
//for consistency of testing I decided to write this util to drop into models
//and coerce the strings to Number as I am confident that numbers in this app will not exceed 53 bits..
exports.convertBigintStrToNum = (str) => {
  if (!str || str.length === 0) return null;

  return Number(str);
};

exports.checkExists = async (table, column, value) => {
  const queryString = format(
    `
  SELECT
  *
  FROM %I
  WHERE %I = $1`,
    table,
    column
  );

  const { rows } = await db.query(queryString, [value]);

  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: `resource not found: ${value}`,
    });
  }
};
