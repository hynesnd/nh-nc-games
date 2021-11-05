const format = require("pg-format");
const db = require("./db/connection");

//checkExists is a re-usable utility for checking if a value exists in a specific table and column in our database
// it takes arguments in the order table, column, value then inserts them into a query SELECT * WHERE column = value
// if the value is found, checkExists resolves to undefined
// if the value is NOT found checkExists will reject with a custom error object {status: 404, msg `resource not found: ${value}}
// this functionality can be used to trip the custom error handler response and the message will notify of the problem value.
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
